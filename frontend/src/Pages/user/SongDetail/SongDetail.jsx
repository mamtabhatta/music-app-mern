import React, { useState, useEffect, useCallback } from "react";
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

    const formatTime = (time) => {
        if (!time || isNaN(time) || time === Infinity) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const syncWithAudio = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const total = audio.duration;
        const current = audio.currentTime;

        if (total && !isNaN(total)) {
            setProgress((current / total) * 100);
            setCurrentTime(formatTime(current));
            setDuration(formatTime(total));
        }
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
        if (!audioRef.current || !audioRef.current.duration) return;
        const seekTime = (e.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = seekTime;
        setProgress(e.target.value);
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
                <div className="main-player-view">
                    <div className="cover-container">
                        <img src={currentSong.coverImageUrl || currentSong.imageUrl} alt={currentSong.title} />
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
                            <input type="range" className="progress-slider" value={progress} onChange={handleSeek} min="0" max="100" />
                            <div className="time-labels">
                                <span>{currentTime}</span>
                                <span>{duration === "0:00" ? "..." : duration}</span>
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