import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FaMusic } from "react-icons/fa";
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
            setPlaylistSongs(data.songs || data.songIds || []);
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
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;