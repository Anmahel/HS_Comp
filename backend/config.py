import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        # Si está en el código Python o app.py:
        "mysql+pymysql://hc_user:21514577@localhost/hc_comp_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
