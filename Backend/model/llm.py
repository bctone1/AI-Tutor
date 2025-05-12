from sqlalchemy import Column, Integer, String, ForeignKey
from database.base import Base

class Session(Base):
    __tablename__ = "session_log"

    id = Column(String(100), primary_key = True)
    user_id = Column(Integer, ForeignKey("user_table.id"))
    subject = Column(String(100))
    category = Column(String(100))



