from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from lib.openai_lib import chat_completion

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptModel(BaseModel):
    prompt: str


class UpdateScriptModel(BaseModel):
    prompt: str
    script: str
    suggest: Optional[str] = None


class ScriptModel(BaseModel):
    script: str


@app.post("/api/get-script")
async def get_script(prompt_data: PromptModel):
    prompt = prompt_data.prompt
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required.")
    try:
        response = await chat_completion(prompt)
        return {"script": response}
    except Exception as e:
        print(f"Error fetching response from OpenAI: {e}")
        raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")


@app.post("/api/update-script")
async def update_script(data: UpdateScriptModel):
    try:
        message = f"{data.prompt} {data.script} {data.suggest or ''}"
        response = await chat_completion(message)
        return {"script": response}
    except Exception as e:
        print(f"Error fetching response from OpenAI: {e}")
        raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")


@app.post("/api/get-video")
async def get_video(script_data: ScriptModel):
    return script_data


@app.get("/")
async def root():
    port = os.getenv("PORT", 3001)
    return {"message": f"[server]: Server is running at http://localhost:{port}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 3001)))
