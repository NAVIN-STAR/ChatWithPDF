# Read File and extracts chunks
import os
import PyPDF2
import docx
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

#constants
chunk_size=400
chunk_overlap=100

def extract_text(filepath:str)->str:
    
    ext=os.path.splitext(filepath)[1].lower()

    if ext=='.pdf':
        return extract_pdf(filepath)
    
    elif ext=='.docx':
        return extract_docx(filepath)
    
    elif ext=='.txt':
        return extract_txt(filepath)

    else:
        raise ValueError ("Unsupported file type")
        

def extract_pdf(filepath:str)->str:
    text=""
    with open(filepath, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text+=page.extract_text() or ""
    return text

def extract_docx(filepath:str)->str:
    text=""
    docs=docx.Document(filepath)
    for para in docs.paragraphs:
        text+=para.text or ""
    return text

def extract_txt(filepath:str)->str:
    text=""
    with open(filepath, 'r', encoding='utf-8') as file:
        text=file.read()
    return text


def chunk_texts(text:str)->list[Document]:
    text_splitter=RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,

    )
    chunks=text_splitter.create_documents([text])
    return chunks
    

def split_and_chunk(filepath:str)->list[Document]:
    text=extract_text(filepath)
    return chunk_texts(text)





  

    
