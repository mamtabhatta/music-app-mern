import React, { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaUserCircle, FaEllipsisH, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PlaylistCard from "../../../Components/PlaylistCard/PlaylistCard";
import Navbar from "../../../Components/Navbar/Navbar";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token = localStorage.getItem("token");

  const loadData = useCallback(async () => {
    if (!token) return navigate("/login");
    setLoading(true);
    setError(false);

    try {
      const userUrl = id
        ? `http://localhost:5100/api/users/profile/${id}`
        : `http://localhost:5100/api/users/profile`;

      const userRes = await axios.get(userUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userRes.data);

      try {
        const playlistUrl = id
          ? `http://localhost:5100/api/playlist/user/${id}`
          : `http://localhost:5100/api/playlist/my`;

        const playlistRes = await axios.get(playlistUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPlaylists(playlistRes.data || []);
      } catch (plErr) {
        setPlaylists([]);
      }

      try {
        const statsUrl = id
          ? `http://localhost:5100/api/social/status/${id}`
          : `http://localhost:5100/api/social/my-stats`;

        const statsRes = await axios.get(statsUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFollowerCount(statsRes.data.followerCount || 0);
        setFollowingCount(statsRes.data.followingCount || 0);
        setIsFollowing(statsRes.data.isFollowing || false);
      } catch (stErr) {
        console.warn("Social stats unavailable");
      }

    } catch (err) {
      console.error("Profile load error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [token, id, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData, id]);

  const handleFollowToggle = async () => {
    if (!id) return;
    try {
      const res = await axios.post(
        `http://localhost:5100/api/social/toggle/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(res.data.isFollowing);
      setFollowerCount(prev => res.data.isFollowing ? prev + 1 : prev - 1);
    } catch (err) {
      console.error("Follow Toggle Error:", err);
    }
  };

  if (loading) return <div className="loader-container"><div className="app-spinner"></div></div>;
  if (error || !user) return <div className="error-screen">User not found</div>;

  return (
    <div className="profile-page">
      <Navbar />

      <div className="background-glow"></div>

      <main className="main-content">
        <div className="profile-card">
          <div className="card-header">
            {/* <FaArrowLeft className="back-icon" onClick={() => navigate("/")} /> */}
            {/* <FaEllipsisH className="more-btn" /> */}
          </div>

          <div className="avatar-container">
            {user.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={user.name} className="profile-img" />
            ) : (
              <FaUserCircle className="default-avatar" />
            )}
          </div>

          <h1 className="display-name">{user.name}</h1>
          <p className="user-bio">Music Enthusiast • Creator</p>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{followerCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{playlists.length}</span>
              <span className="stat-label">Playlists</span>
            </div>
          </div>

          <div className="own-profile-actions">
            {id ? (
              <button
                className={isFollowing ? "action-btn following" : "action-btn"}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            ) : (
              <div className="button-group">
                <button className="action-btn" onClick={() => navigate("/settings")}>
                  Edit Profile
                </button>
                <button className="action-btn outline" onClick={() => navigate("/upload")}>
                  <FaPlus /> Upload
                </button>
              </div>
            )}
          </div>

          <section className="playlist-grid-section">
            <h2 className="grid-title">Public Playlists</h2>
            <div className="content-grid">
              {playlists.length > 0 ? (
                playlists.map(pl => (
                  <PlaylistCard key={pl._id || pl.id} playlist={pl} userName={user.name} />
                ))
              ) : (
                <p className="empty-msg">No public playlists yet.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;