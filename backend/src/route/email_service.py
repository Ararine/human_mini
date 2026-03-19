
import os             
import random          
import string          
from datetime import datetime, timedelta  
import smtplib                           
from email.mime.text import MIMEText     
from email.mime.multipart import MIMEMultipart  


verification_codes = {}

# 인증코드 생성
def generate_code() -> str:
    return ''.join(random.choices(string.digits, k=6))  # 6자리 숫자

# 인증코드 발송
async def send_verification_code(email: str):
    code = generate_code()
    expire_at = datetime.now() + timedelta(minutes=5)  # 5분 후 만료
    
    # 메모리에 저장
    verification_codes[email] = {
        "code": code,
        "expire_at": expire_at
    }
    
    # 이메일 발송
    send_email(email, code)

# 인증코드 검증
def verify_code(email: str, code: str) -> bool:
    if email not in verification_codes:
        return False
    
    stored = verification_codes[email]
    
    # 만료 시간 확인
    if datetime.now() > stored["expire_at"]:
        del verification_codes[email]  # 만료된 코드 삭제
        return False
    
    # 코드 일치 확인
    if stored["code"] != code:
        return False
    
    del verification_codes[email]  # 인증 성공 후 삭제
    return True


# 이메일 발송
def send_email(to_email: str, code: str):
    smtp_email = os.getenv("SMTP_EMAIL")      # 발송 이메일 
    smtp_password = os.getenv("SMTP_PASSWORD") # 발신자 비밀번호

    msg = MIMEMultipart()
    msg["From"] = smtp_email   # 발신자 
    msg["To"] = to_email    # 수신자 
    msg["Subject"] = "[NEARGARDEN] 이메일 인증코드"
    
    # .env값이 제대로 로드되는지 확인을 위해 삽입(디버깅용)
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

