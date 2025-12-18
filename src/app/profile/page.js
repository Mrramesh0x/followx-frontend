"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../usecontext/usecontext";

export default function MyProfileCard() {
  const { isLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await axios.get(
          "http://localhost:4000/api/auth/me",
          { withCredentials: true } 
        );
        setProfile(res.data.profile);
      } catch (error) {
        console.error("fetchProfile error:", error?.response?.data || error.message);
        setErr(error?.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    // Only attempt after auth provider has finished (optional)
    if (!isLoading) fetchProfile();
  }, [isLoading]);

  if (isLoading) return <p>Checking authentication...</p>;
  if (loading) return <p>Loading profile...</p>;
  if (err) return <p style={{ color: "red" }}>{err}</p>;
  if (!profile) return <p>No profile saved yet.</p>;

  return (
    <div className="profile-card">
      <img
        src={profile.avatarUrl}
        alt={profile.username}
        style={{ width: 96, height: 96, borderRadius: "50%" }}
      />
      <h3>@{profile.username}</h3>
      <a href={profile.profileUrl} target="_blank" rel="noreferrer">
        View on X
      </a>
      <p>Saved: {new Date(profile.createdAt).toLocaleString()}</p>
    </div>
  );
}
