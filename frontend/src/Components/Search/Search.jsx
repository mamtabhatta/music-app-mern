import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../Lib/SupabaseClient";
import SongCard from "../../Components/Songcard/Songcard";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./Search.css";

const Search = ({ isReadOnly = false, externalQuery = "", onAddSong = null }) => {
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchParams] = useSearchParams();

    const query = isReadOnly ? externalQuery : searchParams.get("query") || "";

    useEffect(() => {
        if (!query.trim()) {
            setSongs([]);
            // setMessage("Please enter a song, artist, or genre");
            return;
        }

        const fetchSearch = async () => {
            const { data, error } = await supabase
                .from("songs")
                .select("*")
                .or(`title.ilike.%${query}%,artist.ilike.%${query}%,genre.ilike.%${query}%`)
                .eq("approved", true);

            if (error || !data?.length) {
                setSongs([]);
                setMessage("No songs found");
            } else {
                setSongs(data);
                setMessage("");
            }
        };

        const debounce = setTimeout(fetchSearch, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const renderContent = () => (
        <div className="search-results-container">
            {message && <p className="search-message">{message}</p>}
            <div className="song-grid">
                {songs.map((song, index) => (
                    <div
                        key={song.id ?? `${song.title}-${song.artist}-${index}`}
                        className="song-item-wrapper"
                    >
                        <SongCard song={song} />
                        {onAddSong && (
                            <button
                                className="add-to-playlist-btn"
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    //'id' is null in your object, we MUST use 'old_id'
                                    const songIdentifier = song.old_id || song.id;

                                    if (!songIdentifier) {
                                        console.error("No ID found for song:", song);
                                        return;
                                    }

                                    console.log("Adding song with ID:", songIdentifier);
                                    onAddSong(songIdentifier);
                                }}
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    if (isReadOnly) return renderContent();

    return (
        <div className="app-container">
            <Navbar />
            <div className="content-container">
                <Sidebar onToggle={(open) => setSidebarOpen(open)} />
                <div className={`search-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                    <h2 className="search-heading">Search Results for "{query}"</h2>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Search;
