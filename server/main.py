from fastapi import FastAPI
from routes.upload import upload_router
from routes.query import query_router
# from routes.delete import appdelete
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
import os


app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)


def check_database_connection():
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")


check_database_connection()


app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(query_router, prefix="/query", tags=["Query"])


# app.include_router(appdelete, tags=["Delete"])


@app.get("/")
async def root():
    return {"message": "Welcome to the PDF Search Engine API!"}
