from pydantic import BaseModel

class MessageRequest(BaseModel):
    session_id: str
    message: str

class MessageResponse(BaseModel):
    message: str