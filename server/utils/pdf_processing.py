from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from PyPDF2 import PdfReader
from fastapi import HTTPException


def extract_pdf_text(uploaded_file) -> list[Document]:
    try:
        pdf_reader = PdfReader(uploaded_file.file)
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000, chunk_overlap=200)
        documents = []
        for page_num, page in enumerate(pdf_reader.pages, 1):
            text = page.extract_text()
            if text.strip():
                chunks = text_splitter.split_text(text)
                for chunk in chunks:
                    doc = Document(
                        page_content=chunk,
                        metadata={"page": page_num,
                                  "source": uploaded_file.filename}
                    )
                    documents.append(doc)
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {e}")
