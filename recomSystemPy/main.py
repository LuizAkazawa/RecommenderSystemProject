from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
music_database = []
class MusicItem(BaseModel):
    title: str
    artist: str
    duration: float

# 2. THE RECEIVER (POST): Allows React Native to add data
@app.post("/music")
def add_music(item: MusicItem):
    music_database.append(item)  # Add the new song to our list
    return {"message": "Music added successfully", "data": item}

# 3. THE VIEWER (GET): Allows your Browser to see the data
@app.get("/music")
def get_music():
    return music_database  # Return the full list