import torch
import faiss
import pickle
import pandas as pd
import numpy as np
import config
from model import TwoTowerModel

class RecommenderSystem:
    def __init__(self):
        print("Loading Recommender System...")
        self.device = config.DEVICE
        
        # Load Mappings & Scaler
        with open(config.MAPPINGS_PATH, "rb") as f:
            data = pickle.load(f)
            self.track_map = data["track_map"]
            self.genre_map = data["genre_map"]
        
        # Load FAISS Index & Catalog
        self.index = faiss.read_index(config.FAISS_INDEX_PATH)
        self.catalog = pd.read_pickle(config.SONG_CATALOG_PATH).reset_index(drop=True)
        
        # Load Model
        num_tracks = len(self.track_map) + 1
        num_genres = len(self.genre_map) + 1
        
        self.model = TwoTowerModel(num_tracks, num_genres, config.AUDIO_DIM, config.EMBEDDING_DIM)
        self.model.load_state_dict(torch.load(config.MODEL_PATH, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()
        print("System Loaded Successfully!")

    def recommend(self, user_history_df, k=20):
        """
        user_history_df: A pandas DataFrame containing the LAST # songs the user listened to.
        Must have columns: ['track_id', 'playlist_genre', 'audio_features_list', 'weight']
        """
        #If user don't have enough musics in history -> padding
        if len(user_history_df) < config.HISTORY_SIZE:
            curr_len = len(user_history_df)
            # Calculate how many empty rows are needed
            pad_len = config.HISTORY_SIZE - curr_len
            pad_df = pd.DataFrame({
                'track_id': [0] * pad_len,          
                'playlist_genre': [0] * pad_len,     
                'weight': [0.0] * pad_len,           
                'audio_vector': [[0.0] * config.AUDIO_DIM] * pad_len
            })
            user_history_df = pd.concat([pad_df, user_history_df], ignore_index=True)
        user_history_df = user_history_df.tail(config.HISTORY_SIZE)

        # Prepare Inputs
        # Map strings to integers using the loaded maps
        track_idxs = user_history_df['track_id'].map(self.track_map).fillna(0).values
        genre_idxs = user_history_df['playlist_genre'].map(self.genre_map).fillna(0).values
        
        # Convert to Tensors -> server says that i can optimze these tensor creations
        h_t = torch.tensor([track_idxs], dtype=torch.long).to(self.device)
        h_g = torch.tensor([genre_idxs], dtype=torch.long).to(self.device)
        h_w = torch.tensor([user_history_df['weight'].values], dtype=torch.float32).to(self.device)
        
        # Audio Features
        audio_list = np.stack(user_history_df['audio_vector'].values)
        h_a = torch.tensor([audio_list], dtype=torch.float32).to(self.device)
        
        # Generate User Vector
        with torch.no_grad():
            # Dummy targets
            dummy_t = h_t[:, 0]
            dummy_g = h_g[:, 0]
            dummy_a = h_a[:, 0, :]
            
            user_vec, _, _ = self.model(h_t, h_g, h_a, h_w, dummy_t, dummy_g, dummy_a)
            user_vector_np = user_vec.cpu().numpy()

        exclude_ids = set(user_history_df['track_id'].unique())

        # FAISS Search
        D, I = self.index.search(user_vector_np, k * 2)
        
        # Format Results
        recommendations = []
        for idx in I[0]:
            song_row = self.catalog.iloc[idx]
            track_id = song_row['track_id']
            
            #check if the song is in the last # musics listened
            if track_id in exclude_ids: 
                continue 

            recommendations.append({
                "track_name": song_row['track_name'],
                "track_id": song_row['track_id'],
                "artist": song_row['track_artist'],
                "genre": song_row['playlist_genre'],
                "duration_ms": int(song_row['duration_ms_raw'])
            })
            if len(recommendations) >= k:
                break
            
        return recommendations
