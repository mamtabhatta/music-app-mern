import React, { useState, useEffect } from 'react';
import { CheckCircle, Trash2, Music } from 'lucide-react';

const SongsTab = () => {
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

    const handleApprove = async (id) => {
        try {
            const res = await fetch(`http://localhost:5100/api/admin/song/approve/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                fetchSongs();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5100/api/admin/song/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                fetchSongs();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="empty-msg">Loading songs...</div>;

    if (songs.length === 0) {
        return (
            <div className="empty-msg">
                <Music size={48} />
                <p>No pending songs found.</p>
            </div>
        );
    }

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {songs.map(song => (
                    <tr key={song._id}>
                        <td>{song.title}</td>
                        <td><span className="badge-pending">Pending</span></td>
                        <td className="actions">
                            <button className="btn-approve" onClick={() => handleApprove(song._id)}>
                                <CheckCircle size={16} /> Approve
                            </button>
                            <button className="btn-delete-small" onClick={() => handleDelete(song._id)}>
                                <Trash2 size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SongsTab;