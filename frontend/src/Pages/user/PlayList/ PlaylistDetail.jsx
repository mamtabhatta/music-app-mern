import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlay, FaTrash, FaPlus, FaMusic, FaClock } from "react-icons/fa";
import {
    getPlaylistById,
    removeSongFromPlaylist,
    addSongToPlaylist
} from "../../../api/playlistApi";
import { useMusic } from "../../../Context/MusicContext";
import "./PlaylistDetail.css";

const PlaylistDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playSong } = useMusic();

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    const loadPlaylist = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const { data } = await getPlaylistById(id, token);
            setPlaylist(data);
        } catch (error) {
            console.error("Error fetching playlist:", error);
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        loadPlaylist();
    }, [loadPlaylist]);

    const handleRemoveSong = async (e, songId) => {
        e.stopPropagation();
        if (!window.confirm("Remove this song from playlist?")) return;

        try {
            await removeSongFromPlaylist(id, songId, token);
            // Optimistic Update: Update UI before reloading
            setPlaylist(prev => ({
                ...prev,
                songIds: prev.songIds.filter(song => (song._id || song.id) !== songId)
            }));
        } catch (error) {
            console.error("Remove failed", error);
            alert("Failed to remove song");
        }
    };

    const handleAddSong = async () => {
        const songId = prompt("Enter Song ID to add:");
        if (!songId) return;
        try {
            await addSongToPlaylist(id, songId, token);
            loadPlaylist(); // Refresh to get full song details
        } catch (error) {
            alert("Error adding song. Ensure ID is correct.");
        }
    };

    if (loading) return <div className="loading-state">Loading Playlist...</div>;
    if (!playlist) return <div className="error-state">Playlist not found</div>;

    return (
        <div className="playlist-detail-container">
            {/* Header Section */}
            <header className="playlist-header">
                <div className="playlist-cover-large">
                    {playlist.coverImage ? (
                        <img src={playlist.coverImage} alt={playlist.title} />
                    ) : (
                        <FaMusic className="default-icon-lg" />
                    )}
                </div>
                <div className="playlist-header-info">
                    <span className="type-label">Playlist</span>
                    <h1 className="playlist-title-main">{playlist.title}</h1>
                    <p className="playlist-desc">{playlist.description || "No description provided."}</p>
                    <div className="playlist-stats">
                        <strong>TuneHub User</strong> • {playlist.songIds?.length || 0} songs
                    </div>
                </div>
            </header>

            {/* Controls Bar */}
            <div className="playlist-action-bar">
                <button className="play-playlist-btn" onClick={() => playlist.songIds[0] && playSong(playlist.songIds[0])}>
                    <FaPlay />
                </button>
                <button className="add-song-inline" onClick={handleAddSong}>
                    <FaPlus /> Add Song
                </button>
            </div>

            {/* Song Table */}
            <div className="songs-table">
                <div className="table-header">
                    <span className="col-idx">#</span>
                    <span className="col-title">Title</span>
                    <span className="col-album">Artist</span>
                    <span className="col-time"><FaClock /></span>
                    <span className="col-action"></span>
                </div>

                <hr className="divider-line" />

                <div className="songs-list">
                    {playlist.songIds?.length === 0 ? (
                        <p className="empty-msg">No songs in this playlist yet.</p>
                    ) : (
                        playlist.songIds.map((song, index) => (
                            <div key={song._id || song.id} className="song-row" onClick={() => playSong(song)}>
                                <span className="col-idx">{index + 1}</span>
                                <div className="col-title-info">
                                    <img src={song.imageUrl} alt="" className="row-img" />
                                    <span>{song.title}</span>
                                </div>
                                <span className="col-album">{song.artist}</span>
                                <span className="col-time">3:45</span>
                                <span className="col-action">
                                    <button
                                        className="row-delete-btn"
                                        onClick={(e) => handleRemoveSong(e, song._id || song.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;