# rag/create_embeddings.py
import os
import pickle
import numpy as np
import faiss
import asyncio
import logging

VECTOR_DIR = "vector_store"
os.makedirs(VECTOR_DIR, exist_ok=True)
logger = logging.getLogger(__name__)

import aiofiles

async def create_embeddings_and_save(chunks: list[str], file_id: int, embeddings: list[list[float]]):
    try:
        # if progress_cb:
        #     await progress_cb(f"Embedding {len(chunks)} chunks using external API...")

        dim = len(embeddings[0])
        index = faiss.IndexFlatL2(dim)
        index.add(np.array(embeddings).astype("float32")) 

        # Saving the index asynchronously
        index_path = os.path.join(VECTOR_DIR, f"{file_id}.index")
        await asyncio.to_thread(faiss.write_index, index, index_path)

        # Saving the chunks asynchronously
        chunks_path = os.path.join(VECTOR_DIR, f"{file_id}_chunks.pkl")
        async with aiofiles.open(chunks_path, "wb") as f:
            await f.write(pickle.dumps(chunks))

        # if progress_cb:
        #     progress_cb("✅ Embedding and storage complete")
        return True
    except Exception as e:
        logger.error(f"Failed to create and save embeddings for file_id={file_id}: {e}")
        raise
