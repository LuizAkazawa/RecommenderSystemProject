CREATE TABLE user_interactions (
    interaction_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    track_id char(22) REFERENCES tracks(track_id),
    played_duration_ms INTEGER,  
    total_duration_ms INTEGER,   
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    action_type VARCHAR(20)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    user_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);  

/*Used in explore_data.ipynb*/
CREATE TABLE tracks (
    track_id CHAR(22) PRIMARY KEY,
    track_name TEXT,                  
    track_artist TEXT,                
    track_popularity INT,
    track_album_id CHAR(22),
    track_album_name TEXT,            
    track_album_release_date VARCHAR(20), 
    playlist_name TEXT,               
    playlist_id VARCHAR(50),          
    playlist_genre VARCHAR(50),       
    playlist_subgenre VARCHAR(50),    
    danceability DOUBLE PRECISION,    
    energy DOUBLE PRECISION,
    key INT,
    loudness DOUBLE PRECISION,
    mode INT,
    speechiness DOUBLE PRECISION,
    acousticness DOUBLE PRECISION,    
    instrumentalness DOUBLE PRECISION,
    liveness DOUBLE PRECISION,
    valence DOUBLE PRECISION,
    tempo DOUBLE PRECISION,           
    duration_ms INT
);