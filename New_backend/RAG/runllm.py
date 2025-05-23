import os,requests
from config import HF_API_KEY

HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"

def get_llm_response(query:str,context_chuks:list[str])->str:
    
    context="\n\n".join(context_chuks)
    
    prompt=(
            '''You are a knowledgeable assistant and skilled editor. Use ONLY the information provided in the “Context” section to answer the question. 
Write your answer with correct grammar, clear phrasing, proper punctuation, and correct spacing. Use as much words as needed to fully answer the question. 
If the answer is not contained within the context, respond with “I’m sorry, I don’t know.
            \n\n'''
        f"Context:\n{context}\n\n"
        f"Question:\n{query}\n\n"
        "Answer:"
    )

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.5, }
    }

    response = requests.post(HF_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"HF API error: {response.status_code}, {response.text}")

    result= response.json()
    

    if isinstance(result, list) and "generated_text" in result[0]:
        result=result[0]["generated_text"].split("Answer:")[-1].strip()
        print(result)
        return result
    
    return "Failed to parse LLM response."