import sys
from pathlib import Path

current_file = Path(__file__).resolve()
project_root = current_file.parent.parent  # up to 2 levels
sys.path.append(str(project_root))

import pandas as pd
import numpy as np
import torch
import torch.optim as optim
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import faiss
import pickle
from sklearn.preprocessing import MinMaxScaler

from app import config
from app.ml.model import TwoTowerModel
from app.utils import load_data_userInteractions, load_data_tracks



def run_pipeline():
    print("--- LOADING & PROCESSING DATA ---")
    df_tracks = load_data_tracks()
    df_interactions = load_data_userInteractions()
    
    df_merged = pd.merge(df_interactions, df_tracks, on='track_id', how='left')
    
    # Mappings
    track_map = {id: i+1 for i, id in enumerate(df_merged['track_id'].unique())}
    genre_map = {g: i+1 for i, g in enumerate(df_merged['playlist_genre'].unique())}
    user_map = {u: i for i, u in enumerate(df_merged['user_id'].unique())}
    
    df_merged['track_idx'] = df_merged['track_id'].map(track_map)
    df_merged['genre_idx'] = df_merged['playlist_genre'].map(genre_map)
    df_merged['user_idx'] = df_merged['user_id'].map(user_map)

    df_merged['duration_ms_raw'] = df_merged['duration_ms']
    # Scaling
    scaler = MinMaxScaler()
    scale_cols = ['tempo', 'loudness', 'key', 'duration_ms']
    df_merged[scale_cols] = scaler.fit_transform(df_merged[scale_cols])
    
    # Save artifacts
    with open(config.MAPPINGS_PATH, "wb") as f:
        pickle.dump({"track_map": track_map, "genre_map": genre_map, "user_map": user_map}, f)
    with open(config.SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)
        
    df_merged['audio_vector'] = df_merged[config.FEATURE_COLS].values.tolist()

    print("--- PREPARING SEQUENCES ---")
    df_merged = df_merged.sort_values(by=['user_idx'])
    user_groups = df_merged.groupby('user_idx')
    sequences = []
    
    for _, group in user_groups:
        tracks = group['track_idx'].values
        genres = group['genre_idx'].values
        ratios = group['weight'].values
        audios = np.stack(group['audio_vector'].values)
        
        for i in range(config.HISTORY_SIZE, len(tracks)):
            sequences.append((
                tracks[i-config.HISTORY_SIZE:i],
                genres[i-config.HISTORY_SIZE:i],
                ratios[i-config.HISTORY_SIZE:i],
                audios[i-config.HISTORY_SIZE:i],
                tracks[i], genres[i], audios[i]
            ))
            
    # Dataset Class
    class SpotifyDataset(Dataset):
        def __init__(self, data): self.data = data
        def __len__(self): return len(self.data)
        def __getitem__(self, idx):
            row = self.data[idx]
            return (torch.tensor(row[0], dtype=torch.long), torch.tensor(row[1], dtype=torch.long),
                    torch.tensor(row[3], dtype=torch.float32), torch.tensor(row[2], dtype=torch.float32),
                    torch.tensor(row[4], dtype=torch.long), torch.tensor(row[5], dtype=torch.long),
                    torch.tensor(row[6], dtype=torch.float32))

    train_loader = DataLoader(SpotifyDataset(sequences), batch_size=config.BATCH_SIZE, shuffle=True)

    print("--- TRAINING MODEL ---")
    model = TwoTowerModel(len(track_map)+1, len(genre_map)+1, config.AUDIO_DIM, config.EMBEDDING_DIM).to(config.DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = nn.CrossEntropyLoss()
    
    for epoch in range(config.EPOCHS):
        model.train()
        total_loss = 0
        for batch_idx, batch in enumerate(train_loader):
            h_t, h_g, h_a, h_w, t_t, t_g, t_a = [b.to(config.DEVICE) for b in batch]
            optimizer.zero_grad()

            u_vec, i_vec, temp = model(h_t, h_g, h_a, h_w, t_t, t_g, t_a)
            logits = torch.matmul(u_vec, i_vec.T) / temp
            loss = loss_fn(logits, torch.arange(logits.shape[0]).to(config.DEVICE))
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

            if batch_idx % 1000 == 0:
                print(f"Epoch {epoch+1} | Batch {batch_idx} | Loss: {loss.item():.4f}")
        print()
        print(f"Epoch {epoch+1} Avg Loss: {total_loss/len(train_loader):.4f}")
        
    torch.save(model.state_dict(), config.MODEL_PATH)
    
    print("--- BUILDING FAISS INDEX ---")
    # Catalog creation logic
    df_catalog = df_merged.drop_duplicates(subset=['track_idx']).sort_values('track_idx')
    df_catalog = df_catalog[df_catalog['track_idx'] > 0] #removing padding
    
    # Creating/Storing vector for each music
    all_vecs = []  
    model.eval()
    with torch.no_grad():
        # Process in chunks to avoid high memory usage
        for i in range(0, len(df_catalog), 1000):
            batch = df_catalog.iloc[i:i+1000]
            t_t = torch.tensor(batch['track_idx'].values, dtype=torch.long).to(config.DEVICE)
            t_g = torch.tensor(batch['genre_idx'].values, dtype=torch.long).to(config.DEVICE)
            t_a = torch.tensor(np.stack(batch['audio_vector'].values), dtype=torch.float32).to(config.DEVICE)
            vecs = model.get_item_representation(t_t, t_g, t_a)
            all_vecs.append(vecs.cpu().numpy())
            
    song_matrix = np.concatenate(all_vecs, axis=0)
    index = faiss.IndexFlatIP(64)
    index.add(song_matrix)
    
    faiss.write_index(index, config.FAISS_INDEX_PATH)
    df_catalog.to_pickle(config.SONG_CATALOG_PATH)
    print("Pipeline Complete. Files ready for server.")

if __name__ == "__main__":
    run_pipeline()