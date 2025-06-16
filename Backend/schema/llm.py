from pydantic import BaseModel
from datetime import datetime
from typing import List

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
    solvedProblemIds: List[int]

class ReferenceSchema(BaseModel):
    id : int
    file_name : str
    file_size : int
    subject : str
    file_content : str
