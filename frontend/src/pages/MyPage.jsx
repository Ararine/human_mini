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
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const API_BASE_URL = "http://localhost:5000";

export default function MyPage() {
  const navigate = useNavigate();

  // 임시 표시용 기본값
  // 현재 백엔드에 사용자 조회 GET API가 없어서 화면 최초 진입 시에는
  // localStorage 값을 우선 사용하고, 없으면 fallback 값을 보여주도록 처리
  const storedUsername = localStorage.getItem("username") || "";
  const storedEmail = localStorage.getItem("email") || "";
  const storedPhone = localStorage.getItem("phone_number") || "";
  const storedTelecomProvider = localStorage.getItem("telecom_provider") || "";

  const userInfo = useMemo(
    () => ({
      loginId: storedUsername || "로그인 사용자",
      name: localStorage.getItem("name") || "사용자",
      birth: localStorage.getItem("birth") || "-",
      gender: localStorage.getItem("gender") || "-",
      email: storedEmail || "",
      phone: storedPhone || "010-0000-0000",
      telecomProvider: storedTelecomProvider || "",
    }),
    [storedUsername, storedEmail, storedPhone, storedTelecomProvider],
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

  const phoneParts = (userInfo.phone || "010-0000-0000").split("-");

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    email: userInfo.email,
    currentPassword: "",
    password: "",
    passwordConfirm: "",
    phone1: phoneParts[0] || "010",
    phone2: phoneParts[1] || "",
    phone3: phoneParts[2] || "",
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

  const resetEditForm = () => {
    const latestPhone = (
      localStorage.getItem("phone_number") || userInfo.phone
    ).split("-");
    setEditForm({
      email: localStorage.getItem("email") || userInfo.email,
      currentPassword: "",
      password: "",
      passwordConfirm: "",
      phone1: latestPhone[0] || "010",
      phone2: latestPhone[1] || "",
      phone3: latestPhone[2] || "",
      telecomProvider:
        localStorage.getItem("telecom_provider") ||
        userInfo.telecomProvider ||
        "",
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
  };

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

  const handleEditProfile = () => {
    resetEditForm();
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    resetEditForm();
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
    } else if (!EMAIL_REGEX.test(editForm.email.trim())) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
      isValid = false;
    }

    const isPasswordEditing =
      editForm.currentPassword.trim() ||
      editForm.password.trim() ||
      editForm.passwordConfirm.trim();

    if (isPasswordEditing) {
      if (!editForm.currentPassword.trim()) {
        newErrors.currentPassword = "기존 비밀번호를 입력해주세요.";
        isValid = false;
      }

      if (!editForm.password.trim()) {
        newErrors.password = "새 비밀번호를 입력해주세요.";
        isValid = false;
      } else if (!PASSWORD_REGEX.test(editForm.password.trim())) {
        newErrors.password =
          "비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 포함해야 합니다.";
        isValid = false;
      } else if (editForm.currentPassword === editForm.password) {
        newErrors.password = "기존 비밀번호와 다른 새 비밀번호를 입력해주세요.";
        isValid = false;
      }

      if (!editForm.passwordConfirm.trim()) {
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

  const handleSaveProfile = async () => {
    if (!validateEditForm()) return;

    const username = localStorage.getItem("username");
    if (!username) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    const payload = {
      email: editForm.email.trim(),
      phone_number: `${editForm.phone1}-${editForm.phone2}-${editForm.phone3}`,
    };

    if (editForm.password.trim()) {
      payload.password = editForm.password.trim();
    }

    try {
      setIsSaving(true);

      const response = await fetch(`${API_BASE_URL}/users/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원 정보 수정에 실패했습니다.");
      }

      localStorage.setItem("email", payload.email);
      localStorage.setItem("phone_number", payload.phone_number);
      localStorage.setItem("telecom_provider", editForm.telecomProvider);

      alert("회원 정보가 수정되었습니다.");
      setIsEditMode(false);
      resetEditForm();

      window.location.reload();
    } catch (error) {
      alert(error.message || "수정 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRecentClick = (place) => {
    navigate("/", {
      state: {
        selectedPlace: place,
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("phone_number");
    localStorage.removeItem("telecom_provider");
    localStorage.removeItem("name");
    localStorage.removeItem("birth");
    localStorage.removeItem("gender");

    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  const handleWithdraw = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    const confirmed = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n탈퇴 후 계정 정보는 복구할 수 없습니다.",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`${API_BASE_URL}/users/${username}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원탈퇴에 실패했습니다.");
      }

      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("phone_number");
      localStorage.removeItem("telecom_provider");
      localStorage.removeItem("name");
      localStorage.removeItem("birth");
      localStorage.removeItem("gender");

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      alert(error.message || "회원탈퇴 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7faf7",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Box
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
          NEARGARDEN
        </Box>

        <Chip
          label="마이페이지"
          sx={{
            bgcolor: "#e8f5e9",
            color: "#2e7d32",
            fontWeight: 700,
            borderRadius: 99,
          }}
        />
      </Stack>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        alignItems="stretch"
      >
        <CustomCard
          sx={{
            flex: 1.2,
            minWidth: 0,
          }}
        >
          <Stack spacing={2.2}>
            <Stack spacing={0.5}>
              <Typography
                fontSize={{ xs: 22, md: 28 }}
                fontWeight={800}
                color="#1f2a1f"
              >
                내 계정 정보
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                내 계정 정보와 최근 검색한 공원을 확인할 수 있어요
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 2.2,
                borderRadius: 4,
                bgcolor: "#f5faf4",
                border: "1px solid #e2efe2",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack direction="row" alignItems="center" spacing={1.2}>
                  <IconCircle>
                    <PersonRoundedIcon />
                  </IconCircle>
                  <Box>
                    <Typography fontSize={13} color="text.secondary">
                      로그인 아이디
                    </Typography>
                    <Typography fontSize={18} fontWeight={800}>
                      {userInfo.loginId}
                    </Typography>
                  </Box>
                </Stack>

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
                      disabled={isSaving}
                      size="small"
                      sx={{
                        borderRadius: 2.5,
                        px: 1.6,
                        height: 36,
                        boxShadow: "none",
                      }}
                    >
                      {isSaving ? "저장 중..." : "저장"}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Box>

            {!isEditMode ? (
              <>
                <SectionTitle title="기본 정보" />
                <InfoRow label="이름" value={userInfo.name} />
                <InfoRow label="생년월일" value={userInfo.birth} />
                <InfoRow label="성별" value={userInfo.gender} />
                <InfoRow label="이메일" value={userInfo.email || "-"} />
                <InfoRow label="휴대폰 번호" value={userInfo.phone || "-"} />
                <InfoRow
                  label="통신사"
                  value={userInfo.telecomProvider || "-"}
                />
              </>
            ) : (
              <>
                <SectionTitle title="프로필 수정" />

                <Stack spacing={2}>
                  <TextField
                    label="이메일"
                    name="email"
                    fullWidth
                    value={editForm.email}
                    onChange={handleChangeEditForm}
                    error={Boolean(errors.email)}
                    helperText={errors.email || " "}
                  />

                  <TextField
                    label="기존 비밀번호"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    fullWidth
                    value={editForm.currentPassword}
                    onChange={handleChangeEditForm}
                    error={Boolean(errors.currentPassword)}
                    helperText={
                      errors.currentPassword ||
                      "비밀번호를 변경할 때만 입력해주세요."
                    }
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
                    fullWidth
                    value={editForm.password}
                    onChange={handleChangeEditForm}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password ||
                      "8자 이상, 영문/숫자/특수문자를 포함해주세요."
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
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
                    fullWidth
                    value={editForm.passwordConfirm}
                    onChange={handleChangeEditForm}
                    error={Boolean(errors.passwordConfirm)}
                    helperText={errors.passwordConfirm || " "}
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
                    <Typography fontSize={14} fontWeight={700} sx={{ mb: 0.9 }}>
                      휴대폰 번호
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        name="phone1"
                        value={editForm.phone1}
                        onChange={handlePhoneChange}
                        inputProps={{ maxLength: 3 }}
                        sx={{ width: 110 }}
                      />
                      <Typography>-</Typography>
                      <TextField
                        name="phone2"
                        value={editForm.phone2}
                        onChange={handlePhoneChange}
                        inputProps={{ maxLength: 4 }}
                        sx={{ width: 120 }}
                      />
                      <Typography>-</Typography>
                      <TextField
                        name="phone3"
                        value={editForm.phone3}
                        onChange={handlePhoneChange}
                        inputProps={{ maxLength: 4 }}
                        sx={{ width: 120 }}
                      />
                    </Stack>
                    <Typography
                      fontSize={12}
                      color={errors.phone1 ? "error.main" : "transparent"}
                      sx={{ mt: 0.8, minHeight: 18 }}
                    >
                      {errors.phone1 || " "}
                    </Typography>
                  </Box>

                  <TextField
                    select
                    label="통신사"
                    name="telecomProvider"
                    fullWidth
                    value={editForm.telecomProvider}
                    onChange={handleChangeEditForm}
                    error={Boolean(errors.telecomProvider)}
                    helperText={
                      errors.telecomProvider ||
                      "현재는 화면 표시 및 validation 용으로만 사용됩니다."
                    }
                  >
                    <MenuItem value="">선택</MenuItem>
                    <MenuItem value="SKT">SKT</MenuItem>
                    <MenuItem value="KT">KT</MenuItem>
                    <MenuItem value="LGU+">LGU+</MenuItem>
                    <MenuItem value="알뜰폰">알뜰폰</MenuItem>
                  </TextField>
                </Stack>
              </>
            )}

            <Divider />

            <Stack direction="row" spacing={1.2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={handleWithdraw}
                disabled={isDeleting}
                sx={{
                  flex: 1,
                  minHeight: 44,
                  borderRadius: 3,
                  fontWeight: 700,
                }}
              >
                {isDeleting ? "처리 중..." : "회원탈퇴"}
              </Button>

              <Button
                variant="contained"
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
        </CustomCard>

        <CustomCard
          sx={{
            flex: 0.92,
            minWidth: 0,
          }}
        >
          <Stack spacing={2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <SectionTitle title="최근 검색 목록" />
              <Chip
                icon={<SearchRoundedIcon />}
                label="최근 검색 8개"
                size="small"
                sx={{
                  bgcolor: "#eef7ee",
                  color: "#2e7d32",
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Typography color="text.secondary" fontSize={13}>
              클릭 시 메인 지도로 이동
            </Typography>

            <List disablePadding sx={{ p: 0 }}>
              {recentSearches.slice(0, 8).map((item, index) => (
                <Box key={item.id}>
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
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      width="100%"
                      spacing={1.5}
                    >
                      <Stack
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        minWidth={0}
                      >
                        <IconCircle>
                          <AccessTimeRoundedIcon fontSize="small" />
                        </IconCircle>
                        <ListItemText
                          primary={
                            <Typography fontWeight={700} fontSize={14.5} noWrap>
                              {index + 1}. {item.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              color="text.secondary"
                              fontSize={12.5}
                              noWrap
                            >
                              {item.address}
                            </Typography>
                          }
                        />
                      </Stack>

                      <ChevronRightRoundedIcon
                        sx={{ color: "text.secondary" }}
                      />
                    </Stack>
                  </ListItemButton>

                  {index !== recentSearches.slice(0, 8).length - 1 && (
                    <Divider sx={{ my: 0.4 }} />
                  )}
                </Box>
              ))}
            </List>
          </Stack>
        </CustomCard>
      </Stack>
    </Box>
  );
}

function CustomCard({ children, sx = {}, contentSx = {} }) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        border: "1px solid #ebf1eb",
        boxShadow: "0 10px 30px rgba(31, 42, 31, 0.06)",
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.5 },
          "&:last-child": { pb: { xs: 2, md: 2.5 } },
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
    <Typography fontSize={18} fontWeight={800} color="#1f2a1f">
      {title}
    </Typography>
  );
}

function IconCircle({ children }) {
  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        bgcolor: "#e8f5e9",
        color: "#2e7d32",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        py: 1.2,
        borderBottom: "1px solid #f1f4f1",
      }}
    >
      <Typography fontSize={14} color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize={15} fontWeight={700} textAlign="right">
        {value}
      </Typography>
    </Box>
  );
}
