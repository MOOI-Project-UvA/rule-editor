"""
python -m venv .venv
uvicorn service.app:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from eflint_generator import generate_eflint

app = FastAPI(title="eFLINT Generator API")

class GenerateRequest(BaseModel):
    interpretation: dict

@app.post("/generate-eflint")
def generate_eflint_endpoint(req: GenerateRequest):
    eflint = generate_eflint(req.interpretation)
    return {"eflint": eflint}


@app.get("/health")
def health():
    return {"status": "ok"}