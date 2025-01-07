from pymongo import MongoClient
from pymongo.errors import PyMongoError
from pymongo.operations import SearchIndexModel
from langchain.docstore.document import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from fastapi import HTTPException
import os

MONGODB_URI = os.getenv("MONGODB_URI")
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

print('MONGODB_URI:', MONGODB_URI)
print('GOOGLE_API_KEY:', GOOGLE_API_KEY)

client = MongoClient(MONGODB_URI)
db = client["pdf_embeddings"]
collection = db["vector_store"]
conversation_collection = db["conversations"]

# search_index_model = SearchIndexModel(
#     definition={
#         "fields": [
#             {
#                 "type": "vector",
#                 "numDimensions": 1,
#                 "path": "vector",
#                 "similarity": "cosine"
#             },
#         ]
#     },
#     name="vector_search_index",
#     type="vectorSearch",
# )
# result = collection.create_search_index(model=search_index_model)


def store_embeddings(session_id: str, documents: list[Document]):
    try:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=GOOGLE_API_KEY
        )
        for doc in documents:
            vector = embeddings.embed_query(doc.page_content)
            collection.insert_one({
                "session_id": session_id,
                "content": doc.page_content,
                "vector": vector,
                "metadata": doc.metadata
            })
    except PyMongoError as e:
        raise HTTPException(
            status_code=500, detail=f"Error storing embeddings: {e}")


def query_embeddings(session_id: str, query: str, top_k: int = 4) -> list[Document]:
    try:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=GOOGLE_API_KEY
        )
        query_vector = embeddings.embed_query(query)
        # print('query_vector:', query_vector)
        # print('len(query_vector):', len(query_vector))
        results = collection.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_search_index",
                    "path": "vector",
                    "queryVector": query_vector,
                    "limit": top_k,
                    'numCandidates': 10
                }
            },
            {
                "$match": {
                    "session_id": session_id
                }
            },
        ])
        documents = [
            Document(
                page_content=result["content"],
                metadata=result["metadata"]
            )
            for result in results
        ]
        return documents
    except PyMongoError as e:
        raise HTTPException(
            status_code=500, detail=f"Error querying embeddings: {e}")


def save_conversation(session_id: str, question: str, answer: str):
    try:
        conversation_collection.insert_one({
            "session_id": session_id,
            "question": question,
            "answer": answer
        })
    except PyMongoError as e:
        raise HTTPException(
            status_code=500, detail=f"Error saving conversation: {e}")

# get all conversations for a session
def get_conversations(session_id: str):
    try:
        conversations = conversation_collection.find(
            {"session_id": session_id})
        return list(conversations)
    except PyMongoError as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching conversations: {e}")
