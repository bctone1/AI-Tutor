from sqlalchemy import Column, Integer, String, Text
from database.base import Base

class User(Base):
    __tablename__ = "user_table"

    id = Column(Integer, primary_key = True, autoincrement = True)
    email = Column(String(255), unique = True, nullable = False)
    password = Column(Text, nullable = False)
    name = Column(String(100), nullable = False)
    role = Column(String(50))
    department = Column(String(100))
    grade = Column(Integer, nullable = False)



