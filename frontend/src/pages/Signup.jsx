import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
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
import { Link, useNavigate } from "react-router-dom";

const EXISTING_IDS = ["admin", "testuser", "hello123"];
const EXISTING_EMAILS = ["test@gmail.com", "admin@naver.com", "user@daum.net"];

const ID_REGEX = /^[A-Za-z0-9]{8,12}$/;
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;
const NAME_REGEX = /^[가-힣a-zA-Z]+$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const INITIAL_FORM = {
  userid: "",
  password: "",
  password2: "",
  name: "",
  phone1: "",
  phone2: "",
  phone3: "",
  telecomProvider: "",
  gender: "",
  emailId: "",
  emailDomain: "",
  year: "",
  month: "",
  day: "",
};

function Signup() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const years = useMemo(
    () => Array.from({ length: 101 }, (_, i) => currentYear - i),
    [currentYear],
  );
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [idChecked, setIdChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [idMsg, setIdMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [domainReadOnly, setDomainReadOnly] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = `${form.emailId.trim()}@${form.emailDomain.trim()}`;

  const updateForm = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFieldError = (name) => {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const resetIdCheck = () => {
    setIdChecked(false);
    setIdMsg("");
  };

  const resetEmailCheck = () => {
    setEmailChecked(false);
    setEmailMsg("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    updateForm(name, value);
    clearFieldError(name);

    if (name === "userid") resetIdCheck();
    if (name === "emailId" || name === "emailDomain") resetEmailCheck();
    if (name === "year" || name === "month" || name === "day") {
      clearFieldError("birth");
    }
    if (name === "gender") {
      clearFieldError("gender");
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const onlyNumber = value.replace(/[^0-9]/g, "");
    updateForm(name, onlyNumber);
    clearFieldError("phone1");
  };

  const handleDomainSelect = (e) => {
    const selectedDomain = e.target.value;

    if (selectedDomain) {
      updateForm("emailDomain", selectedDomain);
      setDomainReadOnly(true);
    } else {
      updateForm("emailDomain", "");
      setDomainReadOnly(false);
    }

    resetEmailCheck();
    clearFieldError("emailId");
    clearFieldError("emailDomain");
  };

  const checkDuplicateId = async () => {
    const userid = form.userid.trim();

    if (!userid) {
      setErrors((prev) => ({
        ...prev,
        userid: "아이디를 입력하세요.",
      }));
      setIdChecked(false);
      setIdMsg("");
      return;
    }

    if (!ID_REGEX.test(userid)) {
      setErrors((prev) => ({
        ...prev,
        userid: "아이디는 영문/숫자 포함 8~12자여야 합니다.",
      }));
      setIdChecked(false);
      setIdMsg("");
      return;
    }

    if (EXISTING_IDS.includes(userid)) {
      setIdMsg("이미 사용 중인 아이디입니다.");
      setIdChecked(false);
      return;
    }

    setIdMsg("사용 가능한 아이디입니다.");
    setIdChecked(true);
  };

  const checkDuplicateEmail = async () => {
    if (!form.emailId.trim()) {
      setErrors((prev) => ({
        ...prev,
        emailId: "이메일 아이디를 입력하세요.",
      }));
      setEmailChecked(false);
      setEmailMsg("");
      return;
    }

    if (!form.emailDomain.trim()) {
      setErrors((prev) => ({
        ...prev,
        emailDomain: "도메인을 입력하세요.",
      }));
      setEmailChecked(false);
      setEmailMsg("");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrors((prev) => ({
        ...prev,
        emailId: "올바른 이메일 형식이 아닙니다.",
      }));
      setEmailChecked(false);
      setEmailMsg("");
      return;
    }

    if (EXISTING_EMAILS.includes(email)) {
      setEmailMsg("이미 가입된 이메일입니다.");
      setEmailChecked(false);
      return;
    }

    setEmailMsg("사용 가능한 이메일입니다.");
    setEmailChecked(true);
  };

  const validateForm = () => {
    const newErrors = {};

    const id = form.userid.trim();
    const pw = form.password;
    const pw2 = form.password2;
    const username = form.name.trim();

    const phone1 = form.phone1.trim();
    const phone2 = form.phone2.trim();
    const phone3 = form.phone3.trim();

    if (!id) {
      newErrors.userid = "아이디를 입력하세요.";
    } else if (!ID_REGEX.test(id)) {
      newErrors.userid = "아이디는 영문/숫자 포함 8~12자여야 합니다.";
    } else if (!idChecked) {
      newErrors.userid = "아이디 중복확인을 해주세요.";
    }

    if (!pw) {
      newErrors.password = "비밀번호를 입력하세요.";
    } else if (!PW_REGEX.test(pw)) {
      newErrors.password =
        "대문자, 소문자, 숫자, 특수문자를 포함한 8~20자여야 합니다.";
    }

    if (!pw2) {
      newErrors.password2 = "비밀번호 확인을 입력하세요.";
    } else if (pw !== pw2) {
      newErrors.password2 = "비밀번호가 일치하지 않습니다.";
    }

    if (!username) {
      newErrors.name = "이름을 입력하세요.";
    } else if (!NAME_REGEX.test(username)) {
      newErrors.name = "이름은 한글 또는 영문만 입력 가능합니다.";
    }

    if (!phone1 || !phone2 || !phone3) {
      newErrors.phone1 = "휴대폰 번호를 입력하세요.";
    } else if (
      phone1.length !== 3 ||
      phone2.length !== 4 ||
      phone3.length !== 4
    ) {
      newErrors.phone1 = "휴대폰 번호를 정확히 입력하세요.";
    }

    if (!form.telecomProvider) {
      newErrors.telecomProvider = "통신사를 선택하세요.";
    }

    if (!form.gender) {
      newErrors.gender = "성별을 선택하세요.";
    }

    if (!form.year || !form.month || !form.day) {
      newErrors.birth = "생년월일을 선택하세요.";
    }

    if (!form.emailId.trim()) {
      newErrors.emailId = "이메일 아이디를 입력하세요.";
    }

    if (!form.emailDomain.trim()) {
      newErrors.emailDomain = "도메인을 입력하세요.";
    }

    if (form.emailId.trim() && form.emailDomain.trim()) {
      if (!EMAIL_REGEX.test(email)) {
        newErrors.emailId = "올바른 이메일 형식이 아닙니다.";
      } else if (!emailChecked) {
        newErrors.emailId = "이메일 중복 확인을 해주세요.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    const payload = {
      username: form.userid.trim(),
      password: form.password,
      full_name: form.name.trim(),
      email: `${form.emailId.trim()}@${form.emailDomain.trim()}`,
      gender: form.gender === "male" ? "남" : "녀",
      birth_date: `${form.year}-${String(form.month).padStart(2, "0")}-${String(
        form.day,
      ).padStart(2, "0")}`,
      phone_number: `${form.phone1}-${form.phone2}-${form.phone3}`,
      telecom_provider: form.telecomProvider,
      social_provider: "local",
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "회원가입이 완료되었습니다.");
        setForm(INITIAL_FORM);
        setErrors({});
        setIdChecked(false);
        setEmailChecked(false);
        setIdMsg("");
        setEmailMsg("");
        setDomainReadOnly(false);
        navigate("/login");
      } else {
        alert(data.message || data.error || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("서버와 연결할 수 없습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1120,
          borderRadius: 5,
          border: "1px solid",
          borderColor: "#e6ebe6",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(180deg, #edf7ee 0%, #f8fbf8 100%)",
              borderRight: { xs: "none", md: "1px solid #e6ebe6" },
              borderBottom: { xs: "1px solid #e6ebe6", md: "none" },
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              component={Link}
              to="/"
              variant="h4"
              sx={{
                textDecoration: "none",
                color: "#1f2a1f",
                fontWeight: 800,
                letterSpacing: 0.3,
                mb: 2,
                "&:hover": {
                  opacity: 0.75,
                },
              }}
            >
              🍃 NEARGARDEN
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                lineHeight: 1.4,
                color: "#1f2a1f",
                mb: 1.5,
              }}
            >
              공원과 더 가까워지는
              <br />
              간단한 시작
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                lineHeight: 1.8,
              }}
            >
              회원가입 후 주변 공원 탐색,
              <br />
              위치 기반 검색,
              <br />
              다양한 공원 정보 확인이 가능해져요.
            </Typography>
          </Box>

          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              회원가입
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              아래 정보를 입력하고 계정을 만들어보세요.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <input type="hidden" name="social_provider" value="local" />

              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 120px" },
                    gap: 1.2,
                    alignItems: "start",
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
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
                    onClick={checkDuplicateId}
                    sx={{
                      height: 40,
                      borderRadius: 2,
                      boxShadow: "none",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      "&:hover": { boxShadow: "none" },
                    }}
                  >
                    중복확인
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 1.5,
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
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

                  <TextField
                    fullWidth
                    size="small"
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
                </Box>

                <TextField
                  fullWidth
                  size="small"
                  label="이름"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name || " "}
                />

                <Divider />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.9fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        color: errors.birth ? "error.main" : "text.primary",
                      }}
                    >
                      생년월일
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
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
                        fullWidth
                        size="small"
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
                        fullWidth
                        size="small"
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
                      sx={{ display: "block", mt: 0.5, minHeight: 18 }}
                    >
                      {errors.birth || " "}
                    </Typography>
                  </Box>

                  <FormControl error={!!errors.gender}>
                    <FormLabel sx={{ fontWeight: 700, mb: 0.6 }}>
                      성별
                    </FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio size="small" />}
                        label="남자"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio size="small" />}
                        label="여자"
                      />
                    </RadioGroup>
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ minHeight: 18 }}
                    >
                      {errors.gender || " "}
                    </Typography>
                  </FormControl>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    휴대폰 번호
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="010"
                      name="phone1"
                      value={form.phone1}
                      onChange={handleNumberChange}
                      inputProps={{ maxLength: 3 }}
                      error={!!errors.phone1}
                    />
                    <Typography>-</Typography>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="1234"
                      name="phone2"
                      value={form.phone2}
                      onChange={handleNumberChange}
                      inputProps={{ maxLength: 4 }}
                      error={!!errors.phone1}
                    />
                    <Typography>-</Typography>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="5678"
                      name="phone3"
                      value={form.phone3}
                      onChange={handleNumberChange}
                      inputProps={{ maxLength: 4 }}
                      error={!!errors.phone1}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 0.5, minHeight: 18 }}
                  >
                    {errors.phone1 || " "}
                  </Typography>
                </Box>

                <TextField
                  select
                  fullWidth
                  size="small"
                  label="통신사"
                  name="telecomProvider"
                  value={form.telecomProvider}
                  onChange={handleChange}
                  error={!!errors.telecomProvider}
                  helperText={errors.telecomProvider || " "}
                >
                  <MenuItem value="">선택</MenuItem>
                  <MenuItem value="SKT">SKT</MenuItem>
                  <MenuItem value="KT">KT</MenuItem>
                  <MenuItem value="LGU+">LGU+</MenuItem>
                  <MenuItem value="알뜰폰">알뜰폰</MenuItem>
                </TextField>

                <Divider />

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    이메일
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                      gap: 1.2,
                    }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      label="이메일 아이디"
                      name="emailId"
                      value={form.emailId}
                      onChange={handleChange}
                      placeholder="example"
                      error={!!errors.emailId || (!!emailMsg && !emailChecked)}
                      helperText={errors.emailId || " "}
                    />

                    <TextField
                      fullWidth
                      size="small"
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
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "180px 140px" },
                      gap: 1.2,
                      mt: 0.5,
                    }}
                  >
                    <TextField
                      select
                      size="small"
                      label="도메인 선택"
                      defaultValue=""
                      onChange={handleDomainSelect}
                    >
                      <MenuItem value="">직접입력</MenuItem>
                      <MenuItem value="gmail.com">gmail.com</MenuItem>
                      <MenuItem value="naver.com">naver.com</MenuItem>
                      <MenuItem value="daum.net">daum.net</MenuItem>
                    </TextField>

                    <Button
                      type="button"
                      variant="outlined"
                      onClick={checkDuplicateEmail}
                      sx={{
                        height: 40,
                        borderRadius: 2,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      이메일 확인
                    </Button>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      minHeight: 20,
                      color: emailChecked ? "success.main" : "error.main",
                    }}
                  >
                    {emailMsg || " "}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 1,
                    py: 1.3,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  회원가입
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}

export default Signup;
