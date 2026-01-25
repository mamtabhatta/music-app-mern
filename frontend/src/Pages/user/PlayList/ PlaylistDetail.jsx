import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaMusic, FaPlus } from "react-icons/fa";
import { getPlaylistById, addSongToPlaylist, removeSongFromPlaylist } from "../../../api/playlistApi";
import { useMusic } from "../../../Context/MusicContext";
import Search from "../../../Components/Search/Search";
import Navbar from "../../../Components/Navbar/Navbar";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import "./PlaylistDetail.css";

const PlaylistDetail = () => {
    const { id } = useParams();
    const { playSong, fetchUserPlaylists } = useMusic();
    const [playlist, setPlaylist] = useState(null);
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    const fetchPlaylistData = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!id || !token) return;
        setLoading(true);
        try {
            const res = await getPlaylistById(id, token);
            const data = res.data;
            setPlaylist(data);
            setIsOwner(data.isOwner);
            const currentSongs = data.songs || data.songIds || [];
            setPlaylistSongs(currentSongs);
            
            const songsRes = await axios.get("http://localhost:5100/api/songs");
            const allSongs = songsRes.data;
            const existingIds = new Set(currentSongs.map(s => s._id || s.id));
            const recs = allSongs.filter(s => !existingIds.has(s._id || s.id)).slice(3,10);
            setRecommendedSongs(recs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPlaylistData();
    }, [fetchPlaylistData]);

    const handleAddSong = async (songId) => {
        const token = localStorage.getItem("token");
        try {
            await addSongToPlaylist(id, songId, token);
            await fetchPlaylistData();
            if (fetchUserPlaylists) {
                await fetchUserPlaylists();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveSong = async (songId) => {
        const token = localStorage.getItem("token");
        try {
            await removeSongFromPlaylist(id, songId, token);
            await fetchPlaylistData();
            if (fetchUserPlaylists) {
                await fetchUserPlaylists();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading && !playlist) return <div className="loading-container">Loading...</div>;
    if (!playlist) return <div className="error-container">Playlist not found.</div>;

    return (
        <div className="app-container">
            <Navbar />
            <div className="content-container">
                <Sidebar />
                <div className="playlist-detail-main">
                    <div className="playlist-header">
                        <div className="playlist-cover">
                            <FaMusic className="default-cover-icon" />
                        </div>
                        <div className="header-text">
                            <span className="playlist-badge">PLAYLIST</span>
                            <h1>{playlist.title}</h1>
                            <p>{playlist.description}</p>
                        </div>
                    </div>
                    {isOwner && (
                        <div className="search-area">
                            <h3>Add to this playlist</h3>
                            <input 
                                type="text" 
                                placeholder="Search for songs..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <Search 
                                isReadOnly={true} 
                                externalQuery={searchTerm} 
                                onAddSong={handleAddSong} 
                            />
                        </div>
                    )}
                    <table className="playlist-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Artist</th>
                                {isOwner && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {playlistSongs.length > 0 ? (
                                playlistSongs.map((song, index) => (
                                    <tr key={song._id || index} className="song-row">
                                        <td>{index + 1}</td>
                                        <td onClick={() => playSong(song, playlistSongs)} style={{ cursor: 'pointer' }}>
                                            <div className="song-content-fix">
                                                <img 
                                                    src={song.coverImageUrl || song.imageUrl || "https://via.placeholder.com/50"} 
                                                    alt="" 
                                                    className="table-thumb" 
                                                />
                                                <span className="song-title">{song.title}</span>
                                            </div>
                                        </td>
                                        <td>{song.artist || "Unknown Artist"}</td>
                                        {isOwner && (
                                            <td>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => handleRemoveSong(song._id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isOwner ? 4 : 3} style={{ textAlign: "center", padding: "20px" }}>
                                        No songs in this playlist.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {isOwner && recommendedSongs.length > 0 && (
                        <div className="recommended-section">
                            <h3>Recommended Songs</h3>
                            <p className="rec-subtitle">Based on what's in this playlist</p>
                            <div className="rec-list">
                                {recommendedSongs.map((song) => (
                                    <div 
                                        key={song._id} 
                                        className="rec-item"
                                        onClick={() => playSong(song, recommendedSongs)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="rec-info">
                                            <img src={song.imageUrl || song.coverImageUrl} alt="" />
                                            <div>
                                                <p className="rec-title">{song.title}</p>
                                                <p className="rec-artist">{song.artist}</p>
                                            </div>
                                        </div>
                                        <button 
                                            className="rec-add-btn" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddSong(song._id);
                                            }}
                                        >
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;