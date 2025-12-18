"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../usecontext/usecontext";
import { useRouter } from "next/navigation";

const SetupProfile = () => {
  const router = useRouter()
  const { token, isLoading } = useAuth(); 

  const [profileUrl, setProfileUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  
  const [msg, setMsg] = useState("");
  const isLoggedIn = Boolean(token);  


  useEffect(() => {
    if (!profileUrl) {
      setUsername("");
      setPreview("");
      setAvatarUrl("");
      return;
    }

    try {
      let url = profileUrl.trim();
      if (!url.startsWith("http")) url = "https://" + url;

      const parsed = new URL(url);
      const uname = parsed.pathname.replace("/", "").split("/")[0];

      setUsername(uname);
      setPreview(`https://unavatar.io/x/${uname}`);
      setAvatarUrl(`https://unavatar.io/x/${uname}`);
    } catch (error) {
      setUsername("");
      setPreview("");
      setAvatarUrl("");
    }
  }, [profileUrl]);


  // SAVE PROFILE
  const handleSave = async () => {
    if (!profileUrl || !avatarUrl) {
      setMsg("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const response = await axios.post(
        "http://localhost:4000/api/auth/setup-profile",
        { profileUrl, avatarUrl },
        { withCredentials: true } // send + receive cookies
      );

      setMsg("Profile saved successfully!");
      console.log(response);
      if(response.status===200){
        router.push("/")
      }

    } catch (error) {
      console.log(error);
      setMsg("Error saving profile.");
    } finally {
      setLoading(false);
    }
  };


  if (isLoading) return <p>Checking authentication...</p>;


  return (
    <div className="setup-wrapper">
      <div className="setup-card">
        <h1>Setup Your Profile</h1>

        {!isLoggedIn && (
          <p style={{ color: "red", marginBottom: "20px" }}>
            You are not logged in. Please login to continue.
          </p>
        )}

        <input
          className="input"
          placeholder="Enter Twitter/X profile URL"
          onChange={(e) => setProfileUrl(e.target.value)}
          value={profileUrl}
          disabled={!isLoggedIn}
        />

        {username && <p className="username-preview">@{username}</p>}

        {preview && (
          <img src={preview} alt="avatar" className="avatar-preview" />
        )}

        <button 
          className="save-btn" 
          onClick={handleSave} 
          disabled={loading || !isLoggedIn}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
};

export default SetupProfile;
