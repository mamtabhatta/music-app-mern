import React, { createContext, useState, useContext, useRef } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);

    
    const audioRef = useRef(new Audio());

    const playSong = (song, fullList = queue) => {
        if (song) {
            
            if (currentSong?.old_id !== song.old_id) {
                setCurrentSong(song);
                audioRef.current.src = song.audioUrl;
            }

            if (fullList !== queue) setQueue(fullList);

            const index = fullList.findIndex(s => s.old_id === song.old_id);
            setCurrentIndex(index);

            setIsPlaying(true);
            audioRef.current.play();
        }
    };

    const pauseSong = () => {
        setIsPlaying(false);
        audioRef.current.pause();
    };

    const nextSong = () => { 
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            playSong(queue[nextIndex]);
        }
    };

    const prevSong = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            playSong(queue[prevIndex]);
        }
    };

    return (
        <MusicContext.Provider value={{
            currentSong,
            isPlaying,
            playSong,
            pauseSong,
            nextSong,
            prevSong,
            audioRef,
            songs:queue
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);