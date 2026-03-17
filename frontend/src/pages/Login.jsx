import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Link as MuiLink,
  Stack,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userId: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
  };

  const validate = () => {
    const newErrors = {};

    if (!form.userId.trim()) {
      newErrors.userId = "아이디를 입력해주세요.";
    } else if (form.userId.trim().length < 8) {
      newErrors.userId = "아이디는 8자 이상이어야 합니다.";
    }

    if (!form.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (form.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || isSubmitting) return;

    const payload = {
      username: form.userId.trim(),
      password: form.password,
      social_provider: "local",
    };

    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        const loginUser = {
          username: form.userId.trim(),
          social_provider: "local",
          isLogin: true,
        };

        sessionStorage.setItem("loginUser", JSON.stringify(loginUser));
        alert(data.message || "로그인 성공!");
        navigate("/");
      } else {
        alert(data.message || "아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("서버와 연결할 수 없습니다.");
    } finally {
      setIsSubmitting(false);
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
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              근린공원 서비스를 이용하려면 로그인해주세요.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <input type="hidden" name="social_provider" value="local" />

              <TextField
                fullWidth
                label="아이디"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                margin="normal"
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
                label="비밀번호"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#fff",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
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
              >
                로그인
              </Button>

              <Stack
                direction="row"
                justifyContent="center"
                spacing={2}
                sx={{ mt: 2 }}
              >
                <MuiLink
                  component={Link}
                  to="/find-id"
                  underline="hover"
                  sx={{ fontWeight: 600, fontSize: 14 }}
                >
                  아이디 찾기
                </MuiLink>

                <Typography color="text.disabled">|</Typography>

                <MuiLink
                  component={Link}
                  to="/find-password"
                  underline="hover"
                  sx={{ fontWeight: 600, fontSize: 14 }}
                >
                  비밀번호 재설정
                </MuiLink>

                <Typography color="text.disabled">|</Typography>

                <MuiLink
                  component={Link}
                  to="/signup"
                  underline="hover"
                  sx={{ fontWeight: 600, fontSize: 14 }}
                >
                  회원가입
                </MuiLink>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
