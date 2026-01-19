import React, { useEffect, useState, useCallback } from "react";
import { FaArrowLeft, FaUserCircle, FaEllipsisH, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PlaylistCard from "../../../Components/PlaylistCard/PlaylistCard";
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

  if (loading) return <div className="loader-container"><div className="spotify-spinner"></div></div>;
  if (error || !user) return <div className="error-screen">User not found</div>;

  return (
    <div className="profile-page">
      <div className="glass-container">
        <div className="header-overlay">
          <nav className="top-nav">
            {/* Changed navigate(-1) to navigate("/") */}
            <FaArrowLeft className="back-icon" onClick={() => navigate("/")} />
          </nav>

          <div className="hero-content">
            <div className="image-wrapper">
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt={user.name} />
              ) : (
                <FaUserCircle className="default-avatar" />
              )}
            </div>
            <div className="text-info">
              <span className="badge">PROFILE</span>
              <h1 className="display-name">{user.name}</h1>
              <div className="social-stats">
                <span><b>{followingCount}</b> Following</span>
                <span><b>{followerCount}</b> Followers</span>
                <span><b>{playlists.length}</b> Public Playlists</span>
              </div>
            </div>
          </div>
        </div>

        <main className="main-content">
          <div className="action-bar">
            {id ? (
              <button
                className={isFollowing ? "follow-btn following" : "follow-btn"}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            ) : (
              <div className="own-profile-actions">
                <button className="follow-btn" onClick={() => navigate("/settings")}>
                  Edit Profile
                </button>
                <button className="upload-btn-link" onClick={() => navigate("/upload")}>
                  <FaPlus /> Upload Song
                </button>
              </div>
            )}
            <FaEllipsisH className="more-btn" />
          </div>

          <section className="playlist-grid-section">
            <h2 className="grid-title">Public Playlists</h2>
            <div className="spotify-grid">
              {playlists.length > 0 ? (
                playlists.map(pl => (
                  <PlaylistCard
                    key={pl._id || pl.id}
                    playlist={pl}
                    userName={user.name}
                  />
                ))
              ) : (
                <p className="empty-msg">No public playlists yet.</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;