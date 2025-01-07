from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from utils.pdf_processing import extract_pdf_text
from utils.mongo_operations import store_embeddings
import uuid

upload_router = APIRouter()


@upload_router.post("/")
async def upload_pdfs(files: list[UploadFile] = File(...)):
    try:
        session_id = str(uuid.uuid4())
        all_documents = []
        for file in files:
            docs = extract_pdf_text(file)
            all_documents.extend(docs)

        store_embeddings(session_id, all_documents)

        return JSONResponse(content={"message": "PDFs processed and indexed successfully!", "session_id": session_id}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
