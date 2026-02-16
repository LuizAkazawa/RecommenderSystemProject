from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()
music_database = []
signup_database = []
login_database = []
class MusicItem(BaseModel):
    title: str
    artist: str
    duration: float

class UserInfo(BaseModel):
    name: str
    password: str

@app.post("/signup")
def add_user(user: UserInfo):
    if user in signup_database:
        raise HTTPException(status_code=400, detail="User already exists")
    signup_database.append(user)  
    return {"message": "Signup successful", "data": user}


@app.get("/signup")
def debug_signup():
    return signup_database


@app.post("/login")
def verify_login(user: UserInfo):
    login_database.append(user)
    if user in signup_database:
        return {"message": "Login successful", "user": user.name}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/login")
def debug_login():
    return login_database


@app.post("/music")
def add_music(item: MusicItem):
    music_database.append(item)
    return {"message": "Music added successfully", "data": item}


@app.get("/music")
def get_music():
    return music_database 