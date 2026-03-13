import React from "react";

function Login() {
  return (
    <div className="login-container">
      <h1>로그인</h1>

      <div>
        <input type="text" placeholder="아이디" />
      </div>

      <div>
        <input type="password" placeholder="비밀번호" />
      </div>

      <div>
        <button>로그인</button>
      </div>
    </div>
  );
}

export default Login;
