from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
from app.ml.inference import RecommenderSystem
from utils import get_db_connection, get_user_history

app = FastAPI()

# recommender 
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

recsys = RecommenderSystem()

conn = get_db_connection()
conn.autocommit = True
cursor = conn.cursor()

# Using for debug/workflow visualization
music_database = []
signup_database = []
login_database = []

class userInteraction(BaseModel):
    username : str
    track_id: str
    played_duration: int
    total_duration: int

class UserInfo(BaseModel):
    name: str
    password: str

@app.get("/recommend/{user_id}")
def recommend_endpoint(user_id: int):
    """
    The frontend calls:
    Example URL: http://localhost:8000/recommend/54
    """
    user_history_df = get_user_history(user_id, scaler)
    
    if user_history_df is None:
        raise HTTPException(status_code=404, detail="User not found or no history")
    
    try:
        recommendations = recsys.recommend(user_history_df, k=50)
    except Exception as e:
        print(f"AI Model Error: {e}")
        raise HTTPException(status_code=500, detail="Error generating recommendations")
    
    return {
        "user_id": user_id,
        "recommendations": recommendations
    }

@app.post("/signup")
def add_user(user: UserInfo):
    check_query = "SELECT username FROM users WHERE username = %s"
    cursor.execute(check_query, (user.name,))
    if cursor.fetchone() is not None:
        raise HTTPException(status_code=400, detail="User already exists")

    signup_database.append(user)   #just for debuging

    insert_query = "INSERT INTO users (username) VALUES (%s)"
    cursor.execute(insert_query, (user.name,))
    conn.commit()

    return {"message": "Signup successful", "data": user}


@app.get("/signup")
def debug_signup():
    return signup_database


@app.post("/login")
def verify_login(user: UserInfo):
    login_database.append(user)
    query = '''
        SELECT user_id, username FROM users WHERE username = %s
    '''
    cursor.execute(query, (user.name,))
    result = cursor.fetchone()

    if result is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "message": "Login successful", 
        "user_id": result[0],  
        "username": result[1] 
    }


@app.get("/login")
def debug_login():
    return login_database


@app.post("/music")
def add_music(userI: userInteraction):
    query_get = '''
        SELECT user_id FROM users WHERE username=%s
    '''
    cursor.execute(query_get, (userI.username,))
    response = cursor.fetchone()
    if response is None:
        raise HTTPException(status_code=404, detail="Critical: User not found !!! ")

    user_id = response[0]

    query = '''
        INSERT INTO user_interactions (user_id, track_id, played_duration_ms, total_duration_ms)
        VALUES (%s, %s, %s, %s)
    '''
    cursor.execute(query, (user_id, userI.track_id, userI.played_duration, userI.total_duration,))
    conn.commit()

    music_database.append(userI)
    return {"message": "Music added successfully", "data": userI}


@app.get("/music")
def get_music():
    return music_database 