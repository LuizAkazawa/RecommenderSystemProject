from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# A data model for what we expect from React Native
class UserRequest(BaseModel):
    username: str

@app.get("/")
def read_root():
    return {"message": "Hello from Python Backend!"}

@app.post("/login")
def login_user(user: UserRequest):
    return {"status": "success", "user": user.username, "token": "fake-jwt-token"}

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# 1. THE STORAGE: A simple list to hold data in memory
# (Note: If you restart the server, this list clears out)
music_database = []

class MusicItem(BaseModel):
    title: str
    artist: str

# 2. THE RECEIVER (POST): Allows React Native to add data
@app.post("/music")
def add_music(item: MusicItem):
    music_database.append(item)  # Add the new song to our list
    return {"message": "Music added successfully", "data": item}

# 3. THE VIEWER (GET): Allows your Browser to see the data
@app.get("/music")
def get_music():
    return music_database  # Return the full list