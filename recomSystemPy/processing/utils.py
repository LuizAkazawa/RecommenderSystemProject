import psycopg2
import pandas as pd

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",          
        database="music_app_db",   
        user="myuser",             
        password="mypassword",     
        port="5432"
    )
    return conn


def get_user_history(user_id: int, scaler):
    """
    Fetches the raw history for a specific user_id and cleans it
    so the AI model can understand it.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = '''
        SELECT 
            UI.track_id, T.playlist_genre, UI.played_duration_ms, T.duration_ms,
            T.danceability, T.energy, T.valence, T.loudness, T.tempo, 
            T.acousticness, T.instrumentalness, T.liveness, T.speechiness, T.mode, T.key
        FROM tracks as T 
        JOIN user_interactions as UI ON T.track_id = UI.track_id
        WHERE UI.user_id = %s
        ORDER BY UI.timestamp DESC
        LIMIT 10;
    '''
    cursor.execute(query, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return None

    columns = [
        'track_id', 'playlist_genre', 'played_duration_ms', 'duration_ms',
        'danceability', 'energy', 'valence', 'loudness', 'tempo',
        'acousticness', 'instrumentalness', 'liveness', 'speechiness', 'mode', 'key'
    ]
    df = pd.DataFrame(rows, columns=columns)

    df['weight'] = (df['played_duration_ms'] / df['duration_ms']).clip(0.0, 1.0)
    
    cols_to_scale = ['tempo', 'loudness', 'key', 'duration_ms']
    df[cols_to_scale] = scaler.transform(df[cols_to_scale])
    
    feature_cols = [
        'danceability', 'energy', 'valence', 'loudness', 'tempo',
        'acousticness', 'instrumentalness', 'liveness', 'speechiness', 'mode',
        'key', 'duration_ms'
    ]
    df['audio_vector'] = df[feature_cols].values.tolist()
    
    return df



def load_data_userInteractions():
    conn = get_db_connection()
    query = """
        SELECT user_id, track_id, played_duration_ms, total_duration_ms 
        FROM user_interactions
    """
    print("Starting Data Stream from Postgres...")
    chunks = []
    for chunk_df in pd.read_sql(query, conn, chunksize=50000):
        chunk_df['weight'] = (chunk_df['played_duration_ms'] / chunk_df['total_duration_ms']).clip(0, 1)
        chunk_df = chunk_df.drop(columns=['played_duration_ms', 'total_duration_ms'])
        chunks.append(chunk_df)
        print(f"Loaded a chunk of {len(chunk_df)} rows...")

    full_df = pd.concat(chunks, ignore_index=True)
    print(f"Loaded {len(full_df)} rows successfully!")
    conn.close()
    return full_df

def load_data_tracks():
    conn = get_db_connection() 
    query = "SELECT * FROM tracks"

    audio_cols = [
        'track_popularity', 'danceability', 'energy', 'key', 'loudness', 
        'mode', 'valence', 'tempo', 'speechiness', 'acousticness', 
        'instrumentalness', 'liveness', 'duration_ms'
    ]
    
    print("Streaming Tracks Data from Postgres...")
    chunks = []
    
    for chunk_df in pd.read_sql(query, conn, chunksize=50000):
        
        for col in audio_cols:
            if col in chunk_df.columns:
                chunk_df[col] = pd.to_numeric(chunk_df[col], errors='coerce')
                
        # Drop rows that failed conversion
        chunk_df = chunk_df.dropna(subset=audio_cols)
        chunks.append(chunk_df)
        print(f"Loaded a chunk of {len(chunk_df)} tracks...")
    full_df = pd.concat(chunks, ignore_index=True)
    conn.close()
    
    print(f"Loaded {len(full_df)} tracks successfully!")
    return full_df