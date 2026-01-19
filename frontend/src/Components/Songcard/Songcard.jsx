import React from "react";
import { useNavigate } from "react-router-dom";
import "./Songcard.css";
import { useMusic } from "../../Context/MusicContext";

const SongCard = ({ song, list = [] }) => {
    const { playSong, pauseSong, currentSong, isPlaying } = useMusic();
    const navigate = useNavigate();

    const isThisSongPlaying = isPlaying && currentSong?.id === song.id;

    const handleCardClick = () => {
        playSong(song, list);
        navigate("/song");
    };

    const handleTogglePlay = (e) => {
        e.stopPropagation();
        if (isThisSongPlaying) {
            pauseSong();
        } else {
            playSong(song, list);
        }
    };

    return (
        <div className="song-card" onClick={handleCardClick}>
            <div className="song-cover">
                <img src={song.imageUrl || song.coverImageUrl} alt={song.title} />
                <div className="overlay">
                    <button className="play-btn" onClick={handleTogglePlay}>
                        {isThisSongPlaying ? "❚❚" : "▶"}
                    </button>
                </div>
            </div>
            <div className="song-info">
                <p className="song-title">{song.title}</p>
                <p className="song-artist">{song.artist || "Unknown Artist"}</p>
            </div>
        </div>
    );
};

export default SongCard;