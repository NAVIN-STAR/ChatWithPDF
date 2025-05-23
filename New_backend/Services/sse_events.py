# services/sse_events.py
import logging
import asyncio
from queue_store import file_status_queues
from fastapi import Request

logger = logging.getLogger(__name__)

async def event_generator(file_id: int, request: Request):
    client_ip = request.client.host
    logger.info(f"🔗 SSE client {client_ip} connected for file_id={file_id}")
    
    queue = file_status_queues.get(file_id)
    if not queue:
        logger.warning(f"Queue not found for file ID {file_id}")
        yield {"event": "message", "data": "failed"}
        return

    try:
        while True:
            if await request.is_disconnected():
                logger.warning(f"🚫 Client {client_ip} disconnected for file_id={file_id}")
                break

            status = await queue.get()
            yield {"event": "message", "data": status}


            if status == "done" or status == "failed":
                
                logger.info(f"✅ SSE stream complete for file_id={file_id}")
                

            logger.info(f"📤 Sending SSE status: {status}")
            # yield {"event": "message", "data": status}

    except asyncio.CancelledError:
        logger.warning(f"❗ SSE stream cancelled for file_id={file_id}")
    except Exception as e:
        logger.error(f"🔥 SSE error for file_id={file_id}: {e}", exc_info=True)
        yield {"event": "error", "data": "internal_error"}
    finally:
        file_status_queues.pop(file_id, None)
        logger.info(f"🧹 Cleaned up queue for file_id={file_id}")
