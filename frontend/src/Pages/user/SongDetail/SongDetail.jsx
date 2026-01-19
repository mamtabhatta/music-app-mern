import React, { useState, useEffect } from "react";
import {
    FaPlay, FaPause, FaStepForward, FaStepBackward,
    FaHeart, FaMinusCircle, FaRandom, FaRedo,
    FaChevronDown, FaEllipsisH
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../../../Context/MusicContext";
import UpNextList from "../../../Components/Upnext/UpNextList";
import "./SongDetail.css";

const SongDetail = () => {
    const { currentSong, isPlaying, playSong, pauseSong, nextSong, prevSong, audioRef, songs = [] } = useMusic();
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [duration, setDuration] = useState("0:00");
    const navigate = useNavigate();

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
        return () => audio.removeEventListener("timeupdate", updateProgress);
    }, [audioRef, currentSong]);

    const formatTime = (time) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    const handleSeek = (e) => {
        const seekTime = (e.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
    };

    if (!currentSong) return null;

    return (
        <div className="music-detail-page">
            <div className="header-nav">
                <button className="nav-btn" onClick={() => navigate(-1)}><FaChevronDown /></button>
                <div className="playing-from">
                    <p>PLAYING FROM PLAYLIST</p>
                    <span>{currentSong.artist} Radio</span>
                </div>
                <button className="nav-btn"><FaEllipsisH /></button>
            </div>

            <div className="content-wrapper">
                {/* LEFT SIDE: PLAYER */}
                <div className="main-player-view">
                    <div className="cover-container">
                        <img src={currentSong.imageUrl} alt={currentSong.title} />
                    </div>

                    <div className="song-info-container">
                        <div className="title-block">
                            <h1>{currentSong.title}</h1>
                            <h2>{currentSong.artist}</h2>
                        </div>
                        <div className="header-actions">
                            <FaMinusCircle className="minus-icon" />
                            <FaHeart className="heart-icon active" />
                        </div>
                    </div>

                    <div className="controls-section">
                        <div className="slider-box">
                            <input type="range" className="progress-slider" value={progress} onChange={handleSeek} />
                            <div className="time-labels">
                                <span>{currentTime}</span>
                                <span>{duration}</span>
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

                {/* RIGHT SIDE: UP NEXT */}
                <div className="queue-panel">
                    <UpNextList songs={songs} currentSong={currentSong} playSong={playSong} />
                </div>
            </div>
        </div>
    );
};

export default SongDetail;