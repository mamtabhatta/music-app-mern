import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FaMusic } from "react-icons/fa";
import { supabase } from "../../../Lib/SupabaseClient";
import { getPlaylistById, addSongToPlaylist, removeSongFromPlaylist } from "../../../api/playlistApi";
import { useMusic } from "../../../Context/MusicContext";
import Search from "../../../Components/Search/Search";
import Navbar from "../../../Components/Navbar/Navbar";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import "./PlaylistDetail.css";

const PlaylistDetail = () => {
    const { id } = useParams();
    const { playSong } = useMusic();
    const [playlist, setPlaylist] = useState(null);
    const [playlistSongs, setPlaylistSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchPlaylistData = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!id || !token) return;

        setLoading(true);

        try {
            const res = await getPlaylistById(id, token);
            setPlaylist(res.data);

            if (res.data.songIds && res.data.songIds.length > 0) {
                const { data, error } = await supabase
                    .from("songs")
                    .select("*")
                    .in("old_id", res.data.songIds);

                if (!error && data) {
                    const songMap = new Map(data.map(s => [String(s.old_id), s]));
                    const ordered = res.data.songIds
                        .map(sId => songMap.get(String(sId)))
                        .filter(Boolean);
                    setPlaylistSongs(ordered);
                }
            } else {
                setPlaylistSongs([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setPlaylistSongs([]);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        setPlaylist(null);
        setPlaylistSongs([]);
        setSearchTerm("");
        fetchPlaylistData();
    }, [id, fetchPlaylistData]);

    if (loading && !playlist) return <div className="loading-container">Loading...</div>;
    if (!playlist && !loading) return <div className="error-container">Playlist not found.</div>;

    return (
        <div className="app-container">
            <Navbar />
            <div className="content-container">
                <Sidebar />
                <div className="playlist-detail-main" key={id}>
                    <div className="playlist-header">
                        <div className="playlist-cover">
                            <FaMusic className="default-cover-icon" />
                        </div>
                        <div className="header-text">
                            <span className="playlist-badge">PLAYLIST</span>
                            <h1>{playlist?.title || "Loading..."}</h1>
                            <p>{playlist?.description}</p>
                        </div>
                    </div>

                    <div className="search-area">
                        <h3>Add to this playlist</h3>
                        <input
                            type="text"
                            placeholder="Search for songs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search
                            isReadOnly={true}
                            externalQuery={searchTerm}
                            onAddSong={(sId) => addSongToPlaylist(id, sId, localStorage.getItem("token")).then(() => fetchPlaylistData())}
                        />
                    </div>

                    <table className="playlist-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playlistSongs.map((song, index) => (
                                <tr key={`${id}-${song.old_id}`} className="song-row">
                                    <td>{index + 1}</td>
                                    <td onClick={() => playSong(song, playlistSongs)} style={{ cursor: 'pointer' }}>
                                        <div className="song-content-fix">
                                            <img src={song.imageUrl} alt="" className="table-thumb" />
                                            <span className="song-title">{song.title}</span>
                                        </div>
                                    </td>
                                    <td>{song.artist}</td>
                                    <td>
                                        <button onClick={() => removeSongFromPlaylist(id, song.old_id, localStorage.getItem("token")).then(() => fetchPlaylistData())}>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;