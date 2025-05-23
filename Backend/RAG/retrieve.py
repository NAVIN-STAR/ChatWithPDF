from sentence_transformers import SentenceTransformer
import faiss
import os,pickle
import numpy as np
import asyncio



Vector_dir='vector_store'
model=SentenceTransformer('all-MiniLM-L6-v2')

async def create_faiss_index(chunks: list[str], file_id: str, progress_cb=None):
    os.makedirs(Vector_dir, exist_ok=True)

    batch_size =20
    all_embeddings = []
    loop = asyncio.get_running_loop()

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        embeddings = await loop.run_in_executor(
            None,  # Uses default executor
            lambda: model.encode(batch)
        )
        all_embeddings.extend(embeddings)

        if progress_cb:
            progress_cb(f"Encoded {i + len(batch)} / {len(chunks)} chunks")

    index = faiss.IndexFlatL2(len(all_embeddings[0]))
    index.add(np.array(all_embeddings))

    await loop.run_in_executor(
        None,
        lambda: faiss.write_index(index, os.path.join(Vector_dir, f"{file_id}.index"))
    )

    await loop.run_in_executor(
        None,
        lambda: pickle.dump(chunks, open(os.path.join(Vector_dir, f"{file_id}_chunks.pkl"), "wb"))
        )

    return True


def load_faiss_index(querry:str,top_k:int,fil_id:str):

    index=faiss.read_index(os.path.join(Vector_dir,f"{fil_id}.index"))

    with open(os.path.join(Vector_dir,f"{fil_id}_chunks.pkl"),"rb") as f:
        chunks=pickle.load(f)

    querry_vec=model.encode([querry])

    distance, Indixes=index.search(np.array(querry_vec),top_k)

    relevant_chunks=[chunks[i] for i in Indixes[0]]
    print(relevant_chunks)

    return relevant_chunks
    


        





   