import torch
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
DATASET_DIR = BASE_DIR / "dataset"


# Paths
MODEL_PATH = ARTIFACTS_DIR / "spotify_two_tower.pth"
SCALER_PATH = ARTIFACTS_DIR / "scaler.pkl"
FAISS_INDEX_PATH = str(ARTIFACTS_DIR / "spotify_songs.index")
SONG_CATALOG_PATH = ARTIFACTS_DIR / "song_catalog.pkl"
MAPPINGS_PATH = ARTIFACTS_DIR / "mappings.pkl"

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