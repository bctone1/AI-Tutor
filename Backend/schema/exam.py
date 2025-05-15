from pydantic import BaseModel
from typing import Dict
from typing import Optional
from datetime import datetime

'''
class GetTestQuestionRequest(BaseModel):
    subject : str
'''


class User(BaseModel):
    name: str
    email: str
    id: int
    # message: str
    #role: str

class UserData(BaseModel):
    user: User
    expires: datetime

class SubmitTestRequest(BaseModel):
    answers: Dict[str, int]
    userdata: UserData


'''
class SubmitTestResponse(BaseModel):
    id : int
    name : str
    email : str
    role : str
    major : str
    grade : int
    testscore : int'''