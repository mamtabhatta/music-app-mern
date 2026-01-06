import React, { useState, useEffect } from 'react';
import { Music, Users, ShieldCheck, CheckCircle, Trash2, MessageSquare } from 'lucide-react';
import './AdminPage.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('songs');
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'songs') fetchSongs();
    }, [activeTab]);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5100/api/admin/songs/pending', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setSongs(data.pendingSongs || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        await fetch(`http://localhost:5100/api/admin/song/approve/${id}`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchSongs();
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <ShieldCheck className="icon-gold" />
                    <span>Admin Panel</span>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'songs' ? 'active' : ''} onClick={() => setActiveTab('songs')}>
                        <Music size={20} /> Songs
                    </button>
                    <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <Users size={20} /> Users
                    </button>
                    <button className={activeTab === 'mod' ? 'active' : ''} onClick={() => setActiveTab('mod')}>
                        <MessageSquare size={20} /> Moderation
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-content-header">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
                </header>

                <div className="admin-card">
                    {loading ? (
                        <p className="loading-text">Loading data...</p>
                    ) : (
                        <>
                            {activeTab === 'songs' && (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Song Title</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {songs.length > 0 ? songs.map(song => (
                                            <tr key={song._id}>
                                                <td>{song.title}</td>
                                                <td><span className="badge-pending">Pending</span></td>
                                                <td className="actions">
                                                    <button className="btn-approve" onClick={() => handleApprove(song._id)}>
                                                        <CheckCircle size={16} /> Approve
                                                    </button>
                                                    <button className="btn-delete">
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="3" className="empty-msg">No pending songs found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                            {activeTab === 'users' && <div className="empty-msg">User management UI coming soon...</div>}
                            {activeTab === 'mod' && <div className="empty-msg">Moderation UI coming soon...</div>}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPage;