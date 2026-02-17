from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2


def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",          
        database="music_app_db",   
        user="myuser",             
        password="mypassword",     
        port="5432"
    )
    return conn



conn = get_db_connection()
conn.autocommit = True
cursor = conn.cursor()

app = FastAPI()

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

@app.get("/tracks")
def getN_tracks():
    query = '''
            SELECT track_id, track_name, duration_ms 
            FROM tracks 
            ORDER BY RANDOM() 
            LIMIT 12;
        '''
    cursor.execute(query)
    rows = cursor.fetchall()

    formatted_data = []
    for row in rows:
        formatted_data.append({
            'track_id': row[0],      
            'track_name': row[1],
            'total_duration': row[2]
        })

    return formatted_data

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
        SELECT username FROM users WHERE username = %s
    '''
    cursor.execute(query, (user.name,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")


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