import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel
from typing import Literal
import sqlite3
from pathlib import Path
import json

DATABASE_PATH = Path(__file__).parent / "interview_history.db"


def init_database():
    connection = sqlite3.connect(DATABASE_PATH)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS interview_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL,
            interview_type TEXT NOT NULL,
            experience_level TEXT NOT NULL,
            questions TEXT NOT NULL,
            scores TEXT NOT NULL,
            average_score REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()


init_database()

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

app = FastAPI(title="AI Mock Interview API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InterviewRequest(BaseModel):
    role: str
    interview_type: Literal["Technical", "HR"]
    experience_level: Literal[
        "Fresher",
        "Intermediate",
        "Experienced",
    ]


@app.get("/")
def home():
    return {
        "message": "AI Mock Interview API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/generate-questions")
def generate_questions(request: InterviewRequest):
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="Groq API key missing. Check backend/.env",
        )

    prompt = f"""
    You are an experienced professional interviewer.

    Generate exactly 5 unique interview questions for:
    Job Role: {request.role}
    Interview Type: {request.interview_type}
    Experience Level: {request.experience_level}

    For Technical interviews, focus on technical concepts,
    problem-solving, and practical experience.

    For HR interviews, focus on communication, teamwork,
    strengths, weaknesses, and career goals.

    Return only the 5 questions, numbered from 1 to 5.
    Do not include any introduction or conclusion.
    """

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You generate relevant, professional "
                        "interview questions."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.7,
        )

        questions_text = response.choices[0].message.content or ""

        questions = [
            line.strip()
            for line in questions_text.splitlines()
            if line.strip()
        ]

        return {
            "role": request.role,
            "interview_type": request.interview_type,
            "experience_level": request.experience_level,
            "questions": questions,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI question generation failed: {str(error)}",
        )

class AnswerRequest(BaseModel):
    role: str
    question: str
    answer: str


@app.post("/evaluate-answer")
def evaluate_answer(request: AnswerRequest):
    if client is None:
        raise HTTPException(
            status_code=500,
            detail="Groq API key missing. Check backend/.env",
        )

    if not request.answer.strip():
        raise HTTPException(
            status_code=400,
            detail="Please provide an answer to evaluate.",
        )

    prompt = f"""
    You are an experienced interviewer evaluating a candidate.

    Job Role: {request.role}

    Interview Question:
    {request.question}

    Candidate's Answer:
    {request.answer}

    Evaluate the answer fairly, keeping the candidate's role in mind.

    Return feedback using these exact headings:

    Score: [a number from 0 to 10]

    Strengths:
    - Mention what the candidate did well.

    Improvements:
    - Explain what could be better.

    Sample Answer:
    - Provide a concise example of a strong answer.

    Be constructive, clear, and suitable for a beginner.
    Do not award a high score just for a long answer.
    """

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a fair, helpful, and professional "
                        "mock interview evaluator."
                    ),
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.3,
        )

        feedback = response.choices[0].message.content

        return {
            "role": request.role,
            "question": request.question,
            "feedback": feedback,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Answer evaluation failed: {str(error)}",
        )

class SaveInterviewRequest(BaseModel):
    role: str
    interview_type: str
    experience_level: str
    questions: list[str]
    scores: list[str]
    average_score: float


@app.post("/save-interview")
def save_interview(request: SaveInterviewRequest):
    try:
        connection = sqlite3.connect(DATABASE_PATH)

        connection.execute(
            """
            INSERT INTO interview_history
            (role, interview_type, experience_level,
             questions, scores, average_score)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                request.role,
                request.interview_type,
                request.experience_level,
                json.dumps(request.questions),
                json.dumps(request.scores),
                request.average_score,
            ),
        )

        connection.commit()
        connection.close()

        return {
            "message": "Interview saved successfully!"
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save interview: {str(error)}",
        )


@app.get("/interview-history")
def get_interview_history():
    try:
        connection = sqlite3.connect(DATABASE_PATH)
        connection.row_factory = sqlite3.Row

        rows = connection.execute(
            """
            SELECT * FROM interview_history
            ORDER BY created_at DESC
            """
        ).fetchall()

        history = []

        for row in rows:
            item = dict(row)
            item["questions"] = json.loads(item["questions"])
            item["scores"] = json.loads(item["scores"])
            history.append(item)

        connection.close()

        return {"history": history}

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not fetch interview history: {str(error)}",
        )