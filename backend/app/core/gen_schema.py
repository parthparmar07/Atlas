import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.database import Base
from sqlalchemy import create_engine

engine = create_engine("sqlite:///atlas_db.sqlite")

with engine.connect() as conn:
    for table in Base.metadata.sorted_tables:
        print(str(table.compile(engine)))