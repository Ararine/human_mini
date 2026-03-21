import bcrypt
from model.user_handler import get_user
from model.verification_handler import (
    insert_verification_code,
    update_verification_success
)
from service.email_service import send_email, generate_code
from service.user_service import change_password_in_db
from util.database import SessionLocal

# 아이디 찾기 - 인증코드 발송
async def send_find_id_code(email: str):
    db = SessionLocal()
    try:
        user = get_user(db, email=email)  
        if not user:
            raise Exception("존재하지 않는 이메일입니다.")
        code = generate_code()
        insert_verification_code(db, email=email, code=code) # ORM
        send_email(email, code)
    finally:
        db.close()

# 아이디 찾기 - 코드 확인 후 username 반환
def verify_find_id_code(email: str, code: str):
    db = SessionLocal() 
    try:
        result = update_verification_success(db, email=email, code=code)
        if not result:
            return None
        user = get_user(db, email=email)  # ORM
        if not user:
            return []
        return [user["username"]]  # dict 방식으로 접근 / 유저 확인 후 코드 발송
    finally:
        db.close()

# 비밀번호 찾기 - 인증코드 발송
async def send_find_password_code(username: str, email: str):
    db = SessionLocal()
    try:
         # 이메일로 유저 조회 
         # email로 유저 먼저 조회 후 username 비교
        user = get_user(db, email=email)  
        if not user:
            raise Exception("존재하지 않는 이메일입니다.")
        # 조회된 유저의 username과 입력한 username 비교
        if user["username"] != username:  # dict 방식으로 접근
            raise Exception("아이디와 이메일이 일치하지 않습니다.")
        code = generate_code()
        insert_verification_code(db, email=email, code=code)  # ORM
        send_email(email, code)
    finally:
        db.close()

# 비밀번호 찾기 - 코드 확인
def verify_find_password_code(email: str, code: str) -> bool:
    db = SessionLocal()
    try:
        return update_verification_success(db, email=email, code=code) # ORM
    finally:
        db.close()

# 비밀번호 재설정 
def reset_password(username: str, new_password: str) -> bool:
    new_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    change_password_in_db(username, new_hash)  
    return True