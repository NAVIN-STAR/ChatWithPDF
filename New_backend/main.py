from fastapi import FastAPI
from routes.upload_files import router as upload_router
from routes.delete_files import router as delete_router
from routes.chat import router as chat_router
from database import init_db
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import logging


logging.basicConfig(level=logging.DEBUG)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up...")  # You can also call async functions here
    await init_db()
    yield  # This allows the application to run
    print("Shutting down...")

app=FastAPI(lifespan=lifespan)
app.include_router(upload_router)
app.include_router(delete_router)
app.include_router(chat_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)