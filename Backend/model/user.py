from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float, Date
from database.base import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "user_table"

    id = Column(Integer, primary_key = True, autoincrement = True)
    email = Column(String(255), unique = True, nullable = False)
    password = Column(Text, nullable = False)
    name = Column(String(100), nullable = False)
    role = Column(String(50))
    department = Column(String(100))
    grade = Column(Integer, nullable = False)
    score = Column(Integer)
    level = Column(String(25))

    case_scores = relationship("UserCaseScore", back_populates="user", cascade="all, delete-orphan")
    user_record = relationship("UserTotalRecord", back_populates="user", cascade="all, delete-orphan")
    user_daily = relationship("UserDaily", back_populates="user", cascade="all, delete-orphan")
    current_score = relationship("UserCurrentScore", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("FeedBack", back_populates="user", cascade="all, delete-orphan")

class UserCaseScore(Base):
    __tablename__ = "user_case_scores"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_table.id"), nullable=False)
    case = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True)  # 유형 카테고리 (근육계, 신경계 등)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    level = Column(String(50), default="하")
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="case_scores")

class UserTotalRecord(Base):
    __tablename__ = "user_total_record"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_table.id"), nullable=False)
    total_question = Column(Integer, default=0)
    total_correct = Column(Integer, default=0)
    correct_rate = Column(Float, default=0.0)
    attendance = Column(Integer, default = 0)
    total_score= Column(Integer, default = 1000)

    user = relationship("User", back_populates="user_record")

class UserDaily(Base):
    __tablename__ = "user_daily"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_table.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("knowledge_base.id"))
    date = Column(Date, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="user_daily")


class UserCurrentScore(Base):
    __tablename__ = "user_current_score"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user_table.id"), nullable=False)
    case = Column(String(100), nullable=False)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    level = Column(String(50), default="하")
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="current_score")

class FeedBack(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, autoincrement=True)
    professor = Column(String(50))
    student_id = Column(Integer, ForeignKey("user_table.id"))
    content = Column(Text)
    date = Column(Date, default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="feedback")