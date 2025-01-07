from fastapi import APIRouter
from fastapi.responses import JSONResponse
from utils.mongo_operations import query_embeddings, save_conversation, get_conversations
from utils.qa_chain import get_conversational_chain
from pydantic import BaseModel


query_router = APIRouter()


class QueryRequest(BaseModel):
    session_id: str
    question: str


# @query_router.post("/")
# async def query_documents(request: QueryRequest):
#     try:
#         session_id = request.session_id
#         question = request.question
#         # Rest of the logic
#         return {"message": "Success"}
#     except Exception as e:
#         return {"error": str(e)}


@query_router.post("/")
async def query_documents(request: QueryRequest):
    try:
        session_id = request.session_id
        question = request.question
        docs = query_embeddings(session_id, question, top_k=4)

        if not docs:
            answer = "No relevant documents found for the query."
            save_conversation(session_id, question, answer)
            return JSONResponse(content={"answer": answer}, status_code=200)

        chain = get_conversational_chain()
        response = chain(
            {"input_documents": docs, "question": question}, return_only_outputs=True)

        save_conversation(session_id, question, response['output_text'])

        # documents to JSON serializable format
        docs = [
            # {"content": doc.page_content, "metadata": doc.metadata} for doc in docs
            {"page": doc.metadata["page"], "source": doc.metadata["source"]} for doc in docs
        ]

        return JSONResponse(content={"answer": response['output_text'], "citations": docs}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@query_router.get("/conversation")
async def get_conversation(session_id: str):
    try:
        # all conversations for a session
        results = get_conversations(session_id)
        conversation = [
            {"question": result["question"], "answer": result["answer"]}
            for result in results
        ]
        return JSONResponse(content={"conversation": conversation}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
