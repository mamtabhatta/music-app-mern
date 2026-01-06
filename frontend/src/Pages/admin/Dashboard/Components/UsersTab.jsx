import React, { useState, useEffect } from 'react';
import { Trash2, Users } from 'lucide-react';

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5100/api/admin/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setUsers(data.users || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await fetch(`http://localhost:5100/api/admin/user/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="empty-msg">Loading users...</div>;

    if (users.length === 0) {
        return (
            <div className="empty-msg">
                <Users size={48} color="#94a3b8" />
                <p>No regular users found.</p>
            </div>
        );
    }

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                            <span className={user.role === 'admin' ? 'badge-admin' : 'badge-user'}>
                                {user.role}
                            </span>
                        </td>
                        <td className="actions">
                            {user.role !== 'admin' && (
                                <button className="btn-delete-small" onClick={() => handleDeleteUser(user._id)}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTab;