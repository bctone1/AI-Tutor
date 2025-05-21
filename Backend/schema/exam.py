from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class User(BaseModel):
    name: str
    email: str
    id: int

class UserData(BaseModel):
    user: User
    expires: datetime

class SubmitTestRequest(BaseModel):
    answers: Dict[str, int]
    userdata: UserData


class GetExplantationRequest(BaseModel):
    answer : int
    question_id : int

class GetExplantationResponse(BaseModel):
    isCorrect: bool
    explanation: str


