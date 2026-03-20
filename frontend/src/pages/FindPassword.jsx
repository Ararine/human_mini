import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

const ID_REGEX = /^[A-Za-z0-9]{8,12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_REGEX = /^\d{6}$/;
const EXPIRE_TIME = 300;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

export default function FindPassword() {
  const [form, setForm] = useState({
    userId: "",
    email: "",
    code: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    userId: "",
    email: "",
    code: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [alertInfo, setAlertInfo] = useState({
    type: "",
    message: "",
  });

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  useEffect(() => {
    let timer = null;

    if (isCodeSent && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);
    }

    if (isCodeSent && remainingTime === 0) {
      setAlertInfo({
        type: "error",
        message: "요청 시간이 초과되었습니다. 임시 코드를 재발급해주세요.",
      });
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCodeSent, remainingTime]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  const clearAlert = () => {
    setAlertInfo({ type: "", message: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "userId" || name === "email") {
      setIsVerified(false);
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({
        newPassword: "",
        confirmPassword: "",
      });
    }

    clearAlert();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    clearAlert();
  };

  const validateUserInfo = () => {
    const newErrors = {
      userId: "",
      email: "",
      code: "",
    };
    let isValid = true;

    if (!form.userId.trim()) {
      newErrors.userId = "아이디를 입력해주세요.";
      isValid = false;
    } else if (!ID_REGEX.test(form.userId.trim())) {
      newErrors.userId = "아이디는 영문/숫자 8~12자로 입력해주세요.";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
      isValid = false;
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
      isValid = false;
    }

    setErrors((prev) => ({
      ...prev,
      userId: newErrors.userId,
      email: newErrors.email,
    }));

    return isValid;
  };

  const validateCodeInput = () => {
    const newErrors = {
      ...errors,
      code: "",
    };
    let isValid = true;

    if (!form.code.trim()) {
      newErrors.code = "임시 코드를 입력해주세요.";
      isValid = false;
    } else if (!CODE_REGEX.test(form.code.trim())) {
      newErrors.code = "임시 코드는 6자리 숫자여야 합니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePasswordForm = () => {
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!passwordForm.newPassword.trim()) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
      isValid = false;
    } else if (!PASSWORD_REGEX.test(passwordForm.newPassword.trim())) {
      newErrors.newPassword =
        "비밀번호는 8~16자, 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.";
      isValid = false;
    }

    if (!passwordForm.confirmPassword.trim()) {
      newErrors.confirmPassword = "새 비밀번호 확인을 입력해주세요.";
      isValid = false;
    } else if (
      passwordForm.newPassword.trim() !== passwordForm.confirmPassword.trim()
    ) {
      newErrors.confirmPassword = "새 비밀번호가 일치하지 않습니다.";
      isValid = false;
    }

    setPasswordErrors(newErrors);
    return isValid;
  };

  const handleSendCode = async () => {
    clearAlert();
    setIsVerified(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({
      newPassword: "",
      confirmPassword: "",
    });

    if (!validateUserInfo()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/send-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "임시 코드 전송에 실패했습니다.",
        );
      }

      setIsCodeSent(true);
      setRemainingTime(EXPIRE_TIME);
      setForm((prev) => ({
        ...prev,
        code: "",
      }));

      setAlertInfo({
        type: "success",
        message: data?.message || "임시 코드가 이메일로 전송되었습니다.",
      });
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: error.message || "임시 코드 전송에 실패했습니다.",
      });
    }
  };

  const handleResendCode = async () => {
    clearAlert();
    setIsVerified(false);
    setPasswordForm({
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({
      newPassword: "",
      confirmPassword: "",
    });

    if (!validateUserInfo()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/send-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "임시 코드 재발급에 실패했습니다.",
        );
      }

      setRemainingTime(EXPIRE_TIME);
      setForm((prev) => ({
        ...prev,
        code: "",
      }));

      setAlertInfo({
        type: "success",
        message: data?.message || "임시 코드가 재발급되었습니다.",
      });
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: error.message || "임시 코드 재발급에 실패했습니다.",
      });
    }
  };

  const handleVerifyCode = async () => {
    clearAlert();

    if (!validateCodeInput()) return;

    if (remainingTime <= 0) {
      setAlertInfo({
        type: "error",
        message: "요청 시간이 초과되었습니다. 임시 코드를 재발급해주세요.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/verify-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          code: form.code.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "임시 코드 인증에 실패했습니다.",
        );
      }

      // 백엔드 응답값 형태가 아직 확실하지 않을 수 있어서
      // ok만 통과하면 인증 성공으로 처리
      setIsVerified(true);

      setAlertInfo({
        type: "success",
        message:
          data?.message ||
          "이메일 인증이 완료되었습니다. 새 비밀번호를 입력해주세요.",
      });
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: error.message || "임시 코드 인증에 실패했습니다.",
      });
    }
  };

  const handleResetPassword = async () => {
    clearAlert();

    if (!isVerified) {
      setAlertInfo({
        type: "error",
        message: "먼저 이메일 인증을 완료해주세요.",
      });
      return;
    }

    if (!validatePasswordForm()) return;

    setIsSubmittingReset(true);

    try {
      // =========================================================
      // [임시 처리]
      // 현재는 비밀번호 찾기 전용 reset API 스펙이 확정되지 않았다고 보고
      // 성공 안내만 임시로 띄우는 상태
      // =========================================================
      setAlertInfo({
        type: "info",
        message:
          "현재 비밀번호 재설정 API 연결 전 단계입니다. 백엔드 스펙 확정 후 아래 주석 코드를 사용해 연결하면 됩니다.",
      });

      // =========================================================
      // [백엔드 연결 시 사용할 코드 예시 1]
      // forgot-password 전용 API가 따로 생기는 경우
      // 예: POST /forgot-password/reset
      // body: { username, email, code, new_password }
      // =========================================================
      /*
      const response = await fetch(`${API_BASE_URL}/forgot-password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.userId.trim(),
          email: form.email.trim(),
          code: form.code.trim(),
          new_password: passwordForm.newPassword.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "비밀번호 변경에 실패했습니다."
        );
      }

      setAlertInfo({
        type: "success",
        message: data?.message || "비밀번호가 성공적으로 변경되었습니다.",
      });

      setForm({
        userId: "",
        email: "",
        code: "",
      });
      setPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
      setIsCodeSent(false);
      setIsVerified(false);
      setRemainingTime(0);
      */

      // =========================================================
      // [백엔드 연결 시 사용할 코드 예시 2]
      // 기존 /reset-password 를 그대로 써야 하는 경우
      // 단, 이 경우 old_password가 필요하면 비밀번호 찾기 흐름과 안 맞을 수 있음
      // =========================================================
      /*
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.userId.trim(),
          old_password: "기존비밀번호필수면_이흐름으로는사용불가",
          new_password: passwordForm.newPassword.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "비밀번호 변경에 실패했습니다."
        );
      }

      setAlertInfo({
        type: "success",
        message: data?.message || "비밀번호가 성공적으로 변경되었습니다.",
      });
      */
    } catch (error) {
      setAlertInfo({
        type: "error",
        message: error.message || "비밀번호 변경에 실패했습니다.",
      });
    } finally {
      setIsSubmittingReset(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f9faf9",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            <Typography
              component={Link}
              to="/"
              variant="h4"
              align="center"
              sx={{
                display: "block",
                fontWeight: 800,
                letterSpacing: 0.3,
                mb: 1.5,
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                "&:hover": {
                  opacity: 0.75,
                },
              }}
            >
              🍃 NEARGARDEN
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              가입 시 등록한 아이디와 이메일로 본인 확인 후 비밀번호를
              재설정해주세요.
            </Typography>

            <Stack spacing={3}>
              <Divider />

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="아이디"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  error={!!errors.userId}
                  helperText={errors.userId}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="이메일"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      backgroundColor: "#fff",
                    },
                  }}
                />

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSendCode}
                  sx={{
                    py: 1.4,
                    borderRadius: 2,
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  임시 코드 전송
                </Button>
              </Stack>

              {isCodeSent && (
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "flex-start",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="임시 코드 입력"
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      error={!!errors.code}
                      helperText={errors.code}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#fff",
                        },
                      }}
                    />

                    <Button
                      variant="outlined"
                      onClick={handleResendCode}
                      sx={{
                        minWidth: 96,
                        height: 56,
                        borderRadius: 2,
                        whiteSpace: "nowrap",
                        fontWeight: 700,
                      }}
                    >
                      재발급
                    </Button>

                    <Box
                      sx={{
                        minWidth: 78,
                        height: 56,
                        px: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#fafafa",
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {formatTime(remainingTime)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleVerifyCode}
                    sx={{
                      py: 1.4,
                      borderRadius: 2,
                      fontWeight: 700,
                      boxShadow: "none",
                      "&:hover": {
                        boxShadow: "none",
                      },
                    }}
                  >
                    인증 확인
                  </Button>
                </Stack>
              )}

              {alertInfo.message && (
                <Alert severity={alertInfo.type || "info"}>
                  {alertInfo.message}
                </Alert>
              )}

              {isVerified && (
                <Box
                  sx={{
                    mt: 1,
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#f8f9fb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    새 비밀번호 설정
                  </Typography>

                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="새 비밀번호"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#fff",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      type="password"
                      label="새 비밀번호 확인"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#fff",
                        },
                      }}
                    />
                  </Stack>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      py: 1.4,
                      borderRadius: 2,
                      fontWeight: 700,
                      boxShadow: "none",
                      "&:hover": {
                        boxShadow: "none",
                      },
                    }}
                    onClick={handleResetPassword}
                    disabled={isSubmittingReset}
                  >
                    {isSubmittingReset ? "처리 중..." : "비밀번호 변경하기"}
                  </Button>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
