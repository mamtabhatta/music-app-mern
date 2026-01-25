import React, { useState, useEffect } from 'react';
import { CheckCircle, Trash2, Play, Pause, Music } from 'lucide-react';
import { useMusic } from '../../../../Context/MusicContext';

const SongsTab = () => {
    const { playSong, currentSong, isPlaying, pauseSong } = useMusic();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const res = await fetch('http://localhost:5100/api/admin/songs/pending', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setSongs(data.pendingSongs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlayPause = (song) => {
        if (currentSong?._id === song._id && isPlaying) {
            pauseSong();
        } else {
            playSong(song, songs);
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await fetch(`http://localhost:5100/api/admin/song/approve/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) fetchSongs();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this song?")) return;
        try {
            const res = await fetch(`http://localhost:5100/api/admin/song/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) fetchSongs();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="loading-state">Loading...</div>;
    if (songs.length === 0) return <div className="empty-msg"><Music size={40} /><p>No pending songs.</p></div>;

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th className="col-number">#</th>
                    <th className="col-song">SONG</th>
                    <th className="col-artist">ARTIST</th>
                    <th className="col-user">UPLOADED BY</th>
                    <th className="col-preview">PREVIEW</th>
                    <th className="col-actions">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {songs.map((song, index) => {
                    const isSelected = currentSong?._id === song._id;
                    return (
                        <tr key={song._id}>
                            <td className="col-number">{index + 1}</td>
                            <td className="col-song">
                                <div className="song-cell">
                                    <img
                                        src={song.coverImageUrl || song.imageUrl || "https://www.freeiconspng.com/uploads/music-icon-0.png"}
                                        className="mini-cover"
                                        alt=""
                                    />
                                    <span className="song-title-text">{song.title}</span>
                                </div>
                            </td>
                            <td className="col-artist">
                                <span className="artist-text">{song.artist || "Unknown Artist"}</span>
                            </td>
                            <td className="col-user">
                                <span className="uploader-text">
                                    {song.artistId?.name || "Unknown User"}
                                </span>
                            </td>
                            <td className="col-preview">
                                <button className="play-btn" onClick={() => handlePlayPause(song)}>
                                    {isSelected && isPlaying ? (
                                        <Pause size={20} fill="currentColor" />
                                    ) : (
                                        <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
                                    )}
                                </button>
                            </td>
                            <td className="col-actions">
                                <div className="actions-wrapper">
                                    <button className="btn-approve" onClick={() => handleApprove(song._id)}>
                                        <CheckCircle size={16} /> <span>Approve</span>
                                    </button>
                                    <button className="btn-delete-small" onClick={() => handleDelete(song._id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default SongsTab;