from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database.base import Base
from pgvector.sqlalchemy import Vector

class Session(Base):
    __tablename__ = "session_log"

    id = Column(String(100), primary_key = True)
    user_id = Column(Integer, ForeignKey("user_table.id"))
    subject = Column(String(100))
    category = Column(String(100))


class Reference(Base):
    __tablename__ = "reference"

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_name = Column(Text, nullable=False)
    file_size = Column(Integer, nullable=False)
    subject = Column(Text, nullable=False)
    file_content = Column(Text)
    vector_memory = Column(Vector(1536))