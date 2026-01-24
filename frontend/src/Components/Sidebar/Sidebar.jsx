import React, { useEffect, useState } from "react";
import { FiSearch, FiPlus, FiMusic, FiTrash2 } from "react-icons/fi";
import { FaChevronLeft, FaHeart } from "react-icons/fa"; // Added FaHeart
import { useNavigate } from "react-router-dom";
import { createPlaylist, deletePlaylist } from "../../api/playlistApi";
import { useMusic } from "../../Context/MusicContext";
import "./Sidebar.css";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [search, setSearch] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    
    // likedSongs added to destructuring
    const { playlists, setPlaylists, fetchUserPlaylists, likedSongs } = useMusic();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUserPlaylists();
    }, []);

    const handleCreateClick = () => {
        if (collapsed) setCollapsed(false);
        setIsCreating(true);
    };

    const submitNewPlaylist = async (e) => {
        if (e.key === "Enter" && newTitle.trim() !== "") {
            try {
                const { data } = await createPlaylist(newTitle, token);
                setPlaylists([...playlists, data]);
                setNewTitle("");
                setIsCreating(false);
                navigate(`/playlist/${data._id || data.id}`);
            } catch (error) {
                console.error(error);
            }
        } else if (e.key === "Escape") {
            setIsCreating(false);
            setNewTitle("");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await deletePlaylist(id, token);
            setPlaylists(playlists.filter((p) => (p._id || p.id) !== id));
        } catch (error) {
            console.error(error);
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
                    <button className="plus-btn" onClick={handleCreateClick}>
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
                {/* Liked Songs Static Item */}
                <li className="playlist-item liked-item" onClick={() => navigate("/liked-songs")}>
                    <div className="playlist-img-sm liked-gradient">
                        <FaHeart color="white" size={12} />
                    </div>
                    {!collapsed && (
                        <div className="playlist-info-sm">
                            <span className="p-name">Liked Songs</span>
                            <span className="p-sub">Playlist • {likedSongs?.length || 0} songs</span>
                        </div>
                    )}
                </li>

                {isCreating && !collapsed && (
                    <li className="playlist-item creating">
                        <div className="playlist-img-sm"><FiMusic /></div>
                        <input
                            autoFocus
                            className="inline-create-input"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={submitNewPlaylist}
                            onBlur={() => { if(!newTitle) setIsCreating(false); }}
                            placeholder="Playlist Name..."
                        />
                    </li>
                )}

                {filteredPlaylists.map((playlist) => (
                    <li
                        key={playlist._id || playlist.id}
                        className="playlist-item"
                        onClick={() => navigate(`/playlist/${playlist._id || playlist.id}`)}
                    >
                        <div className="playlist-img-sm"><FiMusic /></div>
                        {!collapsed && (
                            <>
                                <div className="playlist-info-sm">
                                    <span className="p-name">{playlist.title}</span>
                                    <span className="p-sub">Playlist • {playlist.songIds?.length || playlist.songs?.length || 0} songs</span>
                                </div>
                                <button className="delete-btn-sidebar" onClick={(e) => handleDelete(e, playlist._id || playlist.id)}>
                                    <FiTrash2 />
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;