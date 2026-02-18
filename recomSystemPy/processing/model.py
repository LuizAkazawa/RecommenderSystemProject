import torch
import torch.nn as nn
import torch.nn.functional as F
import config

class TwoTowerModel(nn.Module):
    def __init__(self, 
                 num_tracks: int, 
                 num_genres: int, 
                 audio_feature_dim: int = config.AUDIO_DIM, 
                 embedding_dim: int = config.EMBEDDING_DIM ):
        super().__init__()
        
        # --- Layers ---
        self.track_embedding = nn.Embedding(num_tracks, embedding_dim)
        self.genre_embedding = nn.Embedding(num_genres, embedding_dim)
        
        self.audio_mlp = nn.Sequential(
            nn.Linear(audio_feature_dim, 32),
            nn.ReLU(),
            nn.Linear(32, embedding_dim) 
        )
        
        self.projection = nn.Sequential(
            nn.Linear(embedding_dim * 3, embedding_dim * 2),
            nn.ReLU(),
            nn.Linear(embedding_dim * 2, embedding_dim)
        )
        
        # Temperature Parameter 
        # helps the model sharpen its predictions increasing the gap between correct and incorrect
        # Starting at 0.07 (a little bit agressive)
        self.temperature = nn.Parameter(torch.tensor(0.07))

    # Item Tower 
    def get_item_representation(self, track_ids, genre_ids, audio_features):
        track_emb = self.track_embedding(track_ids) 
        genre_emb = self.genre_embedding(genre_ids) 
        audio_emb = self.audio_mlp(audio_features)  
        
        combined = torch.cat([track_emb, genre_emb, audio_emb], dim=-1)
        vector = self.projection(combined)
        
        # L2 normalization
        # Force the vector to have length 1 so Dot Product == Cosine Similarity
        # Prevents the dot product from exploding
        return F.normalize(vector, p=2, dim=1)

    def forward(self, h_track_ids, h_genre_ids, h_audio_features, h_weights,
                t_track_id, t_genre_id, t_audio_feature):
        
        # User Vector 
        batch_size, seq_len = h_track_ids.shape
        flat_h_track = h_track_ids.view(-1)
        flat_h_genre = h_genre_ids.view(-1)
        flat_h_audio = h_audio_features.view(-1, h_audio_features.shape[-1])
        
        flat_h_vectors = self.get_item_representation(flat_h_track, flat_h_genre, flat_h_audio)
        h_vectors = flat_h_vectors.view(batch_size, seq_len, -1)
        
        weights_expanded = h_weights.unsqueeze(-1)
        weighted_history = h_vectors * weights_expanded
        user_vector_raw = weighted_history.sum(dim=1) / (weights_expanded.sum(dim=1) + 1e-8)
        
        # Normalize User Vector 
        user_vector = F.normalize(user_vector_raw, p=2, dim=1)
        
        # Target Item Vector 
        target_vector = self.get_item_representation(t_track_id, t_genre_id, t_audio_feature)
        
        # SCALED DOT PRODUCT 
        # Cosine Similarity / Temperature
        # If vectors are normalized ( = 1), Dot Product IS Cosine Similarity
        # We divide by temperature to scale the logits up for CrossEntropy
        return user_vector, target_vector, self.temperature