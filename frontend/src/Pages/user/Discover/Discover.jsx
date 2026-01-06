import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

import Navbar from "../../../Components/Navbar/Navbar";
import Sidebar from "../../../Components/Sidebar/Sidebar";

import "./Discover.css";

const DiscoverPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5100/api/social/discover", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="app-container">
            <Navbar />
            <div className="content-container">
                <Sidebar />
                <main className="discover-main">
                    <div className="discover-content">
                        <header className="discover-header">
                            <h2 className="discover-title">Artists to follow</h2>
                        </header>

                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Finding artists...</p>
                            </div>
                        ) : users.length > 0 ? (
                            <div className="artist-grid">
                                {users.map((user) => (
                                    <div 
                                        key={user._id} 
                                        className="artist-card"
                                        onClick={() => navigate(`/profile/${user._id}`)}
                                    >
                                        <div className="artist-img-wrapper">
                                            {user.profilePictureUrl ? (
                                                <img
                                                    src={user.profilePictureUrl}
                                                    alt={user.name}
                                                    className="artist-img"
                                                />
                                            ) : (
                                                <FaUserCircle className="default-avatar-icon" />
                                            )}
                                        </div>
                                        <div className="artist-info">
                                            <span className="artist-name">{user.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <p>No artists found.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DiscoverPage;