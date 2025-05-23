import os
from Services.sse_events import event_generator
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks, Request,WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import UploadedFiles
from database import get_db
import aiofiles,asyncio
from Services.file_processor import process_file_task_local
from queue_store import file_status_queues
from sse_starlette.sse import EventSourceResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

CHUNK_SIZE = 1024 * 1024
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload/")
async def upload_file(BackgroundTasks: BackgroundTasks, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(UploadedFiles).where(UploadedFiles.filename == file.filename)
        )
        existingFile = result.scalars().first()

        if existingFile:
            await db.rollback()
            raise HTTPException(status_code=400, detail="File already exists")

        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        async with aiofiles.open(file_path, "wb") as out_file:
            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break
                await out_file.write(chunk)

        file_size = os.path.getsize(file_path)

        new_file = UploadedFiles(
            filename=file.filename, filepath=file_path, filesize=file_size
        )
        db.add(new_file)
        await db.commit()
        await db.refresh(new_file)
        logger.info(f"🔑 DB-assigned file ID: {new_file.id}")
        # file_status_queues[new_file.id] = asyncio.Queue()
        BackgroundTasks.add_task(process_file_task_local, file_path, new_file.id)

        return {"message": "File uploaded successfully", "file_id": new_file.id}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# SSE endpoint
# @router.get("/upload/stream_status/{file_id}")
# async def stream_status(file_id: int, request: Request):
#     return EventSourceResponse(event_generator(file_id, request), media_type="text/event-stream")

# @router.websocket("/upload/stream_status/{file_id}")
# async def websocket_status(websocket: WebSocket, file_id: int):
#     await websocket.accept()
#     queue = file_status_queues.get(file_id)
#     if not queue:
#         await websocket.send_text("File processing not found.")
#         await websocket.close()
#         return

#     try:
#         # Send status updates to the WebSocket client
#         while True:
#             status = await queue.get()
#             await websocket.send_text(status)

#             if status == "done":
#                 break

#     except WebSocketDisconnect:
#         logger.info(f"Client disconnected from file {file_id} status stream")
#     except Exception as e:
#         logger.error(f"Error while sending updates: {e}")
#         await websocket.send_text(f"Error: {str(e)}")
#     finally:
#         await websocket.close()