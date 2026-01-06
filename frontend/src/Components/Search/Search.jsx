import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../../Lib/SupabaseClient";
import SongCard from "../../Components/Songcard/Songcard";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./Search.css";

const Search = () => {
    const [songs, setSongs] = useState([]);
    const [message, setMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query") || "";

    useEffect(() => {
        if (!query.trim()) {
            setSongs([]);
            setMessage("Please enter a song, artist, or genre");
            return;
        }

        const fetchSearch = async () => {
            const { data, error } = await supabase
                .from("songs")
                .select("*")
                .or(`title.ilike.%${query}%,artist.ilike.%${query}%,genre.ilike.%${query}%`)
                .eq("approved", true);

            if (error) {
                console.error(error);
                setMessage("Failed to fetch songs");
                setSongs([]);
            } else if (!data.length) {
                setMessage("No songs found");
                setSongs([]);
            } else {
                setSongs(data);
                setMessage("");
            }
        };

        fetchSearch();
    }, [query]);

    return (
        <div className="app-container">
            <Navbar />
            <div className="content-container">
                <Sidebar onToggle={(open) => setSidebarOpen(open)} />
                <div className={`search-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
                    <h2 className="search-heading">Search Results for "{query}"</h2>
                    {message && <p className="search-message">{message}</p>}
                    <div className="song-grid">
                        {songs.map((song) => (
                            <SongCard
                                key={song.id}
                                song={song} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;