import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MainHeader({ handleKeyDownSearch, handleClickSearch }) {
  const [changeKeyword, setChangeKeyword] = useState("");
  const navigate = useNavigate();

  const loginUser = sessionStorage.getItem("loginUser");
  const isLogin = !!loginUser; // ✅ 로그인 여부 판단

  // 검색창에 단어 입력시 작동하는 함수
  const handleChangeKeyword = (e) => {
    setChangeKeyword(e.target.value);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        color: "#222",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "72px",
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* 로고 영역 */}
        <Box sx={{ minWidth: 180 }}>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.3,
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "opacity 0.2s",
              "&:hover": {
                opacity: 0.7,
              },
            }}
          >
            🍃 NEARGARDEN
          </Typography>
        </Box>

        {/* 검색 영역 */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 620,
              display: "flex",
              alignItems: "stretch",
              border: "1px solid",
              borderColor: "#dcdcdc",
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              fullWidth
              placeholder="공원명 또는 지역을 검색하세요"
              variant="outlined"
              size="small"
              onChange={handleChangeKeyword}
              onKeyDown={(e) => handleKeyDownSearch(e)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: 0,
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input": {
                  px: 2,
                },
              }}
            />

            <Button
              variant="contained"
              onClick={() => handleClickSearch(changeKeyword)}
              sx={{
                minWidth: 96,
                height: 44,
                borderRadius: 0,
                boxShadow: "none",
                fontWeight: 700,
                px: 3,
                whiteSpace: "nowrap",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              검색
            </Button>
          </Box>
        </Box>

        {/* 로그인 / 마이페이지 영역 */}
        <Box
          sx={{
            minWidth: 180,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              if (isLogin) {
                navigate("/mypage"); // ✅ 로그인 상태 → 마이페이지
              } else {
                navigate("/login"); // ❌ 비로그인 → 로그인
              }
            }}
            sx={{
              borderRadius: 2,
              px: 2.5,
              height: 40,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {isLogin ? "마이페이지" : "로그인"}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
