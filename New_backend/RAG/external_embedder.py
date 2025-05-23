# rag/external_embedder.py
import logging
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

# Load the model once at module level
model = SentenceTransformer("all-MiniLM-L6-v2")

def embed_chunks_local(chunks: list[str]) -> list[list[float]]:
    """
    Generate embeddings for a list of text chunks using a local SentenceTransformer model.
    """
    try:
        embeddings =  model.encode(chunks, normalize_embeddings=True)
        return embeddings.tolist()
    except Exception as e:
        logger.error(f"Error embedding chunks: {e}")
        raise

def embed_query_local(query: str) -> list[float]:
    """
    Generate an embedding for a single query string using a local SentenceTransformer model.
    """
    try:
        embedding = model.encode(query, normalize_embeddings=True)
        return embedding.tolist()
    except Exception as e:
        logger.error(f"Error embedding query: {e}")
        raise
