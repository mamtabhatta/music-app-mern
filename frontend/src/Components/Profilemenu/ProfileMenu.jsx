import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css";

const ProfileMenu = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const goToProfile = () => {
        navigate("/profile");
        setOpen(false); // close dropdown
    };

    return (
        <div className="profile-menu">
            <FaUserCircle
                size={28}
                onClick={() => setOpen(!open)}
                style={{ cursor: "pointer" }}
            />
            {open && (
                <div className="dropdown">
                    <button onClick={goToProfile}>Profile</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;
