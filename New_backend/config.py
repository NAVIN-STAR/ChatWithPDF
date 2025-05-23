from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
HF_API_KEY=os.getenv("HF_API_KEY")


