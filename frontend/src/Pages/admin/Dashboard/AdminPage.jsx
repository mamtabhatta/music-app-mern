import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import SongsTab from "./Components/SongsTab";
import UsersTab from "./Components/UsersTab";
import ModerationTab from "./Components/ModerationTab";
import Dashboard from "./Components/AdminDashboard"; 
import "./AdminPage.css";

const AdminPage = () => {
    // 1. Change default to "dashboard"
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Helper to format the header title
    const getHeaderTitle = () => {
        if (activeTab === "dashboard") return "Admin Overview";
        if (activeTab === "mod") return "Song Moderation";
        return activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Management";
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
                    <h1>{getHeaderTitle()}</h1>
                </header>

                <section className="admin-card">
                    {/* 2. Add the Dashboard to the list */}
                    {activeTab === "dashboard" && (
                        <Dashboard onNavigate={(tab) => setActiveTab(tab)} />
                    )}
                    
                    {activeTab === "songs" && <SongsTab />}
                    {activeTab === "users" && <UsersTab />}
                    {activeTab === "mod" && <ModerationTab />}
                </section>
            </main>
        </div>
    );
};

export default AdminPage;