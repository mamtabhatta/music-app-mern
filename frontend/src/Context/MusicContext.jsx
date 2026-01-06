import { createContext, useState, useRef, useContext } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(new Audio());

    const playSong = (song) => {
        
        if (!currentSong || currentSong.id !== song.id) {
            setCurrentSong(song);
            audioRef.current.src = song.audioUrl;
        }
        audioRef.current.play();
        setIsPlaying(true);
    };

    const pauseSong = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    };

    return (
        <MusicContext.Provider value={{ currentSong, isPlaying, playSong, pauseSong, audioRef }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);