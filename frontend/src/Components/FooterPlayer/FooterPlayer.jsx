import React, { useState, useEffect } from "react";
import {
    FaPlay,
    FaPause,
    FaStepForward,
    FaStepBackward,
    FaVolumeUp,
    FaRandom,
    FaRedo
} from "react-icons/fa";
import { useMusic } from "../../Context/MusicContext";
import "./FooterPlayer.css";

const FooterPlayer = () => {
    const { currentSong, isPlaying, playSong, pauseSong, nextSong, prevSong, audioRef } = useMusic();
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");

    useEffect(() => {
        const audio = audioRef.current;
        const updateProgress = () => {
            if (audio.duration) {
                const current = audio.currentTime;
                const total = audio.duration;
                setProgress((current / total) * 100);
                setCurrentTime(formatTime(current));
                setDuration(formatTime(total));
            }
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateProgress);
        audio.addEventListener("ended", nextSong);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateProgress);
            audio.removeEventListener("ended", nextSong);
        };
    }, [audioRef, currentSong, nextSong]);

    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const newTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = newTime;
        setProgress(e.target.value);
    };

    const handleVolumeChange = (e) => {
        const vol = e.target.value / 100;
        audioRef.current.volume = vol;
    };

    if (!currentSong) return null;

    return (
        <div className="footer-player">
            <div className="player-left">
                <img src={currentSong.imageUrl} alt={currentSong.title} className="song-img" />
                <div className="song-details">
                    <h4>{currentSong.title}</h4>
                    <p>{currentSong.artist}</p>
                </div>
            </div>

            <div className="player-center">
                <div className="controls">
                    <FaRandom className="control-icon" />
                    <FaStepBackward className="control-icon" onClick={prevSong} />
                    <div className="play-pause-wrapper" onClick={isPlaying ? pauseSong : () => playSong(currentSong)}>
                        {isPlaying ? <FaPause /> : <FaPlay className="play-icon-offset" />}
                    </div>
                    <FaStepForward className="control-icon" onClick={nextSong} />
                    <FaRedo className="control-icon" />
                </div>
                <div className="progress-container">
                    <span className="time">{currentTime}</span>
                    <input
                        type="range"
                        className="progress-bar"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                    />
                    <span className="time">{duration}</span>
                </div>
            </div>

            <div className="player-right">
                <FaVolumeUp className="control-icon" />
                <input
                    type="range"
                    className="volume-bar"
                    min="0"
                    max="100"
                    defaultValue="100"
                    onChange={handleVolumeChange}
                />
            </div>
        </div>
    );
};

export default FooterPlayer;