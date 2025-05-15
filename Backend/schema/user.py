from pydantic import BaseModel
from typing import Optional

class StudentRegisterRequest(BaseModel):
    email : str
    password : str
    name : str
    department : str
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