from fastapi import APIRouter,HTTPException
from RAG.retrieve import load_faiss_index
from RAG.runllm import get_llm_response
from pydantic import BaseModel

router=APIRouter()

class ChatRequest(BaseModel):
    query:   str
    file_id: int
    top_k:   int = 5

@router.post("/chat/")
def chat(req: ChatRequest):
    try:
        # Step 1: Get relevant chunks using FAISS
        relevant_chunks = load_faiss_index(req.query, req.top_k, req.file_id)

        # if not relevant_chunks:
        #     raise HTTPException(status_code=404, detail="No relevant content found for this file.")

        # Step 2: Combine chunks and generate answer
        context = "\n".join(relevant_chunks)
        answer = get_llm_response(req.query, context)

        return {"answer":answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")