
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Added for CORS
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from llama_runner import query_llama
from search_engine import search_searxng
from prompt_builder import build_prompt

app = FastAPI()

# ✅ Add CORS configuration
origins = [
    "http://localhost:3000",  # React or other frontend
    "http://127.0.0.1:3000",
    "http://localhost:8501",  # Streamlit frontend (if used)
    "http://127.0.0.1:8501"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers including Content-Type
)


class Query(BaseModel):
    question: str
    conversation_id: Optional[str] = None
    conversation_history: Optional[List[List[Any]]] = None


@app.post("/ask")
async def ask(query: Query) -> Dict[str, Any]:
    try:
        search_results = search_searxng(query.question)
        
        # Use the conversation history if provided
        prompt = build_prompt(
            query.question, 
            search_results, 
            query.conversation_history
        )
        
        response = query_llama(prompt)
        return {
            "answer": response, 
            "sources": search_results,
            "conversation_id": query.conversation_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {e}")
