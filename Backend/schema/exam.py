from pydantic import BaseModel
from typing import List, Dict, Any
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


class UploadTestResponse(BaseModel):
    id : int
    department : str
    file_name : str
    subject : str
    case_list: List[Dict[str, Any]]
    uploader : str

class GetQuestionDataResponse(BaseModel):
    id: int
    department: str
    file_name: str
    subject: str
    case_list: List[Dict[str, Any]]
    uploader: str