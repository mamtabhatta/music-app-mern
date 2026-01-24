import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { fetchMyPlaylists } from "../api/playlistApi";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    
    const [likedSongs, setLikedSongs] = useState(() => {
        const saved = localStorage.getItem("likedSongs");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    }, [likedSongs]);

    const audioRef = useRef(new Audio());

    const toggleLike = (song) => {
        if (!song) return;
        setLikedSongs((prev) => {
            const isLiked = prev.some((s) => (s._id || s.id) === (song._id || song.id));
            if (isLiked) {
                return prev.filter((s) => (s._id || s.id) !== (song._id || song.id));
            } else {
                return [...prev, song];
            }
        });
    };

    const fetchUserPlaylists = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const { data } = await fetchMyPlaylists(token);
            setPlaylists(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        }
    };

    const playSong = (song, fullList = queue) => {
        if (!song) return;
        const songId = song._id || song.id;
        const currentSongId = currentSong?._id || currentSong?.id;
        if (currentSongId !== songId) {
            setCurrentSong(song);
            const audioSource = song.songUrl || song.audioUrl;
            audioRef.current.src = audioSource;
            audioRef.current.load();
        }
        if (fullList !== queue) setQueue(fullList);
        const index = fullList.findIndex(s => (s._id || s.id) === songId);
        setCurrentIndex(index);
        setIsPlaying(true);
        audioRef.current.play().catch(err => console.error(err));
    };

    const pauseSong = () => {
        setIsPlaying(false);
        audioRef.current.pause();
    };

    const nextSong = () => {
        if (currentIndex < queue.length - 1) playSong(queue[currentIndex + 1], queue);
    };

    const prevSong = () => {
        if (currentIndex > 0) playSong(queue[currentIndex - 1], queue);
    };

    return (
        <MusicContext.Provider value={{
            currentSong, isPlaying, playSong, pauseSong, nextSong, prevSong,
            audioRef, songs: queue, playlists, setPlaylists, fetchUserPlaylists,
            likedSongs, toggleLike
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);