import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserFriends, FaSearch, FaMusic, FaHome } from "react-icons/fa";
import ProfileMenu from "../Profilemenu/ProfileMenu";
import "./Navbar.css";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    };

    const goHome = () => {
        navigate("/dashboard");
    };

    const goDiscover = () => {
        navigate("/discover"); // Navigate to your new Discover Page
    };

    return (
        <nav className="navbar">
            {/* Left: Branding */}
            <div className="navbar-left" onClick={goHome} style={{ cursor: "pointer" }}>
                <FaMusic className="Music-logo" />
                <span className="brand-name">TuneHub</span>
            </div>

            {/* Center: Home Button + Search */}
            <div className="navbar-center-group">
                <div className="home-button-wrapper" onClick={goHome} title="Home">
                    <FaHome className="home-icon-nav" />
                </div>

                <form className="navbar-center" onSubmit={handleSearch}>
                    <div className="search-bar">
                        <FaSearch className="search-icon-left" />
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            {/* Right: Notifications, Friends, Profile */}
            <div className="navbar-right">
                <FaBell className="nav-icon" title="Notifications" />

                {/* Updated: Friends Icon now navigates to Discover */}
                <div className="nav-icon-wrapper" onClick={goDiscover} title="Discover People">
                    <FaUserFriends className="nav-icon" />
                </div>

                <ProfileMenu />
            </div>
        </nav>
    );
};

export default Navbar;