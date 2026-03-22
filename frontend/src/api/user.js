import { api_cre } from "./axios";

// 회원가입
export const register = async (payload) => {
  const response = await api_cre.post("/register", payload);
  return response.data;
};

// 회원가입 중복확인
export const checkDuplicate = async (userid) => {
  const response = await api_cre.get(`/check-username/${userid}`);
  return response;
};

export const login = async (username, password) => {
  const response = await api_cre.post("/login", { username, password });
  return response;
};

// 아이디 찾기 API
export const find_id = async (email) => {
  const response = await api_cre.post("/find-id/send-code", { email });
  return response;
};

export const verify_code = async (email, code) => {
  const response = await api_cre.post("/find-id/verify-code", { email, code });
  return response;
};

// 비밀번호 재설정
export const send_code = async (email) => {
  const response = await api_cre.post("/send-email-code", { email });
  return response;
};

export const verify_password_code = async (email, code) => {
  const response = await api_cre.post("/verify-email-code", { email, code });
  return response;
};

export const logout = async () => {
  const response = await api_cre.post("/logout");
  return response;
};

export const deleteUser = async (username) => {
  const response = await api_cre.delete(`/users/${username}`);
  return response;
};

export const updateUser = async (username, data) => {
  const response = await api_cre.patch(`/users/${username}`, data);
  return response;
};
