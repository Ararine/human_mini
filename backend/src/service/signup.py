
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
    birth_date=None,
    phone_number=None,
    telecom_provider=None,
          
):
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    hashed_str = hashed.decode('utf-8')
    
    db = SessionLocal()
    try:
        create_user(
            db=db,
            username=username,
            hashed_password=hashed_str,
            full_name=full_name,
            email=email,
            birth_date=birth_date,
            gender=gender,
            social_provider="local",
            social_id="2",
            phone_number=phone_number,
            telecom_provider=telecom_provider
        )   
    except Exception as e:
        print(e)
    finally :
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
        
 