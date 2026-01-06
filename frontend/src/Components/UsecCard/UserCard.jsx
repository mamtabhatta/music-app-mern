import React, { useState } from "react";
import axios from "axios";
import "./UserCard.css";

const UserCard = ({ user, isInitiallyFollowing }) => {
    const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `http://localhost:5100/api/social/toggle/${user._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsFollowing(res.data.isFollowing);
        } catch (error) {
            console.error("Follow toggle failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-card">
            <img
                src={user.profilePictureUrl || "https://via.placeholder.com/150"}
                alt={user.name}
            />
            <h4>{user.name}</h4>
            <button
                onClick={handleToggle}
                className={isFollowing ? "unfollow-btn" : "follow-btn"}
                disabled={loading}
            >
                {loading ? "..." : isFollowing ? "Following" : "Follow"}
            </button>
        </div>
    );
};

export default UserCard;