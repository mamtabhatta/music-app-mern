import React from "react";
import { Music, Users, LogOut, ShieldCheck, ListMusic } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <ShieldCheck className="icon-gold" />
                <span>Admin Panel</span>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={activeTab === "songs" ? "active" : ""}
                    onClick={() => setActiveTab("songs")}
                >
                    <Music size={20} /> Pending Songs
                </button>
                <button
                    className={activeTab === "mod" ? "active" : ""}
                    onClick={() => setActiveTab("mod")}
                >
                    <ListMusic size={20} /> All Songs
                </button>
                <button
                    className={activeTab === "users" ? "active" : ""}
                    onClick={() => setActiveTab("users")}
                >
                    <Users size={20} /> Users
                </button>
            </nav>

            <button className="btn-logout" onClick={onLogout}>
                <LogOut size={20} /> Logout
            </button>
        </aside>
    );
};

export default Sidebar;