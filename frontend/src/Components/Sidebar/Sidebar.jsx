import React, { useEffect, useState } from "react";
import { FiSearch, FiPlus, FiMusic } from "react-icons/fi";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchMyPlaylists, createPlaylist } from "../../api/playlistApi";
import "./Sidebar.css";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        loadPlaylists();
    }, []);

    const loadPlaylists = async () => {
        if (!token) return;
        try {
            const { data } = await fetchMyPlaylists(token);
            setPlaylists(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    const handleCreate = async () => {
        const title = prompt("Enter Playlist Name:");
        if (!title) return;
        try {
            const { data } = await createPlaylist(title, token);
            setPlaylists([...playlists, data]);
            navigate(`/playlist/${data._id}`);
        } catch (error) {
            alert("Failed to create playlist");
        }
    };

    const filteredPlaylists = playlists.filter((p) => {
        const searchTerm = search.toLowerCase();
        const playlistTitle = (p.title || "").toLowerCase();
        return playlistTitle.includes(searchTerm);
    });

    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
            <div className="library-header">
                <div className="lib-left" onClick={() => setCollapsed(!collapsed)}>
                    <div className={`lib-icon-stack ${collapsed ? "active" : ""}`}>
                        <FaChevronLeft className="toggle-chevron" />
                    </div>
                    {!collapsed && <span>Your Library</span>}
                </div>
                {!collapsed && (
                    <button className="plus-btn" onClick={handleCreate}>
                        <FiPlus />
                    </button>
                )}
            </div>

            {!collapsed && (
                <div className="search-box-sidebar">
                    <FiSearch className="s-icon" />
                    <input
                        type="text"
                        placeholder="Search in Your Library"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}

            <ul className="playlist-list">
                {filteredPlaylists.length > 0 ? (
                    filteredPlaylists.map((playlist) => (
                        <li
                            key={playlist._id || playlist.id}
                            className="playlist-item"
                            onClick={() => navigate(`/playlist/${playlist._id || playlist.id}`)}
                        >
                            <div className="playlist-img-sm">
                                <FiMusic />
                            </div>
                            {!collapsed && (
                                <div className="playlist-info-sm">
                                    <span className="p-name">{playlist.title}</span>
                                    <span className="p-sub">Playlist • {playlist.songIds?.length || 0} songs</span>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    !collapsed && <li className="no-results">No playlists found</li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;