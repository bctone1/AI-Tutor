from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MessageRequest(BaseModel):
    session_id: str
    message: str

class MessageResponse(BaseModel):
    message: str

class User(BaseModel):
    id: int
    name: str
    email: str
    message: str
    role: str
    grade: int
    major: str
    testscore: int


class UserData(BaseModel):
    user: User
    expires: datetime


class ChatAgentRequest(BaseModel):
    message: str
    userdata: UserData
    selectedSubject : str


class GetQuestRequest(BaseModel):
    userdata: UserData
    selectedSubject : str
