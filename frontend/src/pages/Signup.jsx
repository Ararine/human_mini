import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// =========================
// 1. 테스트용 기존 데이터
// =========================
// 실제 프로젝트에서는 서버(DB)에서 확인해야 하지만
// 현재는 프론트 화면 테스트용으로 배열을 사용
const EXISTING_IDS = ["admin", "testuser", "hello123"];
const EXISTING_EMAILS = ["test@gmail.com", "admin@naver.com", "user@daum.net"];

// =========================
// 2. 입력값 유효성 검사용 정규식
// =========================
// 아이디: 영문/숫자 포함 8~12자
const ID_REGEX = /^[A-Za-z0-9]{8,12}$/;

// 비밀번호: 대문자, 소문자, 숫자, 특수문자 포함 8~20자
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;

// 이름: 한글/영문만 허용
const NAME_REGEX = /^[가-힣a-zA-Z]+$/;

// 이메일 형식 검사
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// =========================
// 3. 초기 폼 상태값
// =========================
const INITIAL_FORM = {
  userid: "",
  password: "",
  password2: "",
  name: "",
  phone1: "",
  phone2: "",
  phone3: "",
  gender: "",
  emailId: "",
  emailDomain: "",
  year: "",
  month: "",
  day: "",
};

function Signup() {
  // =========================
  // 4. 생년월일 select 옵션 생성
  // =========================
  const currentYear = new Date().getFullYear();

  // 년도: 현재년도부터 100년 전까지
  const years = useMemo(
    () => Array.from({ length: 101 }, (_, i) => currentYear - i),
    [currentYear],
  );

  // 월: 1~12
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  // 일: 1~31
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  // =========================
  // 5. 상태 관리
  // =========================

  // 사용자가 입력하는 폼 데이터
  const [form, setForm] = useState(INITIAL_FORM);

  // 각 필드별 에러 메시지 저장
  // 예: { userid: "아이디를 입력하세요." }
  const [errors, setErrors] = useState({});

  // 아이디 중복확인 완료 여부
  const [idChecked, setIdChecked] = useState(false);

  // 이메일 중복확인 완료 여부
  const [emailChecked, setEmailChecked] = useState(false);

  // 아이디 안내 메시지
  // 예: "사용 가능한 아이디입니다."
  const [idMsg, setIdMsg] = useState("");

  // 이메일 안내 메시지
  const [emailMsg, setEmailMsg] = useState("");

  // 이메일 도메인 직접입력 가능 여부
  // 도메인 선택하면 readOnly=true, 직접입력이면 false
  const [domainReadOnly, setDomainReadOnly] = useState(false);

  // 비밀번호 표시 여부
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 확인 표시 여부
  const [showPassword2, setShowPassword2] = useState(false);

  // =========================
  // 6. 파생 데이터
  // =========================
  // 이메일 아이디 + 도메인을 합쳐 하나의 이메일 문자열 생성
  const email = `${form.emailId.trim()}@${form.emailDomain.trim()}`;

  // =========================
  // 7. 공통 유틸 함수
  // =========================

  // 특정 필드의 값을 업데이트하는 함수
  const updateForm = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 특정 필드의 에러 메시지만 제거
  const clearFieldError = (name) => {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 아이디가 바뀌면 중복확인 상태 초기화
  const resetIdCheck = () => {
    setIdChecked(false);
    setIdMsg("");
  };

  // 이메일이 바뀌면 중복확인 상태 초기화
  const resetEmailCheck = () => {
    setEmailChecked(false);
    setEmailMsg("");
  };

  // =========================
  // 8. 일반 입력 처리
  // =========================
  // text, password, select, radio 공통 처리
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 입력값 저장
    updateForm(name, value);

    // 해당 필드 에러 제거
    clearFieldError(name);

    // 아이디가 수정되면 다시 중복확인해야 하므로 초기화
    if (name === "userid") {
      resetIdCheck();
    }

    // 이메일 관련 필드가 수정되면 다시 중복확인해야 하므로 초기화
    if (name === "emailId" || name === "emailDomain") {
      resetEmailCheck();
    }

    // 생년월일 셋 중 하나가 바뀌면 birth 에러 제거
    if (name === "year" || name === "month" || name === "day") {
      clearFieldError("birth");
    }

    // 성별이 바뀌면 gender 에러 제거
    if (name === "gender") {
      clearFieldError("gender");
    }
  };

  // =========================
  // 9. 숫자만 입력 처리
  // =========================
  // 휴대폰 번호 입력용
  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    // 숫자가 아닌 문자는 제거
    const onlyNumber = value.replace(/[^0-9]/g, "");

    updateForm(name, onlyNumber);

    // 휴대폰 번호 에러 제거
    clearFieldError("phone1");
  };

  // =========================
  // 10. 이메일 도메인 선택 처리
  // =========================
  const handleDomainSelect = (e) => {
    const selectedDomain = e.target.value;

    // 도메인을 선택했으면 자동 입력 + 수정 불가
    if (selectedDomain) {
      updateForm("emailDomain", selectedDomain);
      setDomainReadOnly(true);
    } else {
      // 직접입력 선택 시 입력칸 비우고 수정 가능
      updateForm("emailDomain", "");
      setDomainReadOnly(false);
    }

    // 이메일 관련 값이 바뀌었으므로 중복확인 초기화
    resetEmailCheck();

    // 이메일 관련 에러 제거
    clearFieldError("emailId");
    clearFieldError("emailDomain");
  };

  // =========================
  // 11. 아이디 중복확인
  // =========================
  const checkDuplicateId = () => {
    const userid = form.userid.trim();

    // 아이디 미입력
    if (!userid) {
      setErrors((prev) => ({
        ...prev,
        userid: "아이디를 입력하세요.",
      }));
      setIdChecked(false);
      setIdMsg("");
      return;
    }

    // 아이디 형식 오류
    if (!ID_REGEX.test(userid)) {
      setErrors((prev) => ({
        ...prev,
        userid: "아이디는 영문/숫자 포함 8~12자여야 합니다.",
      }));
      setIdChecked(false);
      setIdMsg("");
      return;
    }

    // 이미 존재하는 아이디
    if (EXISTING_IDS.includes(userid)) {
      setIdMsg("이미 사용 중인 아이디입니다.");
      setIdChecked(false);
      return;
    }

    // 사용 가능한 아이디
    setIdMsg("사용 가능한 아이디입니다.");
    setIdChecked(true);
  };

  // =========================
  // 12. 이메일 중복확인
  // =========================
  const checkDuplicateEmail = () => {
    // 이메일 아이디 미입력
    if (!form.emailId.trim()) {
      setErrors((prev) => ({
        ...prev,
        emailId: "이메일 아이디를 입력하세요.",
      }));
      setEmailChecked(false);
      setEmailMsg("");
      return;
    }

    // 이메일 도메인 미입력
    if (!form.emailDomain.trim()) {
      setErrors((prev) => ({
        ...prev,
        emailDomain: "도메인을 입력하세요.",
      }));
      setEmailChecked(false);
      setEmailMsg("");
      return;
    }

    // 이메일 형식 오류
    if (!EMAIL_REGEX.test(email)) {
      setErrors((prev) => ({
        ...prev,
        emailId: "올바른 이메일 형식이 아닙니다.",
      }));
      setEmailChecked(false);
      setEmailMsg("");
      return;
    }

    // 이미 존재하는 이메일
    if (EXISTING_EMAILS.includes(email)) {
      setEmailMsg("이미 가입된 이메일입니다.");
      setEmailChecked(false);
      return;
    }

    // 사용 가능한 이메일
    setEmailMsg("사용 가능한 이메일입니다.");
    setEmailChecked(true);
  };

  // =========================
  // 13. 전체 폼 유효성 검사
  // =========================
  const validateForm = () => {
    const newErrors = {};

    const id = form.userid.trim();
    const pw = form.password;
    const pw2 = form.password2;
    const username = form.name.trim();

    const phone1 = form.phone1.trim();
    const phone2 = form.phone2.trim();
    const phone3 = form.phone3.trim();

    // 아이디 검사
    if (!id) {
      newErrors.userid = "아이디를 입력하세요.";
    } else if (!ID_REGEX.test(id)) {
      newErrors.userid = "아이디는 영문/숫자 포함 8~12자여야 합니다.";
    } else if (!idChecked) {
      newErrors.userid = "아이디 중복확인을 해주세요.";
    }

    // 비밀번호 검사
    if (!pw) {
      newErrors.password = "비밀번호를 입력하세요.";
    } else if (!PW_REGEX.test(pw)) {
      newErrors.password =
        "대문자, 소문자, 숫자, 특수문자를 포함한 8~20자여야 합니다.";
    }

    // 비밀번호 확인 검사
    if (!pw2) {
      newErrors.password2 = "비밀번호 확인을 입력하세요.";
    } else if (pw !== pw2) {
      newErrors.password2 = "비밀번호가 일치하지 않습니다.";
    }

    // 이름 검사
    if (!username) {
      newErrors.name = "이름을 입력하세요.";
    } else if (!NAME_REGEX.test(username)) {
      newErrors.name = "이름은 한글 또는 영문만 입력 가능합니다.";
    }

    // 휴대폰 번호 검사
    if (!phone1 || !phone2 || !phone3) {
      newErrors.phone1 = "휴대폰 번호를 입력하세요.";
    } else if (
      phone1.length !== 3 ||
      phone2.length !== 4 ||
      phone3.length !== 4
    ) {
      newErrors.phone1 = "휴대폰 번호를 정확히 입력하세요.";
    }

    // 성별 검사
    if (!form.gender) {
      newErrors.gender = "성별을 선택하세요.";
    }

    // 생년월일 검사
    if (!form.year || !form.month || !form.day) {
      newErrors.birth = "생년월일을 선택하세요.";
    }

    // 이메일 아이디 / 도메인 검사
    if (!form.emailId.trim()) {
      newErrors.emailId = "이메일 아이디를 입력하세요.";
    }

    if (!form.emailDomain.trim()) {
      newErrors.emailDomain = "도메인을 입력하세요.";
    }

    // 이메일 형식 및 중복확인 검사
    if (form.emailId.trim() && form.emailDomain.trim()) {
      if (!EMAIL_REGEX.test(email)) {
        newErrors.emailId = "올바른 이메일 형식이 아닙니다.";
      } else if (!emailChecked) {
        newErrors.emailId = "이메일 중복 확인을 해주세요.";
      }
    }

    // 에러 상태 반영
    setErrors(newErrors);

    // 에러가 없으면 true
    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // 14. 회원가입 제출
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // 전체 유효성 검사 통과 못하면 제출 중단
    const isValid = validateForm();
    if (!isValid) return;

    // 여기서 실제로는 회원가입 API 요청을 보내면 됨
    console.log("회원가입 데이터:", form);
  };

  // =========================
  // 15. 화면(UI)
  // =========================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 680,
          bgcolor: "background.paper",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* 상단 서비스 문구 */}
          <Typography
            variant="body2"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mb: 1,
            }}
          >
            🍃 NEARGARDEN
          </Typography>

          {/* 페이지 제목 */}
          <Typography variant="h4" gutterBottom>
            회원가입
          </Typography>

          {/* 설명 문구 */}
          <Typography variant="body2" color="text.secondary" mb={3}>
            우리 주변의 공원을 찾는 서비스
          </Typography>

          {/* 회원가입 폼 */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.2}>
              {/* =========================
                  아이디 입력 + 중복확인
              ========================= */}
              <Box sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}>
                <TextField
                  label="아이디"
                  name="userid"
                  value={form.userid}
                  onChange={handleChange}
                  placeholder="영문/숫자 8~12자"
                  error={!!errors.userid || (!!idMsg && !idChecked)}
                  helperText={errors.userid || idMsg || " "}
                />
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={checkDuplicateId}
                  sx={{
                    minWidth: 110,
                    height: 56,
                  }}
                >
                  중복확인
                </Button>
              </Box>

              {/* =========================
                  비밀번호 입력
                  - 눈 아이콘 클릭 시 표시/숨김
              ========================= */}
              <TextField
                label="비밀번호"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || " "}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* =========================
                  비밀번호 확인 입력
              ========================= */}
              <TextField
                label="비밀번호 확인"
                name="password2"
                type={showPassword2 ? "text" : "password"}
                value={form.password2}
                onChange={handleChange}
                error={!!errors.password2}
                helperText={errors.password2 || " "}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword2((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* 이름 입력 */}
              <TextField
                label="이름"
                name="name"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name || " "}
              />

              {/* =========================
                  생년월일 선택
                  - year, month, day 모두 선택해야 함
              ========================= */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    color: errors.birth ? "error.main" : "text.primary",
                    fontWeight: 600,
                  }}
                >
                  생년월일
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <TextField
                    select
                    label="년도"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    error={!!errors.birth}
                  >
                    <MenuItem value="">선택</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="월"
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    error={!!errors.birth}
                  >
                    <MenuItem value="">선택</MenuItem>
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="일"
                    name="day"
                    value={form.day}
                    onChange={handleChange}
                    error={!!errors.birth}
                  >
                    <MenuItem value="">선택</MenuItem>
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 0.8, minHeight: 20 }}
                >
                  {errors.birth || " "}
                </Typography>
              </Box>

              {/* =========================
                  휴대폰 번호 입력
                  - 숫자만 허용
                  - 3 / 4 / 4 자리 검사
              ========================= */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  휴대폰 번호
                </Typography>

                {/* 휴대폰 번호 입력칸 사이에 하이픈(-) 표시 */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    placeholder="010"
                    name="phone1"
                    value={form.phone1}
                    onChange={handleNumberChange}
                    inputProps={{ maxLength: 3 }}
                    error={!!errors.phone1}
                    sx={{ flex: 1 }}
                  />

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontWeight: 700,
                      mt: errors.phone1 ? "-22px" : "0",
                    }}
                  >
                    -
                  </Typography>

                  <TextField
                    placeholder="1234"
                    name="phone2"
                    value={form.phone2}
                    onChange={handleNumberChange}
                    inputProps={{ maxLength: 4 }}
                    error={!!errors.phone1}
                    sx={{ flex: 1 }}
                  />

                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontWeight: 700,
                      mt: errors.phone1 ? "-22px" : "0",
                    }}
                  >
                    -
                  </Typography>

                  <TextField
                    placeholder="5678"
                    name="phone3"
                    value={form.phone3}
                    onChange={handleNumberChange}
                    inputProps={{ maxLength: 4 }}
                    error={!!errors.phone1}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mt: 0.8, minHeight: 20 }}
                >
                  {errors.phone1 || " "}
                </Typography>
              </Box>

              {/* =========================
                  성별 선택
              ========================= */}
              <FormControl error={!!errors.gender}>
                <FormLabel sx={{ fontWeight: 600 }}>성별</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio color="primary" />}
                    label="남자"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio color="primary" />}
                    label="여자"
                  />
                </RadioGroup>

                <Typography variant="caption" color="error">
                  {errors.gender || " "}
                </Typography>
              </FormControl>

              {/* =========================
                  이메일 입력 + 도메인 선택 + 중복확인
              ========================= */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  이메일
                </Typography>

                <Box
                  sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}
                >
                  <TextField
                    label="이메일 아이디"
                    name="emailId"
                    value={form.emailId}
                    onChange={handleChange}
                    placeholder="example"
                    error={!!errors.emailId || (!!emailMsg && !emailChecked)}
                    helperText={errors.emailId || " "}
                  />

                  <TextField
                    label="도메인"
                    name="emailDomain"
                    value={form.emailDomain}
                    onChange={handleChange}
                    placeholder="domain.com"
                    error={!!errors.emailDomain}
                    helperText={errors.emailDomain || " "}
                    InputProps={{ readOnly: domainReadOnly }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.2,
                    mt: 0.5,
                    alignItems: "flex-start",
                  }}
                >
                  <TextField
                    select
                    label="도메인 선택"
                    defaultValue=""
                    onChange={handleDomainSelect}
                    sx={{ minWidth: 180 }}
                    color="secondary"
                  >
                    <MenuItem value="">직접입력</MenuItem>
                    <MenuItem value="gmail.com">gmail.com</MenuItem>
                    <MenuItem value="naver.com">naver.com</MenuItem>
                    <MenuItem value="daum.net">daum.net</MenuItem>
                  </TextField>

                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={checkDuplicateEmail}
                    sx={{
                      minWidth: 140,
                      height: 56,
                    }}
                  >
                    이메일 중복확인
                  </Button>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    minHeight: 24,
                    color: emailChecked ? "success.main" : "error.main",
                  }}
                >
                  {emailMsg || " "}
                </Typography>
              </Box>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                회원가입
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Signup;
