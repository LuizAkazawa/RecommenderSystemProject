# Recommender System 

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## About the Project

This project was developed with the goal of expanding my portfolio and deepening my practical knowledge in **Recommender Systems**, while also covering the full software development workflow (full-stack architecture, data modeling, containerization, and integration).

The application offers a complete user flow with Login, Sign Up, a Home screen with recommendations, and a Details screen for the recommended items.

## Demo

![Demo: Login -> Home -> Details](./demo.gif)

## Tech Stack

* **Front-end:** React Native
* **Back-end:** Python (FastAPI)
* **Machine Learning & Search:** PyTorch (Two-Tower Model) and FAISS (Similarity Search)
* **Database:** PostgreSQL
* **Infrastructure:** Docker and Docker Compose

## Architecture and Recommendation Logic

The recommendation engine is powered by a custom **Two-Tower Model**, built with PyTorch, which works in tandem with **PostgreSQL** and **FAISS** to deliver real-time, personalized suggestions.

* **Dynamic User & Item Embedding (Two-Tower):** Instead of a static model for users, the system uses an Item Tower to generate dense embeddings for tracks, genres, and audio features. To represent the user, the model dynamically calculates a "User Vector" by taking a weighted sum of the embeddings from their recent listening history. The trained neural network weights are saved as a `.pth` file, while data mappings and scaling configurations are stored as `.pkl` artifacts for inference.
* **Real-time History Tracking (PostgreSQL):** The backend actively captures the user's listening sessions via the `/music` endpoint and stores this context in the `user_interactions` PostgreSQL table. This historical data is fetched on-the-fly to construct the dynamic user vector whenever a recommendation is requested.
* **High-Performance Similarity Search (FAISS):** During the training pipeline, embeddings for the entire song catalog are computed and indexed using FAISS. Because we applied an L2 normalization to force the vectors to a length of 1, FAISS's Inner Product search (`IndexFlatIP`) performs a mathematically equivalent and highly optimized Cosine Similarity calculation. During inference, the dynamic user vector queries this index to find the closest matching songs, automatically filtering out tracks the user has already listened to.

## How to run the project locally

### Prerequisites
* [Node.js](https://nodejs.org/) and npm/yarn
* [Docker](https://www.docker.com/) and Docker Compose
* React Native development environment set up (Android Studio / Xcode)

### Step-by-step

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LuizAkazawa/RecommenderSystemProject
   cd RecommenderSystemProject

2. **Start the Database with Docker and run the Back-end**
    ```bash
    # At the root of the project, start the PostgreSQL container
    docker-compose up -d

    # Install dependencies and start the Backend
    cd backend/app 
    pip install -r requirements.txt 
    uvicorn main:app

3. **Start the Front-end (React Native):**
    Open a new terminal window at the root of the project.
    ```bash
    # Install the app dependencies
    npm install
    # or yarn install

    # To run on Android:
    npx react-native run-android
## TODO
- Improve and comment database population script
- Documentation
- Explanation video
