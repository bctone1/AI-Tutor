from sqlalchemy import Column, Integer, String, Text, ForeignKey
from database.base import Base
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship

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

    chunks = relationship(
        "ReferenceChunk",
        back_populates="reference",
        cascade="all, delete",
        passive_deletes=True
    )

class ReferenceChunk(Base):
    __tablename__ = "reference_chunk"

    id = Column(Integer, primary_key = True, autoincrement=True)
    reference_id = Column(Integer, ForeignKey("reference.id"), nullable=False)
    content = Column(Text)
    vector_memory = Column(Vector(1536))

    reference = relationship("Reference", back_populates="chunks")
