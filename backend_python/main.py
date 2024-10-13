from venv import logger

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from lib.jockey import get_sample_pics
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
    script: str
    suggest: Optional[str] = None


class ScriptModel(BaseModel):
    script: str


@app.post("/api/get-script")
async def get_script(prompt_data: PromptModel):
    prompt = prompt_data.prompt
    logger.info(f"Prompt: {prompt}")
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required.")
    try:
        prompt = f"""
        You are a professional sports narrator and video editor. You should 
        finish a task that help satisfy the requirement in the user 
        prompt: {prompt}.
        
        Task: Write a script that follows the time constraint in the prompt. 
        Carefully examine the requirement in the user prompt and expand to 
        three questions. List the three questions. The script should aim to 
        answer the questions. Focus on maintaining a clear narrative flow 
        that will resonate with audiences unfamiliar with sports. Do not include timestamps.
        Only show the script, and be concise.
        
        Show the script directly.
        """

        response = await chat_completion(prompt)
        return {"script": response}
    except Exception as e:
        print(f"Error fetching response from OpenAI: {e}")
        raise HTTPException(status_code=500, detail="Failed to get response from OpenAI")


@app.post("/api/get-samples")
async def get_samples(prompt_data: PromptModel):
    prompt = prompt_data.prompt
    logger.info(f"Prompt: {prompt}")
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required.")
    try:
        response = await get_sample_pics(prompt)
        print(response)
        return {"samples": response}
    except Exception as e:
        print(f"Error fetching response from OpenAI: {e}")
        raise HTTPException(status_code=500, detail="Failed to get sample pictures")


@app.post("/api/update-script")
async def update_script(data: UpdateScriptModel):
    try:
        message = f"""
        Based on the user's advice: {data.suggest}, refine the previous version of the script: {data.script}. Be sure to address the requirement about style, content, and focus. Be sure to keep the original core content, and only change what is asked by the user. Do not modify the main narrative structure, and do not add irrelevant content. Be sure to keep the content fluent and consistent.
        """
        response = await chat_completion(message)
        logger.info(f"Response: {response}")
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
