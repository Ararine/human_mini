# pip install python-dotenv 
# pip install itsdangerous
# pip install python-multipart 
# pip install fastapi uvicorn
# pip install sqlalchemy 
# pip install sqlalchemy psycopg2 

import os
from dotenv import load_dotenv  # 환경변수 로더
load_dotenv("../.env")   # 환경변수 로드

from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
import sys, uvicorn

from route import login, signup, mypage, find_user
from route.park import router as park_router


app=FastAPI()   # FastAPI 앱 인스턴스 생성

cors_config={
    "allow_origins":["http://localhost:3000"],
    "allow_credentials":True,
    "allow_methods":["*"],
    "allow_headers":["*"]
    }


app.add_middleware(
    CORSMiddleware,
    **cors_config       # CORS 설정 값 딕셔너리 언팩킹
)

# 세션 미들웨어 설정용 비밀키
secret_key = os.getenv("SESSION_SECRET_KEY", "default-secret-key-for-dev")
app.add_middleware(SessionMiddleware, secret_key=secret_key)


app.include_router(login.router)
app.include_router(signup.router)
app.include_router(mypage.router) 
app.include_router(find_user.router)
app.include_router(park_router, prefix="/park")

if __name__ == "__main__":
    try:
        uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port = 5000,
        reload= True) 
    except Exception as e:
        sys.exit(1)
