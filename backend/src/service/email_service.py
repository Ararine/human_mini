'''
# service 폴더의 signup.py 파일과 email_service.py 파일을 분리하면 좋은 이유

# 역할 담당이 분명
# signup.py      → 회원가입만 담당
# email_service.py → 이메일 관련만 담당
```

그리고 이메일 발송 기능은 회원가입 외에도:
```
회원가입 이메일 인증
비밀번호 찾기 이메일 발송
공지사항 이메일 발송
등 다양한 곳에서 재사용될 수 있기 때문에 별도 파일로 분리하는 것이 더 좋음
'''

# 문자열 관련 상수(예: 알파벳 대소문자, 숫자 등)를 제공하여 랜덤 문자열 생성 시 참고하거나 문자열 조작

import os              # 환경변수
import random          # 랜덤 관련
import string          # 문자열 관련 (random과 함께 사용)
from datetime import datetime, timedelta  # 시간 관련
import smtplib                            # 이메일 발송 관련
from email.mime.text import MIMEText      # 이메일 형식 관련
from email.mime.multipart import MIMEMultipart  # 이메일 형식 관련

# from email.mime.multipart import MIMEMultipart 
# 편지봉투 역할
# 이메일 전체 구조를 담는 그릇
# 발신자, 수신자, 제목 등 이메일 외부 정보

# from email.mime.text import MIMEText
# 편지지 역할
# 실제 이메일 본문 내용
# "안녕하세요, 인증코드는 123456입니다."

# 인증코드 임시 저장소 (메모리)
# {email: {"code": "123456", "expire_at": datetime}}
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

'''
SMTP_EMAIL  →  인증코드를 보내는 주체 (발신자)
                우리 서비스 이메일 주소
                예: neargarden@gmail.com

프론트엔드에서 받는 이메일  →  인증코드를 받을 사람 (수신자)
                              사용자가 입력한 이메일 주소
                              예: user123@example.com
                              
.env의 SMTP_EMAIL  →  "누가 보내느냐" (발신자, 우리 서비스)
프론트에서 받는 email →  "누구에게 보내느냐" (수신자, 사용자)                             
'''

# 이메일 발송
def send_email(to_email: str, code: str):
    smtp_email = os.getenv("SMTP_EMAIL")      # 발송 이메일  / # 발신자 ← .env에서 가져옴
    smtp_password = os.getenv("SMTP_PASSWORD") # (구글 등) 앱 비밀번호 / # 발신자 비밀번호

    msg = MIMEMultipart()
    msg["From"] = smtp_email   # 발신자 (우리 서비스)
    msg["To"] = to_email    # 수신자 (사용자가 입력한 이메일)
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


'''
기능이 다를 때 관련 기능끼리 묶는 방식이 더 일반적임
임포트 순서를 묶음으로 보면:
```
os                      →  환경변수
random, string          →  인증코드 생성 관련
datetime, timedelta     →  만료시간 관련
smtplib, MIMEText, MIMEMultipart  →  이메일 발송 관련
'''



'''
import random
난수 생성 및 무작위 선택을 위해 사용합니다. 예를 들어 임의의 인증 코드 생성 등에 활용합니다.
# 인증코드 생성 시 랜덤 숫자를 뽑기 위해
# random.choices(string.digits, k=6) → 0~9 중 6개 랜덤 선택

import string
문자열 관련 상수(예: 알파벳 대소문자, 숫자 등)를 제공하여 랜덤 문자열 생성 시 참고하거나 문자열 조작에 쓰입니다.
# 숫자 문자열 집합을 제공
# string.digits = "0123456789"
# random.choices와 함께 사용해서 6자리 숫자 코드 생성

from datetime import datetime, timedelta
현재 날짜와 시간 계산, 특정 시간 간격을 더하거나 빼는 데 사용합니다. 예: 인증 코드 유효 기간 설정.
# datetime → 현재 시간 확인용
# datetime.now() → 현재 시간

# timedelta → 시간 더하고 빼기
# timedelta(minutes=5) → 5분
# expire_at = datetime.now() + timedelta(minutes=5) → 5분 후 만료시간 계산

import smtplib
SMTP 프로토콜을 사용해 이메일 전송 기능을 구현할 때 필요합니다.
# 이메일 발송 프로토콜(SMTP) 사용
# Gmail 서버에 연결해서 이메일 보내기
# smtplib.SMTP_SSL("smtp.gmail.com", 465)

from email.mime.text import MIMEText
이메일 본문에 텍스트 메시지를 담을 때 쓰입니다.
# 이메일 본문(텍스트) 생성
# MIMEText(body, "plain") → 평문 텍스트 본문

from email.mime.multipart import MIMEMultipart
여러 파트(텍스트, 이미지 등)를 포함하는 복합 이메일을 작성할 때 사용합니다.
# 이메일 전체 구조 생성
# 제목, 발신자, 수신자, 본문을 하나로 묶는 역할
# msg = MIMEMultipart()
# msg["Subject"] = "제목"
# msg.attach(MIMEText(body))

import os
운영체제와 상호작용, 환경변수 접근 및 파일 경로 처리 등에 필요합니다.
# 환경변수 읽기
# os.getenv("SMTP_EMAIL")    → .env의 이메일 주소
# os.getenv("SMTP_PASSWORD") → .env의 앱 비밀번호

요약하면, string은 주로 랜덤 문자열 생성 시 알파벳, 숫자 등의 문자열 집합을 간편하게 사용하기 위해 임포트합니다. 
나머지 모듈들은 이메일 인증 및 날짜 계산 등에 필요한 다양한 기능을 담당
'''