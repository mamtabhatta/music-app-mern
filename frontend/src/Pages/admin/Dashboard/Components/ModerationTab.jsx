import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit3, CheckCircle, Clock, Save, X } from "lucide-react";

const ModerationTab = () => {
    const [songs, setSongs] = useState([]);
    const [editingSong, setEditingSong] = useState(null);
    const [formData, setFormData] = useState({ artist: "", genre: "" });
    const [loading, setLoading] = useState(true);

    const API_BASE = "http://localhost:5100/api/admin"; 

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_BASE}/songs/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSongs(res.data.songs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this song permanently?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_BASE}/song/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSongs(songs.filter(s => s._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const handleUpdate = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_BASE}/song/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingSong(null);
            fetchSongs();
        } catch (err) {
            alert("Update failed");
        }
    };

    if (loading) return <div className="loading">Loading songs library...</div>;

    return (
        <div className="moderation-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Artist</th>
                        <th>Genre</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right", paddingRight: "40px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map((song) => (
                        <tr key={song._id}>
                            <td>{song.title}</td>
                            <td>
                                {editingSong === song._id ? (
                                    <input 
                                        className="edit-input"
                                        value={formData.artist} 
                                        onChange={(e) => setFormData({...formData, artist: e.target.value})}
                                    />
                                ) : (song.artist || song.artistName || "Unknown Artist")}
                            </td>
                            <td>
                                {editingSong === song._id ? (
                                    <input 
                                        className="edit-input"
                                        value={formData.genre} 
                                        onChange={(e) => setFormData({...formData, genre: e.target.value})}
                                    />
                                ) : (song.genre)}
                            </td>
                            <td>
                                {song.approved ? 
                                    <span className="badge approved"><CheckCircle size={12}/> Approved</span> : 
                                    <span className="badge pending"><Clock size={12}/> Pending</span>
                                }
                            </td>
                            <td className="actions-cell">
                                {editingSong === song._id ? (
                                    <div className="actions-wrapper">
                                        <button onClick={() => handleUpdate(song._id)} className="btn-icon save"><Save size={18}/></button>
                                        <button onClick={() => setEditingSong(null)} className="btn-icon cancel"><X size={18}/></button>
                                    </div>
                                ) : (
                                    <div className="actions-wrapper">
                                        <button onClick={() => {
                                            setEditingSong(song._id);
                                            setFormData({ 
                                                artist: song.artist || song.artistName || "", 
                                                genre: song.genre 
                                            });
                                        }} className="btn-icon edit"><Edit3 size={18}/></button>
                                        <button onClick={() => handleDelete(song._id)} className="btn-icon delete"><Trash2 size={18}/></button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModerationTab;