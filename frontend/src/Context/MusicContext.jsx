import React, { createContext, useState, useContext, useRef } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);

    // Create the audio reference that FooterPlayer needs
    const audioRef = useRef(new Audio());

    const playSong = (song, fullList = queue) => {
        if (song) {
            // If it's a new song, update the source
            if (currentSong?.old_id !== song.old_id) {
                setCurrentSong(song);
                audioRef.current.src = song.audioUrl; // Make sure your song object has this
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

    const nextSong = () => { // Renamed from playNext to match Footer
        if (currentIndex < queue.length - 1) {
            const nextIndex = currentIndex + 1;
            playSong(queue[nextIndex]);
        }
    };

    const prevSong = () => { // Renamed from playPrev to match Footer
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
            audioRef
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);