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

class GoogleLoginRequest(BaseModel):
    email : str
    name : str
    image : Optional[str] = None

class GoogleLoginResponse(BaseModel):
    id : int
    message : str
    email : str
    name : str
    image : Optional[str] = None