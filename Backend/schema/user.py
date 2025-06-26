from pydantic import BaseModel
from typing import Optional, Dict, List, Any
from datetime import datetime, date

class StudentRegisterRequest(BaseModel):
    email : str
    password : str
    name : str
    major : str
    grade : int

class StudentRegisterResponse(BaseModel):
    message : str

class LoginRequest(BaseModel):
    email : str
    password : str

class LoginResponse(BaseModel):
    message : str
    id : int
    role : str
    email : str
    name : str
    department : str
    grade : int
    score : int
    level : str

class GoogleLoginRequest(BaseModel):
    email : str
    name : str
    image : Optional[str] = None

class GoogleLoginResponse(BaseModel):
    message: str
    id: int
    role: str
    email: str
    name: str
    department: str
    grade: int
    score: int
    image : Optional[str] = None
    level : str


class SendEmailRequest(BaseModel):
    email : str
    secretCode : str

class SendEmailResponse(BaseModel):
    message : str


class UpdateProfileRequest(BaseModel):
    email: str
    major : str
    grade : int

class UpdateProfileResponse(BaseModel):
    id : int
    name : str
    email : str
    role : str
    major : str
    grade : int
    testscore : int
    level : str

class UpdateScoreRequest(BaseModel):
    email : str
    testscore : int

class UpdateScoreResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    major: str
    grade: int
    testscore: int
    level : str

class UserCaseScoreRequest(BaseModel):
    user_id: int
    case: str
    category: Optional[str] = None
    total_questions: int
    correct_answers: int
    total_score: int
    accuracy: float
    level: str

class UserCaseScoreResponse(BaseModel):
    success: bool
    user_id: int
    case: str
    category: Optional[str] = None
    total_questions: int
    correct_answers: int
    total_score: int
    accuracy: float
    level: str
    last_updated: Optional[str] = None

class GetUserCaseScoresRequest(BaseModel):
    user_id: int

class GetUserCaseScoresResponse(BaseModel):
    success: bool
    scores: List[Dict[str, Any]]

class GetDailyRecordRequest(BaseModel):
    user_id : int

class GetUserLagCase(BaseModel):
    user_id : int

class SaveFeedbackRequest(BaseModel):
    date : date
    professor : str
    user_id : int
    feedback : str

class GetFeedbackRequest(BaseModel):
    user_id : int

class UserIDRequest(BaseModel):
    user_id: int

