import React from "react";
import { useMusic } from "../../../Context/MusicContext";
import { FaHeart, FaPlay, FaPause, FaTrashAlt } from "react-icons/fa";
import Navbar from "../../../Components/Navbar/Navbar";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import "./LikedSongs.css";

const LikedSongs = () => {
    const { likedSongs, playSong, pauseSong, currentSong, isPlaying, toggleLike } = useMusic();

    const handlePlayAll = () => {
        if (likedSongs.length > 0) {
            const isCurrentInLiked = likedSongs.some(s => (s._id || s.id) === (currentSong?._id || currentSong?.id));
            if (isCurrentInLiked && isPlaying) {
                pauseSong();
            } else {
                playSong(likedSongs[0], likedSongs);
            }
        }
    };

    return (
        <div className="liked-page-layout">
            <Navbar />
            
            <div className="liked-content-wrapper">
                <Sidebar />
                
                <div className="liked-main-view">
                    <div className="liked-view-container">
                        <header className="liked-hero">
                            <div className="hero-glow-purple"></div>
                            <div className="liked-artwork-container">
                                <FaHeart size={70} className="floating-heart" />
                            </div>
                            <div className="liked-header-content">
                                <span className="liked-breadcrumb">Playlist</span>
                                <h1 className="liked-title">Liked Songs</h1>
                                <div className="liked-stats">
                                    <span>{likedSongs.length} songs</span>
                                </div>
                            </div>
                        </header>

                        <div className="liked-list-section">
                            <div className="liked-controls">
                                <button className="play-all-trigger" onClick={handlePlayAll}>
                                    {isPlaying && likedSongs.some(s => (s._id || s.id) === (currentSong?._id || currentSong?.id)) 
                                        ? <FaPause /> 
                                        : <FaPlay style={{ marginLeft: "4px" }} />}
                                </button>
                            </div>

                            <table className="playlist-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Title</th>
                                        <th style={{ width: "100px" }}>Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {likedSongs.map((song, index) => {
                                        const isThisPlaying = (currentSong?._id || currentSong?.id) === (song._id || song.id);
                                        return (
                                            <tr key={song._id || song.id} className="song-row" onClick={() => playSong(song, likedSongs)}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="song-content-fix">
                                                        <img src={song.imageUrl || song.coverImageUrl} alt="" className="table-thumb" />
                                                        <div>
                                                            <p className={`song-title ${isThisPlaying ? "active-track-name" : ""}`}>{song.title}</p>
                                                            <p style={{ margin: 0, fontSize: "12px", opacity: 0.6 }}>{song.artist}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button className="trash-btn" onClick={(e) => { e.stopPropagation(); toggleLike(song); }}>
                                                        <FaTrashAlt />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LikedSongs;