import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import SongsTab from "./Components/SongsTab";
import UsersTab from "./Components/UsersTab";
import ModerationTab from "./Components/ModerationTab";
import "./AdminPage.css";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("songs");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="admin-container">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />

            <main className="admin-main">
                <header className="admin-header">
                    <h1>{activeTab === "mod" ? "Song Moderation" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Management"}</h1>
                </header>

                <section className="admin-card">
                    {activeTab === "songs" && <SongsTab />}
                    {activeTab === "users" && <UsersTab />}
                    {activeTab === "mod" && <ModerationTab />}
                </section>
            </main>
        </div>
    );
};

export default AdminPage;