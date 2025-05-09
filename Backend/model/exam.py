from sqlalchemy import Column, Integer, String, ForeignKey, Text
from database.base import Base
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

class Exam(Base):
    __tablename__ = "exam_table"

    id = Column(Integer, primary_key = True, autoincrement = True)
    department = Column(String(50))
    file_name = Column(String(50))
    subject = Column(String(50))
    knowledge_bases = relationship('KnowledgeBase', back_populates='exam', cascade="all, delete-orphan")


class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"

    id = Column(Integer, primary_key=True, autoincrement=True)
    exam_id = Column(Integer, ForeignKey("exam_table.id"))
    question_number = Column(Integer)
    question = Column(Text)
    vector_memory = Column(Vector(1536))

    exam = relationship("Exam", back_populates="knowledge_bases")

