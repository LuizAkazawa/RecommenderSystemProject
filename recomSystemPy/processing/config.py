import torch

# Paths
MODEL_PATH = "spotify_two_tower.pth"
MAPPINGS_PATH = "mappings.pkl"
SCALER_PATH = "scaler.pkl"
FAISS_INDEX_PATH = "spotify_songs.index"
SONG_CATALOG_PATH = "song_catalog.pkl"

# Hyperparameters
BATCH_SIZE = 256
EMBEDDING_DIM = 64
HISTORY_SIZE = 10 
AUDIO_DIM = 12
EPOCHS = 5

# Feature Columns
FEATURE_COLS = [
    'danceability', 'energy', 'valence', 'loudness', 'tempo',
    'acousticness', 'instrumentalness', 'liveness', 'speechiness', 'mode',
    'key', 'duration_ms'
]

# Device
DEVICE = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
# For Linux/Windows server:
# DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")