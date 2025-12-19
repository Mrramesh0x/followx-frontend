"use client"
import React from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
const router = useRouter()
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");


    try {
      const res = await axios.post("https://followx-backend.onrender.com/api/auth/signup", {
        name,
        email,
        password,
      },{withCredentials:true});
    //  console.log(res)
      setMessage(res.data.message || "Signup successful!");
      if(res.status===201){
        router.push("/login")
      }
    } catch (err) {
      // console.log(err)
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-box" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
  {loading ? <span className="btn-spinner"></span> : "Signup"}
</button>

        {message && <p className="response-msg">{message}</p>}
      </form>
    </div>
  );
}
