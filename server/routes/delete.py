
from fastapi import APIRouter, HTTPException

from utils.mongo_operations import collection, conversation_collection

appdelete = APIRouter()


@appdelete.delete("/delete_docs/{session_id}")
async def delete_documents(session_id: str):
    try:
        
        result = conversation_collection.delete_many({})

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail=f"No documents found for session ID: {session_id}"
            )

        return {"detail": f"Successfully deleted {result.deleted_count} document(s) for session ID: {session_id}"}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting documents: {e}"
        )
