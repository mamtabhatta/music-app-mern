import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserFriends, FaSearch, FaMusic, FaHome } from "react-icons/fa";
import ProfileMenu from "../Profilemenu/ProfileMenu";
import "./Navbar.css";

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Spotify Logic: If user types, go to search page immediately
        if (value.trim().length > 0) {
            navigate(`/search?query=${encodeURIComponent(value)}`);
        } else {
            // If they clear the search, go back to dashboard or stay on search with empty query
            navigate(`/search?query=`);
        }
    };

    const goHome = () => navigate("/dashboard");
    const goDiscover = () => navigate("/discover");

    return (
        <nav className="navbar">
            <div className="navbar-left" onClick={goHome} style={{ cursor: "pointer" }}>
                <FaMusic className="Music-logo" />
                <span className="brand-name">TuneHub</span>
            </div>

            <div className="navbar-center-group">
                <div className="home-button-wrapper" onClick={goHome} title="Home">
                    <FaHome className="home-icon-nav" />
                </div>

                {/* Form submit prevented to keep logic in the input change */}
                <form className="navbar-center" onSubmit={(e) => e.preventDefault()}>
                    <div className="search-bar">
                        <FaSearch className="search-icon-left" />
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                </form>
            </div>

            <div className="navbar-right">
                <FaBell className="nav-icon" title="Notifications" />
                <div className="nav-icon-wrapper" onClick={goDiscover} title="Discover People">
                    <FaUserFriends className="nav-icon" />
                </div>
                <ProfileMenu />
            </div>
        </nav>
    );
};

export default Navbar;