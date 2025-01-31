from fastapi import APIRouter
import httpx
import os
from dotenv import load_dotenv
from core.embedding_utils import get_embedding

router = APIRouter(
    prefix="/api/embedding",
)

'''
아래는 예시코드입니다.
'''
@router.get("/")
async def generate_embedding(text: str):
    """
    사용자가 입력한 텍스트의 임베딩을 생성하여 반환하는 API.
    """
    embedding = await get_embedding(text)
    if embedding:
        return {"text": text, "embedding": embedding}
    return {"error": "Embedding generation failed"}