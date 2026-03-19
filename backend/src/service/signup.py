
import bcrypt

from model.user_handler import create_user, get_user
from util.database import SessionLocal


# 회원 등록  
async def register_user(
    username: str,
    password: str,
    full_name: str,
    email: str,
    gender: str,
    telecom_provider: str,    
    social_provider: str,
    social_id=None,
    birth_date=None,
    phone_number=None,
):
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    hashed_str = hashed.decode('utf-8')
    
    db = SessionLocal()
    try:
        result =  create_user(
            db = db,
            username = username,
            hashed_password = hashed_str,
            full_name = full_name,
            email = email,
            birth_date = birth_date,
            gender = gender,
            social_provider = social_provider,             
            social_id = social_id,
            phone_number = phone_number,
            telecom_provider = telecom_provider,
        )
        if not result:                        
            raise Exception("회원가입 실패") 
    finally:
        db.close()

        
 
# 아이디 중복 체크 
def check_duplicate_username(username: str) -> bool:
    db = SessionLocal()
    try:
        user = get_user(db, username = username)
        return user is not None  # 중복이 있을 시 True
    except Exception as e:
        print(e)
    finally:
        db.close()       
        
 