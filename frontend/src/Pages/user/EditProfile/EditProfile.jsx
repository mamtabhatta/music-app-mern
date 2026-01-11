import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [preview, setPreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:5100/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setName(res.data.name);
                setEmail(res.data.email);
                setPreview(res.data.profilePictureUrl);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, [token]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        if (selectedFile) {
            formData.append("profilePicture", selectedFile);
        }

        try {
            await axios.put("http://localhost:5100/api/users/profile", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/profile");
        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-page">
            <div className="edit-glass-container">
                <div className="edit-header">
                    <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
                    <h2>Edit Profile</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="avatar-upload-section">
                        <img
                            src={preview || "https://via.placeholder.com/150"}
                            alt="Preview"
                            className="edit-image-preview"
                        />
                        <label className="upload-label">
                            <FaCamera /> Change Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            className="glass-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            className="glass-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;