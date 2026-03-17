# human_mini(test)

# ✍ 변수 작명법

1. `카멜 표기법(Camel Case)`<br>
   - 형식 : 첫 단어는 소문자, 이후 단어의 첫 글자는 대문자
   - 예 ) userName, handleSubmit, babMatItDa
   - 긴 변수명을 사용할 때 사용

2. `파스칼 표기법(Pascal Case)`<br>
   - 형식 : 모든 단어의 첫 글자가 대문자
   - 예 ) Calculator, UserProfile
   - 클래스명, React 컴포넌트, 타입, 인터페이스 에 주로 사용

3. `스네이크 표기법(Snake Case)`<br>
   - 형식 : 단어 사이에 '\_'로 연결
   - 예 ) user_name, total_price, p_num
   - Python, DB 컬럼명

4. `UPPER_SNAKE_CASE`<br>
   - 전부 대문자를 사용하며 문자와 문자 사이 '\_'로 연결
   - 예 ) BASE_URL, MAX_SIZE, API_KEY
   - 상수(constant), 환경변수에 사용

5. `케밥 표기법(Kebab Case)`<br>
   - 전부 소문자를 사용하며 문자와 문자 사이 '-'로 연결
   - 예 ) login-btn, post-container
   - css 클래스, 파일명에 주로 사용

6. `헝가리안 표기법(Hungarian Case)`<br>
   - 타입을 이름 앞에 붙이며 소문자로 시작하여 이후 첫글자만 대문자
   - 예 ) strName, intCount, arrList
   - JS / Python 에서 사용하나 최근엔 안 쓰는 추세

---

## 프로젝트 Convention

### React

      * 변수 : camelCase
         - userName, postList, isLoading,hasError

      * 상수 : UPPER_SNAKE_CASE
         - API_BASE_URL, MAX_RETRY_COUNT, DEFAULT_PAGE_SIZE

      * 함수 : camelCase
         - handleClick(), fetchUser(), createPost()

      * 클래스 : PascalCase
         - Calculator

      * 컴포넌트 파일 : PascalCase
         - UserCard.jsx, PostList.tsx,Header.tsx

      * utils / services : camelCase
         - apiClient.js, dateFormatter.js, authService.js

      * hooks 파일 : use + camelCase
         - useAuth.js, useFetchData.js

      * css 파일 : kebab-case
         - reset.css, global-style.css, main-layout.css
         - .user-card {}, .post-item {}, .main-header {}

      * 환경변수 파일 or 상수 파일명 : camelCase
         - data.js

### Python(fastapi)

      * 변수 : snake_case
         - user_name, post_list, is_loading, has_error

      * 상수 : UPPER_SNAKE_CASE
         - API_BASE_URL, MAX_RETRY_COUNT, DEFAULT_PAGE_SIZE, SECRET_KEY

      * 함수 : snake_case
         - get_user(), create_post(), fetch_users(), handle_webhook()
         - 라우터 핸들러도 보통 snake_case: read_posts(), update_user()

      * 클래스 : PascalCase
         - UserService, PostRepository, Settings, HTTPException

      * services / repositories : snake_case
         - user_service.py, auth_service.py, post_repository.py

### DB

      - 스키마/테이블/컬럼/PK/FK/인덱스 등 : snake_case
