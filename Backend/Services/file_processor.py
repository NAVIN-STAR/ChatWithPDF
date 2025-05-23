# services/background_tasks.py
import logging
from RAG.chunks import split_and_chunk
from RAG.create_embeddings import create_embeddings_and_save
from RAG.external_embedder import embed_chunks_local
from queue_store import file_status_queues
import asyncio

logger = logging.getLogger(__name__)

async def process_file_task_local(filepath: str, file_id: int):
    # queue = file_status_queues.get(file_id)
    # if not queue:
    #     return  # No SSE listener

    try:
        # await queue.put("🔍 Reading and chunking the file...")
        documents = split_and_chunk(filepath)  # Extract text and chunk it
        chunks = [doc.page_content for doc in documents]

        # await queue.put(f"📄 Extracted {len(chunks)} chunks.")

        # await queue.put("🔗 Sending chunks for embedding...")
        # await asyncio.sleep(5)
        embeddings =  embed_chunks_local(chunks)  # External embedding API call

        # await queue.put("🧠 Storing embeddings in vector DB (FAISS)...")
        await create_embeddings_and_save(chunks, file_id, embeddings)  # Save embeddings and chunks to FAISS

    except Exception as e:
        logger.error(f"Error processing file {file_id}: {e}")
        
