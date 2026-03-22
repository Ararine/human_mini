### 사용 가이드라인

DB와 Backend는 docker, frontend는 로컬로 띄우고 싶은 경우

```bash
# DB 및 백엔드 실행(PORT: 5432, 5000)
docker-compose up --build team_1_db team_1_backend -d
# 정상 실행 후 데이터 삽입
docker exec team_1_backend python -m src.db_init.setup

# frontend 실행(PORT: 3000)
cd frontend
npm install # 패키지 설치
npm run start
```

도커로 모두 실행하고 싶은 경우

```bash
docker-compose up --build -d
# DB 정상 실행중인지 확인 후 실행
docker exec team_1_backend python -m src.db_init.setup

```

### TODO

#### FRONTEND

1. 로그인 정보가 없는 경우 접근 차단하는 기능 추가

#### DB

1. user table 분리
   ㄴ table1(id, username, hashed_password)
   ㄴ table2(id, full_name, email, birth_date, gender, phone_number, created_at)
   ㄴ table3(id, social_id, social_provider, telecom_provider) - 더 쪼갤지는 선택

2. parks table 1정규화 고려
   ㄴ facilities 컬럼들 1정규화 할지 고려
