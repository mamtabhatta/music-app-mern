import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SongCard from "../../Components/Songcard/Songcard";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./Search.css";

const Search = ({ isReadOnly = false, externalQuery = "", onAddSong = null }) => {
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState("");
    const [searchParams] = useSearchParams();

    const query = isReadOnly ? externalQuery : searchParams.get("query") || "";

    useEffect(() => {
        if (!query.trim()) {
            setSongs([]);
            return;
        }

        const fetchSearch = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://localhost:5100/api/songs/search?query=${encodeURIComponent(query)}`,
                    { headers: { Authorization: token ? `Bearer ${token}` : "" } }
                );
                
                const normalized = response.data.map(song => ({
                    ...song,
                    _id: song._id || song.old_id,
                    coverImageUrl: song.coverImageUrl || song.imageUrl,
                    songUrl: song.songUrl || song.audioUrl,
                    artist: (typeof song.artist === 'string' && !/^[0-9a-fA-F]{24}$/.test(song.artist)) 
                        ? song.artist 
                        : (song.artistId?.name || "Unknown Artist")
                }));

                setSongs(normalized);
                setMessage(normalized.length === 0 ? "No songs found" : "");
            } catch (error) {
                setSongs([]);
                setMessage("Search failed");
            }
        };

        const debounce = setTimeout(fetchSearch, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const renderResults = () => (
        <div className="search-results-container">
            {message && <p className="search-message">{message}</p>}
            <div className="song-grid">
                {songs.map((song) => (
                    <div key={song._id} className="song-item-wrapper">
                        <SongCard song={song} list={songs} />
                        {onAddSong && (
                            <button 
                                className="add-to-playlist-btn"
                                onClick={() => onAddSong(song._id)}
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    if (isReadOnly) return renderResults();

    return (
        <div className="app-container">
            <Navbar />
            <div className="content-container">
                <Sidebar />
                <div className="search-main">
                    <h2 className="search-heading">Results for "{query}"</h2>
                    {renderResults()}
                </div>
            </div>
        </div>
    );
};

export default Search;