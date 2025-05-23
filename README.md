
# ChatWithPDF

ChatWithPDF is a web application that enables users to upload PDF (and other text) documents and chat with their content using Retrieval-Augmented Generation (RAG). It combines document chunking, embedding-based similarity search, and large language model responses to provide contextual and accurate answers from uploaded files.

---

## Features

- Upload PDF, TXT, or Word files
- Files are chunked and embedded for semantic search in the background
- FastAPI backend with asynchronous processing
- Stateless chat interface for interacting with document content
- Modular RAG implementation with FAISS vector store and external embedding API

---

## Screenshot


![ChatWithPDF - Upload Screen](image.png)

---

## Technology Stack

- Backend: FastAPI, Python, Asyncio
- Vector Search: FAISS
- Embeddings: External API
- Database: PostgreSQL (for file metadata)
- Frontend: HTML, JavaScript, Tailwind CSS

---

## Setup and Installation

### Prerequisites

- Python 3.9+
- PostgreSQL database
- Git

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/NAVIN-STAR/ChatWithPDF.git
cd ChatWithPDF/Backend
```

2. **Create and activate a virtual environment**

```bash
python3 -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Create a `.env` file in the `Backend/` folder with:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname
EMBEDDING_API_KEY=your_embedding_api_key
```

5. **Run database migrations**  
(If you have migration scripts or manually create tables)

6. **Start the FastAPI server**

```bash
uvicorn main:app --reload
```

7. **Access the application**

- API docs: `http://localhost:8000/docs`

---

## Usage

- Upload your document through the upload endpoint or frontend UI
- The server processes the file asynchronously, chunking and embedding its content
- Once processed, chat with your document through the chat interface or API

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## License

MIT License

---

## Contact

Nabin Acharya  
Email: navinacharya2000@gmail.com  
GitHub: [NAVIN-STAR](https://github.com/NAVIN-STAR)  
LinkedIn: [linkedin.com/in/nabin-acharya-51755b202](https://linkedin.com/in/nabin-acharya-51755b202)
