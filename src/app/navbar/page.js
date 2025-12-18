"use client";

import Link from "next/link";
import { useAuth } from "../usecontext/usecontext";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { token, logout, isLoading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userRef = useRef(null);
  const notiRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setNotiOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleGetNotification = async () => {
    setNotiOpen((prev) => !prev);

    if (notifications.length > 0) return;

    try {
      const res = await axios.get(
        "http://localhost:4000/api/auth/getnoti",
        { withCredentials: true }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log("Notification fetch error:", err);
    }
  };

  if (isLoading) return <nav className="nav-container" />;

  return (
    <nav className="nav-container">
      {/* LEFT */}
      <div className="nav-left">
        <Link href="/" className="logo">FollowX</Link>
      </div>

    
      <div className="nav-center">
        <Link href="/" className="nav-item">Home</Link>
        <Link href="/followers" className="nav-item">Followers</Link>
        <Link href="/exchange" className="nav-item">Exchange</Link>
        <Link href="/about" className="nav-item">About</Link>
      </div>

      <div className="nav-right">
        {token && (
          <div className="noti-wrapper" ref={notiRef}>
            <IoIosNotificationsOutline
              size={32}
              color="#00eaff"
              className="noti-icon"
              onClick={handleGetNotification}
            />

            <span className="noti-count">
              {notifications.length || 1}
            </span>

            {notiOpen && (
              <div className="noti-dropdown">
                {notifications.length === 0 ? (
                  <p className="noti-empty">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className="noti-item">
                      <img
                        src={n.sender?.avatarUrl || "/default.png"}
                        className="noti-avatar"
                      />
                      <div>
                        <p className="noti-user">@{n.sender?.username}</p>
                        <p className="noti-text">followed you</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {!token ? (
          <>
            <Link href="/login" className="login-btn">Login</Link>
            <Link href="/signup" className="signup-btn">Sign Up</Link>
          </>
        ) : (
          <div className="user-wrapper" ref={userRef}>
            <FaRegUserCircle
              size={32}
              color="#00eaff"
              className="user-icon"
              onClick={() => setMenuOpen(!menuOpen)}
            />

            {menuOpen && (
              <div className="user-dropdown">
                <Link href="/profile" className="dropdown-item">Profile</Link>
                <Link href="/query" className="dropdown-item">Query</Link>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
