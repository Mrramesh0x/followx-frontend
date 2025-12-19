"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../usecontext/usecontext";
import { FaUserPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ProfilesPage() {
  const { token } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const getProfilesExceptLoggedin = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        axios.get(
          "https://followx-backend.onrender.com/api/auth/getallprofilesexceptloggedin",
          { withCredentials: true }
        ),
        new Promise((resolve) => setTimeout(resolve, 5000))
      ]);

      setProfiles(res.data.profiles || []);
    } catch (error) {
      toast.error("Failed to fetch profiles");
      // console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

 
  const getAllProfiles = async () => {
    setLoading(true);
    try {
      const [res] = await Promise.all([
        axios.get(
          "https://followx-backend.onrender.com/api/auth/getallprofiles",
          { withCredentials: true }
        ),
        new Promise((resolve) => setTimeout(resolve, 5000))
      ]);

      setProfiles(res.data.profiles || []);
    } catch (error) {
      toast.error("Failed to fetch profiles");
      // console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    if (token) {
      getProfilesExceptLoggedin();
    } else {
      getAllProfiles();
    }
  }, [token]);

  // ---------------- SEND NOTIFICATION ----------------
  const handleVerify = async (recId) => {
    try {
      await axios.post(
        "https://followx-backend.onrender.com/api/auth/sendnoti",
        { receiverId: recId },
        { withCredentials: true }
      );
      toast.success("Followed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending notification");
      console.error("send noti error:", err.response?.data || err.message);
    }
  };



const handleGetFollowingList = async () => {
  const res = await axios.get("https://followx-backend.onrender.com/api/auth/getfollowinglist",{
    withCredentials:true
  })
  // console.log(res)
}


  return (
    <div className="all-profiles-container">
      {loading ? (
        <div className="page-loader">
          <span className="btn-spinner" />
        </div>
      ) : profiles.length === 0 ? (
        <p className="no-profiles-text">No profiles found</p>
      ) : (
        profiles.map((p) => (
          <div key={p._id} className="single-profile-box">
            <img
              src={p.avatarUrl || "/default.png"}
              alt="profile"
              className="profile-photo"
            />

            <h3 className="profile-name">{p.name}</h3>
            <p className="profile-username">@{p.username}</p>

            <button
              className="follow-profile-btn"
              onClick={() => handleVerify(p.userId)}
            >
              <FaUserPlus /> Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
}
