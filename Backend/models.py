from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String,DateTime
from sqlalchemy.sql import func




Base=declarative_base()



class UploadedFiles(Base):
    __tablename__="uploaded_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)  # Use Text if paths are long
    filesize = Column(Integer, nullable=False)  # Store file size in bytes
    time = Column(DateTime, server_default=func.now())
  
    