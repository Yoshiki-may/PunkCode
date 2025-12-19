from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import logging
import os

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("palss-backend")

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

api_key_present = os.getenv("OPENAI_API_KEY") is not None
api_key_length = len(os.getenv("OPENAI_API_KEY") or "")

logger.info("dotenv path: %s", env_path)
logger.info("dotenv exists: %s", env_path.exists())
logger.info("cwd: %s", os.getcwd())
logger.info("OPENAI_API_KEY present: %s", api_key_present)
logger.info("OPENAI_API_KEY length: %d", api_key_length)

app = FastAPI()


class ChatRequest(BaseModel):
    message: str
    clientId: str | None = None
    sessionId: str | None = None


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health_check():
    return {"ok": True}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY is not set. cwd=%s", os.getcwd())
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")

    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    system_prompt = os.getenv(
        "PALSS_SYSTEM_PROMPT",
        "あなたはSNS運用のヒアリングを行うアシスタントです。簡潔に丁寧に回答してください。",
    )
    client = OpenAI(api_key=api_key)

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.message},
            ],
        )
    except Exception:
        logger.exception("OpenAI call failed")
        raise HTTPException(
            status_code=502,
            detail="回答の生成に失敗しました（サーバー設定を確認してください）",
        )

    reply = response.choices[0].message.content or ""
    return {"reply": reply}
