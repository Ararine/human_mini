import os             
import random         
import string         
import smtplib                           
from email.mime.text import MIMEText     
from email.mime.multipart import MIMEMultipart  


from util.database import SessionLocal    
from model.verification_handler import (
    insert_verification_code,
    update_verification_success
)

def generate_code() -> str: 
    return ''.join(random.choices(string.digits, k=6))  # 6자리 숫자


# 인증코드 발송
async def send_verification_code(email: str):
    code = generate_code()
    db = SessionLocal()
    try:
        # DB에 인증코드 저장
        insert_verification_code(db, email=email, code=code)
    finally:
        db.close()
    # 이메일 발송
    send_email(email, code)


# 인증코드 검증
def verify_code(email: str, code: str) -> bool:
    db = SessionLocal()
    try:
        # DB에서 코드 일치 여부 확인 후 is_verified = 1로 업데이트
        return update_verification_success(db, email=email, code=code)
    finally:
        db.close()


# 이메일 발송
def send_email(to_email: str, code: str):
    smtp_email = os.getenv("SMTP_EMAIL")      # 발송 이메일  
    smtp_password = os.getenv("SMTP_PASSWORD") # (구글 등) 발신자 비밀번호

    msg = MIMEMultipart()    
    msg["From"] = smtp_email 
    msg["To"] = to_email   
    msg["Subject"] = "[NEARGARDEN] 이메일 인증코드"

    
    # .env값이 제대로 로드되는지 확인을 위해 삽입(디버깅용) / 터미널 창에서 확인 가능
    print(f"SMTP_EMAIL: {smtp_email}")      # ← 추가
    print(f"발송 대상: {to_email}")          # ← 추가
    print(f"인증코드: {code}")               # ← 추가

    body = f"""
    안녕하세요, NEARGARDEN입니다.
    
    인증코드: {code}
    
    5분 이내에 입력해주세요.
    """
    msg.attach(MIMEText(body, "plain"))    
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:    
        server.login(smtp_email, smtp_password)                 
        server.sendmail(smtp_email, to_email, msg.as_string())  
                                                               
