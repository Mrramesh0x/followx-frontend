"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../usecontext/usecontext";  

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const [res] = await Promise.all([
      axios.post(
        "http://localhost:4000/api/auth/login",
        { email, password },
        { withCredentials: true }
      ),
      new Promise((resolve) => setTimeout(resolve, 5000))
    ]);

    const token = res.data.token;
    login(token);

    if (res.data.userStatus === false) {
      router.push("/setup-profile");
    } else {
      router.push("/");
    }

  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

       <button
  type="submit"
  className="btn"
  disabled={!email || !password || loading}
>
  {loading && <span className="btn-spinner" />}

  <span style={{ visibility: loading ? "hidden" : "visible" }}>
    Login
  </span>
</button>


        {message && <p className="response-msg">{message}</p>}
      </form>
    </div>
  );
}
