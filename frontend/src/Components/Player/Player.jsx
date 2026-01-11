import React from "react";
import "./Player.css";

const Player = ({ currentSong }) => {
    if (!currentSong) return null;

    return (
        <div className="spotify-player-container">
            <div className="player-song-info">
                <img src={currentSong.imageUrl} alt="cover" className="player-album-art" />
                <div className="player-text">
                    <p className="player-song-title">{currentSong.title}</p>
                    <p className="player-song-artist">{currentSong.artist}</p>
                </div>
            </div>

            <div className="player-controls-wrapper">
                <audio
                    key={currentSong.audioUrl}
                    src={currentSong.audioUrl}
                    controls
                    autoPlay
                    className="custom-audio-player"
                />
            </div>

            <div className="player-extra-controls">
                {/* Space for volume slider or other icons */}
            </div>
        </div>
    );
};

export default Player;