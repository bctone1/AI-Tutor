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

    labeling_data = relationship("LabelingData", back_populates="knowledge_base", cascade="all, delete-orphan")
    exam = relationship("Exam", back_populates="knowledge_bases")

class LabelingData(Base):
    __tablename__ = "labeling_data"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject = Column(String(50))
    question_id = Column(Integer, ForeignKey("knowledge_base.id"))
    correct_answer = Column(Integer)
    level = Column(String(50))
    case = Column(String(100))

    knowledge_base = relationship("KnowledgeBase", back_populates="labeling_data")
