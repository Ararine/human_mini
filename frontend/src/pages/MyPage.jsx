import React, { useEffect, useMemo, useState } from "react";
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
const RECENT_SEARCHES_KEY = "recentSearches";
const MAX_RECENT_SEARCHES = 10;

const DEFAULT_RECENT_SEARCHES = [
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
];

function splitEmail(email = "") {
  if (!email.includes("@")) {
    return {
      emailId: email || "",
      emailDomain: "",
    };
  }

  const [emailId, ...rest] = email.split("@");

  return {
    emailId: emailId || "",
    emailDomain: rest.join("@") || "",
  };
}

function getStoredRecentSearches() {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!saved) return DEFAULT_RECENT_SEARCHES;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return DEFAULT_RECENT_SEARCHES;

    return parsed.slice(0, MAX_RECENT_SEARCHES);
  } catch (error) {
    return DEFAULT_RECENT_SEARCHES;
  }
}

function saveRecentSearches(searches) {
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)),
  );
}

/*
  나중에 Map.jsx나 검색 페이지에서 공원 검색 시 아래 함수 로직처럼 넣으면 됨.

  예시:
  addRecentSearch({
    id: Date.now(),
    name: place.name,
    address: place.address,
    lat: place.lat,
    lng: place.lng,
  });
*/
export function addRecentSearch(place) {
  if (!place || !place.name) return;

  const current = getStoredRecentSearches();

  const filtered = current.filter((item) => {
    const isSameId = item.id === place.id;
    const isSamePlace =
      item.name === place.name &&
      item.address === place.address &&
      item.lat === place.lat &&
      item.lng === place.lng;

    return !isSameId && !isSamePlace;
  });

  const newItem = {
    id: place.id || Date.now(),
    name: place.name,
    address: place.address || "",
    lat: place.lat ?? null,
    lng: place.lng ?? null,
  };

  const updated = [newItem, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  saveRecentSearches(updated);
}

export default function MyPage() {
  const navigate = useNavigate();

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

  const phoneParts = (userInfo.phone || "010-0000-0000").split("-");
  const initialEmailParts = splitEmail(userInfo.email);

  const [recentSearches, setRecentSearches] = useState(() =>
    getStoredRecentSearches(),
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editForm, setEditForm] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
    phone1: phoneParts[0] || "010",
    phone2: phoneParts[1] || "",
    phone3: phoneParts[2] || "",
    telecomProvider: userInfo.telecomProvider || "",
    emailId: initialEmailParts.emailId,
    emailDomain: initialEmailParts.emailDomain,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    telecomProvider: "",
    emailId: "",
    emailDomain: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [domainReadOnly, setDomainReadOnly] = useState(false);
  const [selectedDomainOption, setSelectedDomainOption] = useState("");

  useEffect(() => {
    saveRecentSearches(recentSearches);
  }, [recentSearches]);

  const resetEditForm = () => {
    const latestPhone = (
      localStorage.getItem("phone_number") || userInfo.phone
    ).split("-");

    const latestEmail = localStorage.getItem("email") || userInfo.email;
    const latestEmailParts = splitEmail(latestEmail);

    setEditForm({
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
      emailId: latestEmailParts.emailId,
      emailDomain: latestEmailParts.emailDomain,
    });

    const presetDomains = ["gmail.com", "naver.com", "daum.net"];
    if (presetDomains.includes(latestEmailParts.emailDomain)) {
      setSelectedDomainOption(latestEmailParts.emailDomain);
      setDomainReadOnly(true);
    } else {
      setSelectedDomainOption("");
      setDomainReadOnly(false);
    }

    setErrors({
      currentPassword: "",
      password: "",
      passwordConfirm: "",
      phone: "",
      telecomProvider: "",
      emailId: "",
      emailDomain: "",
    });

    setShowCurrentPassword(false);
    setShowPassword(false);
    setShowPasswordConfirm(false);
  };

  const handleEditProfile = () => {
    resetEditForm();
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    resetEditForm();
    setIsEditMode(false);
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

    if (name === "emailId" || name === "emailDomain") {
      setErrors((prev) => ({
        ...prev,
        emailId: "",
        emailDomain: "",
      }));
    }
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
      phone: "",
    }));
  };

  const handleDomainSelect = (e) => {
    const selectedDomain = e.target.value;
    setSelectedDomainOption(selectedDomain);

    if (selectedDomain) {
      setEditForm((prev) => ({
        ...prev,
        emailDomain: selectedDomain,
      }));
      setDomainReadOnly(true);
    } else {
      setEditForm((prev) => ({
        ...prev,
        emailDomain: "",
      }));
      setDomainReadOnly(false);
    }

    setErrors((prev) => ({
      ...prev,
      emailId: "",
      emailDomain: "",
    }));
  };

  const validateEditForm = () => {
    const newErrors = {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
      phone: "",
      telecomProvider: "",
      emailId: "",
      emailDomain: "",
    };

    let isValid = true;

    const email = `${editForm.emailId.trim()}@${editForm.emailDomain.trim()}`;
    const isPasswordEditing =
      editForm.currentPassword.trim() ||
      editForm.password.trim() ||
      editForm.passwordConfirm.trim();

    if (!editForm.emailId.trim()) {
      newErrors.emailId = "이메일 아이디를 입력해주세요.";
      isValid = false;
    }

    if (!editForm.emailDomain.trim()) {
      newErrors.emailDomain = "도메인을 입력해주세요.";
      isValid = false;
    }

    if (
      editForm.emailId.trim() &&
      editForm.emailDomain.trim() &&
      !EMAIL_REGEX.test(email)
    ) {
      newErrors.emailId = "올바른 이메일 형식을 입력해주세요.";
      isValid = false;
    }

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
      newErrors.phone = "휴대폰 번호를 입력해주세요.";
      isValid = false;
    } else if (
      editForm.phone1.length !== 3 ||
      editForm.phone2.length !== 4 ||
      editForm.phone3.length !== 4
    ) {
      newErrors.phone = "휴대폰 번호를 정확히 입력해주세요.";
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

    const email = `${editForm.emailId.trim()}@${editForm.emailDomain.trim()}`;

    const payload = {
      email,
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

  const handleDeleteRecent = (e, id) => {
    e.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllRecent = () => {
    const confirmed = window.confirm("최근 검색 목록을 모두 삭제하시겠습니까?");
    if (!confirmed) return;
    setRecentSearches([]);
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
      localStorage.removeItem(RECENT_SEARCHES_KEY);

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
        px: { xs: 1.2, md: 3 },
        py: { xs: 1.5, md: 3 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
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
            fontSize: { xs: 17, md: 19 },
            lineHeight: 1.2,
            flexShrink: 0,
          }}
        >
          🍃NEARGARDEN
        </Box>

        <Chip
          label="마이페이지"
          size="small"
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
        spacing={1.5}
        alignItems="stretch"
      >
        <CustomCard
          sx={{
            flex: 1.18,
            minWidth: 0,
          }}
          contentSx={{
            p: { xs: 1.8, md: 2.1 },
            "&:last-child": { pb: { xs: 1.8, md: 2.1 } },
          }}
        >
          <Stack spacing={1.35}>
            <Stack spacing={0.25}>
              <Typography
                fontSize={{ xs: 21, md: 26 }}
                fontWeight={800}
                color="#1f2a1f"
                lineHeight={1.2}
              >
                내 계정 정보
              </Typography>
              <Typography color="text.secondary" fontSize={13}>
                내 정보와 최근 검색 공원을 확인할 수 있어요
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 1.6,
                borderRadius: 3,
                bgcolor: "#f5faf4",
                border: "1px solid #e2efe2",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={1.2}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconCircle>
                    <PersonRoundedIcon fontSize="small" />
                  </IconCircle>
                  <Box>
                    <Typography fontSize={12.5} color="text.secondary">
                      로그인 아이디
                    </Typography>
                    <Typography fontSize={17} fontWeight={800}>
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
                      alignSelf: { xs: "stretch", sm: "center" },
                      borderRadius: 2.5,
                      px: 1.8,
                      minWidth: 120,
                      height: 36,
                      boxShadow: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    프로필 수정
                  </Button>
                ) : (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={0.8}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<CloseRoundedIcon />}
                      onClick={handleCancelEdit}
                      size="small"
                      sx={{
                        borderRadius: 2.5,
                        px: 1.5,
                        height: 36,
                        whiteSpace: "nowrap",
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
                        px: 1.5,
                        height: 36,
                        boxShadow: "none",
                        whiteSpace: "nowrap",
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

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 1.2,
                    alignItems: "start",
                  }}
                >
                  <TextField
                    size="small"
                    label="기존 비밀번호"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    fullWidth
                    value={editForm.currentPassword}
                    onChange={handleChangeEditForm}
                    error={Boolean(errors.currentPassword)}
                    helperText={
                      errors.currentPassword || "비밀번호를 바꿀 때만 입력"
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

                  <Box sx={{ display: { xs: "none", md: "block" } }} />

                  <TextField
                    size="small"
                    label="새 비밀번호"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={editForm.password}
                    onChange={handleChangeEditForm}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password || "8자 이상 / 영문 / 숫자 / 특수문자"
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
                    size="small"
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

                  <Box sx={{ display: { xs: "none", md: "block" } }} />
                </Box>

                <Box
                  sx={{
                    p: 1.2,
                    border: "1px solid #edf2ed",
                    borderRadius: 3,
                    bgcolor: "#fcfdfc",
                  }}
                >
                  <Typography fontSize={13.5} fontWeight={700} sx={{ mb: 0.9 }}>
                    휴대폰 번호 / 통신사
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1.35fr 0.85fr",
                      },
                      gap: 1,
                      alignItems: "start",
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 12px 1fr 12px 1fr",
                          gap: 0.4,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          size="small"
                          name="phone1"
                          value={editForm.phone1}
                          onChange={handlePhoneChange}
                          inputProps={{ maxLength: 3 }}
                          error={Boolean(errors.phone)}
                          placeholder="010"
                        />
                        <Typography textAlign="center">-</Typography>
                        <TextField
                          size="small"
                          name="phone2"
                          value={editForm.phone2}
                          onChange={handlePhoneChange}
                          inputProps={{ maxLength: 4 }}
                          error={Boolean(errors.phone)}
                          placeholder="1234"
                        />
                        <Typography textAlign="center">-</Typography>
                        <TextField
                          size="small"
                          name="phone3"
                          value={editForm.phone3}
                          onChange={handlePhoneChange}
                          inputProps={{ maxLength: 4 }}
                          error={Boolean(errors.phone)}
                          placeholder="5678"
                        />
                      </Box>

                      <Typography
                        fontSize={12}
                        color={errors.phone ? "error.main" : "transparent"}
                        sx={{ mt: 0.6, minHeight: 18 }}
                      >
                        {errors.phone || " "}
                      </Typography>
                    </Box>

                    <TextField
                      select
                      size="small"
                      label="통신사"
                      name="telecomProvider"
                      fullWidth
                      value={editForm.telecomProvider}
                      onChange={handleChangeEditForm}
                      error={Boolean(errors.telecomProvider)}
                      helperText={errors.telecomProvider || " "}
                    >
                      <MenuItem value="">선택</MenuItem>
                      <MenuItem value="SKT">SKT</MenuItem>
                      <MenuItem value="KT">KT</MenuItem>
                      <MenuItem value="LGU+">LGU+</MenuItem>
                      <MenuItem value="알뜰폰">알뜰폰</MenuItem>
                    </TextField>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 1.2,
                    border: "1px solid #edf2ed",
                    borderRadius: 3,
                    bgcolor: "#fcfdfc",
                  }}
                >
                  <Typography fontSize={13.5} fontWeight={700} sx={{ mb: 0.9 }}>
                    이메일
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "1.2fr 28px 1fr 1fr",
                      },
                      gap: 1,
                      alignItems: "start",
                    }}
                  >
                    <TextField
                      size="small"
                      label="이메일 아이디"
                      name="emailId"
                      value={editForm.emailId}
                      onChange={handleChangeEditForm}
                      error={Boolean(errors.emailId)}
                      helperText={errors.emailId || " "}
                      placeholder="example"
                    />

                    <Box
                      sx={{
                        height: 40,
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.secondary",
                        fontWeight: 700,
                      }}
                    >
                      @
                    </Box>

                    <TextField
                      size="small"
                      name="emailDomain"
                      value={editForm.emailDomain}
                      onChange={handleChangeEditForm}
                      error={Boolean(errors.emailDomain)}
                      helperText={errors.emailDomain || " "}
                      placeholder="domain.com"
                      InputProps={{ readOnly: domainReadOnly }}
                    />

                    <TextField
                      select
                      size="small"
                      value={selectedDomainOption}
                      onChange={handleDomainSelect}
                      helperText=" "
                    >
                      <MenuItem value="">직접입력</MenuItem>
                      <MenuItem value="gmail.com">gmail.com</MenuItem>
                      <MenuItem value="naver.com">naver.com</MenuItem>
                      <MenuItem value="daum.net">daum.net</MenuItem>
                    </TextField>
                  </Box>
                </Box>
              </>
            )}

            <Divider />

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={handleWithdraw}
                disabled={isDeleting}
                sx={{
                  flex: 1,
                  minHeight: 40,
                  borderRadius: 2.5,
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
                  minHeight: 40,
                  borderRadius: 2.5,
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
            flex: 0.9,
            minWidth: 0,
          }}
          contentSx={{
            p: { xs: 1.8, md: 2.1 },
            "&:last-child": { pb: { xs: 1.8, md: 2.1 } },
          }}
        >
          <Stack spacing={1.2}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <SectionTitle title="최근 검색 목록" />

              <Stack direction="row" alignItems="center" spacing={0.8}>
                <Chip
                  icon={<SearchRoundedIcon />}
                  label={`최근 검색 ${recentSearches.length}개`}
                  size="small"
                  sx={{
                    bgcolor: "#eef7ee",
                    color: "#2e7d32",
                    fontWeight: 700,
                  }}
                />

                {recentSearches.length > 0 && (
                  <Button
                    size="small"
                    color="error"
                    variant="text"
                    onClick={handleClearAllRecent}
                    sx={{
                      minWidth: "auto",
                      px: 1,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    전체삭제
                  </Button>
                )}
              </Stack>
            </Stack>

            <Typography color="text.secondary" fontSize={12}>
              클릭 시 메인 지도로 이동
            </Typography>

            {recentSearches.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  borderRadius: 3,
                  bgcolor: "#fafcf9",
                  border: "1px dashed #dbe7db",
                  textAlign: "center",
                }}
              >
                <Typography fontSize={14} fontWeight={700} color="#415341">
                  최근 검색 기록이 없습니다
                </Typography>
                <Typography
                  fontSize={12}
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  공원을 검색하면 여기에 표시됩니다
                </Typography>
              </Box>
            ) : (
              <List disablePadding sx={{ p: 0 }}>
                {recentSearches.map((item, index) => (
                  <Box key={item.id}>
                    <ListItemButton
                      onClick={() => handleRecentClick(item)}
                      sx={{
                        px: 1,
                        py: 0.95,
                        borderRadius: 2.2,
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
                        spacing={1.2}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          minWidth={0}
                          sx={{ flex: 1 }}
                        >
                          <IconCircle small>
                            <AccessTimeRoundedIcon fontSize="small" />
                          </IconCircle>

                          <ListItemText
                            primary={
                              <Typography fontWeight={700} fontSize={14} noWrap>
                                {index + 1}. {item.name}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                color="text.secondary"
                                fontSize={12}
                                noWrap
                              >
                                {item.address}
                              </Typography>
                            }
                          />
                        </Stack>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.3}
                        >
                          <IconButton
                            onClick={(e) => handleDeleteRecent(e, item.id)}
                            size="small"
                            sx={{
                              color: "#d32f2f",
                              "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.08)",
                              },
                            }}
                          >
                            <CloseRoundedIcon fontSize="small" />
                          </IconButton>

                          <ChevronRightRoundedIcon
                            sx={{ color: "text.secondary", fontSize: 20 }}
                          />
                        </Stack>
                      </Stack>
                    </ListItemButton>

                    {index !== recentSearches.length - 1 && (
                      <Divider sx={{ my: 0.3 }} />
                    )}
                  </Box>
                ))}
              </List>
            )}
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
        borderRadius: 4,
        border: "1px solid #ebf1eb",
        boxShadow: "0 8px 24px rgba(31, 42, 31, 0.06)",
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, md: 2.3 },
          "&:last-child": { pb: { xs: 2, md: 2.3 } },
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
    <Typography fontSize={17} fontWeight={800} color="#1f2a1f">
      {title}
    </Typography>
  );
}

function IconCircle({ children, small = false }) {
  return (
    <Box
      sx={{
        width: small ? 30 : 34,
        height: small ? 30 : 34,
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
        py: 0.95,
        borderBottom: "1px solid #f1f4f1",
      }}
    >
      <Typography fontSize={13.5} color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize={14.5} fontWeight={700} textAlign="right">
        {value}
      </Typography>
    </Box>
  );
}
