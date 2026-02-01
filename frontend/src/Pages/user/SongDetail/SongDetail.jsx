import React, { useState, useEffect, useCallback } from "react";
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaHeart, FaRandom, FaRedo,
    FaChevronDown, FaEllipsisH
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../../../Context/MusicContext";
import UpNextList from "../../../Components/Upnext/UpNextList";
import "./SongDetail.css";

const SongDetail = () => {
    const {
        currentSong, isPlaying, playSong, pauseSong, nextSong, prevSong,
        audioRef, songs = [], likedSongs, toggleLike
    } = useMusic();
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const navigate = useNavigate();

    const isLiked = likedSongs.some(s => (s._id || s.id) === (currentSong?._id || currentSong?.id));

    const formatTime = (time) => {
        if (!time || isNaN(time) || time === Infinity) return "0:00";
        const roundedTime = Math.floor(time);
        const mins = Math.floor(roundedTime / 60);
        const secs = roundedTime % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const updateSliderColor = (val) => {
        const slider = document.querySelector('.progress-slider');
        if (slider) {
            slider.style.setProperty('--progress-percent', `${val}%`);
        }
    };

    const syncWithAudio = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const cur = audio.currentTime || 0;
        const dur = audio.duration || 0;
        const val = dur > 0 ? (cur / dur) * 100 : 0;
        
        setProgress(val);
        setCurrentTime(formatTime(cur));
        updateSliderColor(val);
    }, [audioRef]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.addEventListener("timeupdate", syncWithAudio);
        audio.addEventListener("loadedmetadata", syncWithAudio);
        audio.addEventListener("durationchange", syncWithAudio);
        audio.addEventListener("ended", nextSong);
        if (audio.readyState >= 1) syncWithAudio();
        return () => {
            audio.removeEventListener("timeupdate", syncWithAudio);
            audio.removeEventListener("loadedmetadata", syncWithAudio);
            audio.removeEventListener("durationchange", syncWithAudio);
            audio.removeEventListener("ended", nextSong);
        };
    }, [audioRef, currentSong, nextSong, syncWithAudio]);

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio || !audio.duration) return;
        const val = parseFloat(e.target.value);
        audio.currentTime = (val / 100) * audio.duration;
        setProgress(val);
        updateSliderColor(val);
    };

    if (!currentSong) return null;

    return (
        <div className="music-detail-page">
            <div className="header-nav">
                <button className="nav-btn" onClick={() => navigate(-1)}><FaChevronDown /></button>
                <div className="playing-from">
                    <p>NOW PLAYING</p>
                    <span>{currentSong.artist} Radio</span>
                </div>
                <button className="nav-btn"><FaEllipsisH /></button>
            </div>

            <div className="content-wrapper">
                <div className="main-player-view">
                    <div className="cover-container">
                        <div className="glass-overlay"></div>
                        <img src={currentSong.coverImageUrl || currentSong.imageUrl} alt={currentSong.title} />
                    </div>

                    <div className="song-info-container">
                        <div className="title-block">
                            <h1>{currentSong.title}</h1>
                            <h2>{currentSong.artist}</h2>
                        </div>
                        <div className="header-actions">
                            <FaHeart
                                className={`heart-icon ${isLiked ? "active" : ""}`}
                                onClick={() => toggleLike(currentSong)}
                            />
                        </div>
                    </div>

                    <div className="controls-section">
                        <div className="visualizer">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className={`bar ${isPlaying ? "animating" : ""}`} />
                            ))}
                        </div>
                        <div className="slider-box">
                            <input 
                                type="range" 
                                className="progress-slider" 
                                value={progress} 
                                onChange={handleSeek} 
                                min="0" 
                                max="100" 
                                step="0.1"
                            />
                            <div className="time-labels">
                                <span>{currentTime}</span>
                            </div>
                        </div>

                        <div className="main-btns">
                            <FaRandom className="secondary-icon" />
                            <FaStepBackward className="skip-icon" onClick={prevSong} />
                            <button className="main-play-pause" onClick={() => isPlaying ? pauseSong() : playSong(currentSong)}>
                                {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: "4px" }} />}
                            </button>
                            <FaStepForward className="skip-icon" onClick={nextSong} />
                            <FaRedo className="secondary-icon" />
                        </div>
                    </div>
                </div>

                <div className="queue-panel">
                    <UpNextList songs={songs} currentSong={currentSong} playSong={playSong} />
                </div>
            </div>
        </div>
    );
};

export default SongDetail;