import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { useNavigate } from "react-router-dom";

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export default function MyPage() {
  const navigate = useNavigate();

  const userInfo = useMemo(
    () => ({
      loginId: "minyoung123",
      name: "김민영",
      birth: "2000.10.10",
      gender: "남성",
      email: "minyoung123@naver.com",
      phone: "010-1234-5678",
      telecomProvider: "SKT",
    }),
    [],
  );

  const recentSearches = useMemo(
    () => [
      {
        id: 1,
        name: "서울숲",
        address: "서울 성동구 뚝섬로 273",
        lat: 37.5444,
        lng: 127.0374,
      },
      {
        id: 2,
        name: "올림픽공원",
        address: "서울 송파구 올림픽로 424",
        lat: 37.5207,
        lng: 127.121,
      },
      {
        id: 3,
        name: "보라매공원",
        address: "서울 동작구 여의대방로20길 33",
        lat: 37.4927,
        lng: 126.9195,
      },
      {
        id: 4,
        name: "여의도공원",
        address: "서울 영등포구 여의공원로 68",
        lat: 37.5263,
        lng: 126.924,
      },
      {
        id: 5,
        name: "북서울꿈의숲",
        address: "서울 강북구 월계로 173",
        lat: 37.6204,
        lng: 127.0417,
      },
      {
        id: 6,
        name: "서울대공원",
        address: "경기 과천시 대공원광장로 102",
        lat: 37.4351,
        lng: 127.0195,
      },
      {
        id: 7,
        name: "어린이대공원",
        address: "서울 광진구 능동로 216",
        lat: 37.5486,
        lng: 127.081,
      },
      {
        id: 8,
        name: "남산공원",
        address: "서울 중구 삼일대로 231",
        lat: 37.5501,
        lng: 126.9895,
      },
      {
        id: 9,
        name: "월드컵공원",
        address: "서울 마포구 하늘공원로 86",
        lat: 37.5684,
        lng: 126.8789,
      },
      {
        id: 10,
        name: "선유도공원",
        address: "서울 영등포구 선유로 343",
        lat: 37.5421,
        lng: 126.9004,
      },
    ],
    [],
  );

  const [isEditMode, setIsEditMode] = useState(false);

  const [editForm, setEditForm] = useState({
    email: userInfo.email,
    currentPassword: "",
    password: "",
    passwordConfirm: "",
    phone1: userInfo.phone.split("-")[0] || "010",
    phone2: userInfo.phone.split("-")[1] || "",
    phone3: userInfo.phone.split("-")[2] || "",
    telecomProvider: userInfo.telecomProvider || "",
  });

  const [errors, setErrors] = useState({
    email: "",
    currentPassword: "",
    password: "",
    passwordConfirm: "",
    phone1: "",
    telecomProvider: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChangeEditForm = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const onlyNumber = value.replace(/[^0-9]/g, "");

    setEditForm((prev) => ({
      ...prev,
      [name]: onlyNumber,
    }));

    setErrors((prev) => ({
      ...prev,
      phone1: "",
    }));
  };

  const handleEditProfile = () => setIsEditMode(true);

  const handleCancelEdit = () => {
    setEditForm({
      email: userInfo.email,
      currentPassword: "",
      password: "",
      passwordConfirm: "",
      phone1: userInfo.phone.split("-")[0] || "010",
      phone2: userInfo.phone.split("-")[1] || "",
      phone3: userInfo.phone.split("-")[2] || "",
      telecomProvider: userInfo.telecomProvider || "",
    });

    setErrors({
      email: "",
      currentPassword: "",
      password: "",
      passwordConfirm: "",
      phone1: "",
      telecomProvider: "",
    });

    setShowCurrentPassword(false);
    setShowPassword(false);
    setShowPasswordConfirm(false);
    setIsEditMode(false);
  };

  const validateEditForm = () => {
    const newErrors = {
      email: "",
      currentPassword: "",
      password: "",
      passwordConfirm: "",
      phone1: "",
      telecomProvider: "",
    };

    let isValid = true;

    if (!editForm.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
      isValid = false;
    }

    if (
      editForm.currentPassword ||
      editForm.password ||
      editForm.passwordConfirm
    ) {
      if (!editForm.currentPassword) {
        newErrors.currentPassword = "기존 비밀번호를 입력해주세요.";
        isValid = false;
      }

      if (!editForm.password) {
        newErrors.password = "새 비밀번호를 입력해주세요.";
        isValid = false;
      } else if (!PASSWORD_REGEX.test(editForm.password)) {
        newErrors.password =
          "비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 포함해야 합니다.";
        isValid = false;
      } else if (editForm.currentPassword === editForm.password) {
        newErrors.password = "기존 비밀번호와 다른 새 비밀번호를 입력해주세요.";
        isValid = false;
      }

      if (!editForm.passwordConfirm) {
        newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
        isValid = false;
      } else if (editForm.password !== editForm.passwordConfirm) {
        newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        isValid = false;
      }
    }

    if (
      !editForm.phone1.trim() ||
      !editForm.phone2.trim() ||
      !editForm.phone3.trim()
    ) {
      newErrors.phone1 = "휴대폰 번호를 입력해주세요.";
      isValid = false;
    } else if (
      editForm.phone1.length !== 3 ||
      editForm.phone2.length !== 4 ||
      editForm.phone3.length !== 4
    ) {
      newErrors.phone1 = "휴대폰 번호를 정확히 입력해주세요.";
      isValid = false;
    }

    if (!editForm.telecomProvider) {
      newErrors.telecomProvider = "통신사를 선택해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSaveProfile = () => {
    if (!validateEditForm()) return;

    const payload = {
      email: editForm.email,
      phone: `${editForm.phone1}-${editForm.phone2}-${editForm.phone3}`,
      telecomProvider: editForm.telecomProvider,
    };

    if (editForm.password) {
      payload.currentPassword = editForm.currentPassword;
      payload.newPassword = editForm.password;
    }

    console.log("저장 payload:", payload);
    alert("프로필 수정 저장 기능 연결 예정");
    setIsEditMode(false);
  };

  const handleRecentClick = (place) => {
    navigate("/", {
      state: {
        selectedPlace: place,
      },
    });
  };

  const handleLogout = () => {
    alert("로그아웃 기능 연결 예정");
  };

  const handleWithdraw = () => {
    alert("회원탈퇴 기능 연결 예정");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F6FAF6",
      }}
    >
      <Box
        sx={{
          maxWidth: "1360px",
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 2.5 },
          height: "100vh",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Stack
          spacing={2}
          sx={{
            height: "100%",
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexShrink: 0,
              pb: 1.2,
              borderBottom: "1px solid #E6EEE6",
            }}
          >
            <Typography
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                fontWeight: 800,
                letterSpacing: 0.3,
                color: "#1f2a1f",
                cursor: "pointer",
                fontSize: { xs: 18, md: 20 },
                lineHeight: 1.2,
                flexShrink: 0,
              }}
            >
              🍃 NEARGARDEN
            </Typography>

            <Box sx={{ textAlign: "right" }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#1E2A1F",
                  fontSize: { xs: 20, md: 22 },
                  lineHeight: 1.2,
                }}
              >
                마이페이지
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  mt: 0.2,
                }}
              >
                내 계정 정보와 최근 검색한 공원을 확인할 수 있어요
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.4fr 0.95fr" },
              gap: 2,
              alignItems: "stretch",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                minHeight: 0,
                height: "100%",
              }}
            >
              <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
                <CustomCard>
                  <Stack spacing={1.4}>
                    <SectionTitle title="로그인 정보" />

                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 3,
                        backgroundColor: "#FCFEFC",
                        border: "1px solid #E3ECE3",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Stack direction="row" spacing={1.3} alignItems="center">
                        <IconCircle>
                          <PersonRoundedIcon
                            sx={{ fontSize: 18, color: "primary.main" }}
                          />
                        </IconCircle>

                        <Box>
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              mb: 0.2,
                            }}
                          >
                            로그인 아이디
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "text.primary",
                              fontSize: 15,
                            }}
                          >
                            {userInfo.loginId}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label="활성 계정"
                        size="small"
                        sx={{
                          backgroundColor: "#EAF6EA",
                          color: "#3F6B46",
                          fontWeight: 700,
                          height: 28,
                          borderRadius: 999,
                        }}
                      />
                    </Box>
                  </Stack>
                </CustomCard>

                <CustomCard
                  sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                  contentSx={{
                    p: { xs: 2, md: 2.2 },
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <Stack
                    spacing={1.4}
                    sx={{
                      flex: 1,
                      minHeight: 0,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                        flexShrink: 0,
                      }}
                    >
                      <SectionTitle title="프로필 정보" />

                      {!isEditMode ? (
                        <Button
                          variant="contained"
                          startIcon={<EditRoundedIcon />}
                          onClick={handleEditProfile}
                          size="small"
                          sx={{
                            borderRadius: 2.5,
                            px: 1.8,
                            height: 36,
                            boxShadow: "none",
                          }}
                        >
                          프로필 수정
                        </Button>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="outlined"
                            startIcon={<CloseRoundedIcon />}
                            onClick={handleCancelEdit}
                            size="small"
                            sx={{
                              borderRadius: 2.5,
                              px: 1.6,
                              height: 36,
                            }}
                          >
                            취소
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<SaveRoundedIcon />}
                            onClick={handleSaveProfile}
                            size="small"
                            sx={{
                              borderRadius: 2.5,
                              px: 1.6,
                              height: 36,
                              boxShadow: "none",
                            }}
                          >
                            저장
                          </Button>
                        </Stack>
                      )}
                    </Box>

                    <Box
                      sx={{
                        borderRadius: 3,
                        overflow: "auto",
                        border: "1px solid #E5ECE5",
                        backgroundColor: "#FFF",
                        flex: 1,
                        minHeight: 0,
                      }}
                    >
                      {!isEditMode ? (
                        <>
                          <InfoRow label="생년월일" value={userInfo.birth} />
                          <Divider />
                          <InfoRow label="성별" value={userInfo.gender} />
                          <Divider />
                          <InfoRow label="이름" value={userInfo.name} />
                          <Divider />
                          <InfoRow label="이메일" value={userInfo.email} />
                          <Divider />
                          <InfoRow label="비밀번호" value="********" />
                          <Divider />
                          <InfoRow
                            label="통신사"
                            value={userInfo.telecomProvider}
                          />
                          <Divider />
                          <InfoRow label="휴대폰 번호" value={userInfo.phone} />
                        </>
                      ) : (
                        <Box sx={{ px: 2, py: 2 }}>
                          <Stack spacing={1.2}>
                            <TextField
                              label="이메일"
                              name="email"
                              value={editForm.email}
                              onChange={handleChangeEditForm}
                              error={!!errors.email}
                              helperText={errors.email}
                              fullWidth
                              size="small"
                            />

                            <TextField
                              label="기존 비밀번호"
                              name="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              value={editForm.currentPassword}
                              onChange={handleChangeEditForm}
                              placeholder="기존 비밀번호 입력"
                              error={!!errors.currentPassword}
                              helperText={
                                errors.currentPassword ||
                                "비밀번호를 변경하려면 기존 비밀번호를 입력해주세요."
                              }
                              fullWidth
                              size="small"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowCurrentPassword((prev) => !prev)
                                      }
                                      edge="end"
                                    >
                                      {showCurrentPassword ? (
                                        <VisibilityOffRoundedIcon />
                                      ) : (
                                        <VisibilityRoundedIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              label="새 비밀번호"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={editForm.password}
                              onChange={handleChangeEditForm}
                              placeholder="새 비밀번호 입력"
                              error={!!errors.password}
                              helperText={
                                errors.password ||
                                "8자 이상, 영문 / 숫자 / 특수문자를 포함해주세요."
                              }
                              fullWidth
                              size="small"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowPassword((prev) => !prev)
                                      }
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <VisibilityOffRoundedIcon />
                                      ) : (
                                        <VisibilityRoundedIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <TextField
                              label="새 비밀번호 확인"
                              name="passwordConfirm"
                              type={showPasswordConfirm ? "text" : "password"}
                              value={editForm.passwordConfirm}
                              onChange={handleChangeEditForm}
                              placeholder="비밀번호 다시 입력"
                              error={!!errors.passwordConfirm}
                              helperText={
                                errors.passwordConfirm ||
                                "위에 입력한 새 비밀번호를 한 번 더 입력해주세요."
                              }
                              fullWidth
                              size="small"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() =>
                                        setShowPasswordConfirm((prev) => !prev)
                                      }
                                      edge="end"
                                    >
                                      {showPasswordConfirm ? (
                                        <VisibilityOffRoundedIcon />
                                      ) : (
                                        <VisibilityRoundedIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />

                            <Box>
                              <Typography
                                sx={{
                                  mb: 0.75,
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#243224",
                                }}
                              >
                                휴대폰 번호
                              </Typography>

                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1.2fr 0.8fr",
                                  },
                                  gap: 1.2,
                                  alignItems: "start",
                                }}
                              >
                                <Box>
                                  <Box
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns:
                                        "1fr 12px 1fr 12px 1fr",
                                      alignItems: "center",
                                      gap: 0.4,
                                    }}
                                  >
                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="phone1"
                                      value={editForm.phone1}
                                      onChange={handlePhoneChange}
                                      placeholder="010"
                                      inputProps={{ maxLength: 3 }}
                                      error={!!errors.phone1}
                                    />
                                    <Typography textAlign="center">
                                      -
                                    </Typography>

                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="phone2"
                                      value={editForm.phone2}
                                      onChange={handlePhoneChange}
                                      placeholder="1234"
                                      inputProps={{ maxLength: 4 }}
                                      error={!!errors.phone1}
                                    />
                                    <Typography textAlign="center">
                                      -
                                    </Typography>

                                    <TextField
                                      size="small"
                                      fullWidth
                                      name="phone3"
                                      value={editForm.phone3}
                                      onChange={handlePhoneChange}
                                      placeholder="5678"
                                      inputProps={{ maxLength: 4 }}
                                      error={!!errors.phone1}
                                    />
                                  </Box>

                                  <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{
                                      display: "block",
                                      mt: 0.5,
                                      minHeight: 18,
                                    }}
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
                                  value={editForm.telecomProvider}
                                  onChange={handleChangeEditForm}
                                  error={!!errors.telecomProvider}
                                  helperText={errors.telecomProvider}
                                >
                                  <MenuItem value="">선택</MenuItem>
                                  <MenuItem value="SKT">SKT</MenuItem>
                                  <MenuItem value="KT">KT</MenuItem>
                                  <MenuItem value="LGU+">LGU+</MenuItem>
                                  <MenuItem value="알뜰폰">알뜰폰</MenuItem>
                                </TextField>
                              </Box>
                            </Box>
                          </Stack>
                        </Box>
                      )}
                    </Box>
                  </Stack>
                </CustomCard>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ flexShrink: 0 }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={handleWithdraw}
                  sx={{
                    flex: 1,
                    minHeight: 44,
                    borderRadius: 3,
                    fontWeight: 700,
                  }}
                >
                  회원탈퇴
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LogoutRoundedIcon />}
                  onClick={handleLogout}
                  sx={{
                    flex: 1,
                    minHeight: 44,
                    borderRadius: 3,
                    fontWeight: 700,
                    boxShadow: "none",
                  }}
                >
                  로그아웃
                </Button>
              </Stack>
            </Stack>

            <CustomCard
              sx={{
                minHeight: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              contentSx={{
                p: { xs: 2, md: 2.2 },
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
              }}
            >
              <Stack spacing={1.4} sx={{ flex: 1, minHeight: 0 }}>
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                  sx={{ flexShrink: 0 }}
                >
                  <IconCircle>
                    <AccessTimeRoundedIcon
                      sx={{ color: "primary.main", fontSize: 18 }}
                    />
                  </IconCircle>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        lineHeight: 1.2,
                      }}
                    >
                      최근 검색 목록
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                        mt: 0.2,
                      }}
                    >
                      최근 검색 8개
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    px: 1.4,
                    py: 1,
                    borderRadius: 2.5,
                    backgroundColor: "#F8FCF8",
                    border: "1px solid #E3EFE3",
                    flexShrink: 0,
                  }}
                >
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <SearchRoundedIcon
                      sx={{ fontSize: 16, color: "primary.main" }}
                    />
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      클릭 시 메인 지도로 이동
                    </Typography>
                  </Stack>
                </Box>

                <List
                  disablePadding
                  sx={{
                    mt: 0.5,
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto",
                  }}
                >
                  {recentSearches.slice(0, 8).map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItemButton
                        onClick={() => handleRecentClick(item)}
                        sx={{
                          px: 1.2,
                          py: 1.1,
                          borderRadius: 2.5,
                          alignItems: "center",
                          minHeight: "auto",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: "rgba(167, 215, 169, 0.14)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            backgroundColor: "#EDF6EE",
                            color: "#4A6B4E",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 11,
                            mr: 1.2,
                            flexShrink: 0,
                          }}
                        >
                          {index + 1}
                        </Box>

                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: "text.primary",
                                lineHeight: 1.2,
                              }}
                            >
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{
                                fontSize: 11.5,
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                mt: 0.35,
                              }}
                            >
                              {item.address}
                            </Typography>
                          }
                        />

                        <ChevronRightRoundedIcon
                          sx={{
                            color: "#A3AEA4",
                            fontSize: 18,
                            ml: 0.5,
                          }}
                        />
                      </ListItemButton>

                      {index !== recentSearches.slice(0, 8).length - 1 && (
                        <Divider sx={{ my: 0.25 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Stack>
            </CustomCard>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

function CustomCard({ children, sx = {}, contentSx = {} }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border: "1px solid #E7EEE7",
        boxShadow: "0 6px 20px rgba(31, 42, 31, 0.04)",
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.2 },
          ...contentSx,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

function SectionTitle({ title }) {
  return (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 700,
        fontSize: 18,
        color: "#1E2A1F",
        lineHeight: 1.2,
      }}
    >
      {title}
    </Typography>
  );
}

function IconCircle({ children }) {
  return (
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EDF6EE",
        flexShrink: 0,
      }}
    >
      {children}
    </Box>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1.35,
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: "#243224",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          color: "text.secondary",
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
