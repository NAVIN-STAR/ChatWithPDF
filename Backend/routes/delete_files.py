from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import *
import os

uploaded_folder = "uploads"
vector_store = "vector_store"

router = APIRouter()

@router.delete("/delete/{file_id}")
async def delete_file(file_id: int, db: AsyncSession = Depends(get_db)):
    try:
        # Get file record from DB
        result = await db.execute(select(UploadedFiles).where(UploadedFiles.id == file_id))
        existing_file = result.scalars().first()

        if not existing_file:
            raise HTTPException(status_code=404, detail="File not found in database")

        # Define all related paths
        vector_index_path = os.path.join(vector_store, f"{existing_file.id}.index")
        vector_pkl_path = os.path.join(vector_store, f"{existing_file.id}_chunks.pkl")
        uploaded_file_path = existing_file.filepath

        # Attempt to delete each file if it exists
        for path in [vector_index_path, vector_pkl_path, uploaded_file_path]:
            if os.path.exists(path):
                os.remove(path)

        # Delete DB entry
        await db.delete(existing_file)
        await db.commit()

        return {"message": "File and associated data deleted successfully"}

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deletion failed: {str(e)}")
