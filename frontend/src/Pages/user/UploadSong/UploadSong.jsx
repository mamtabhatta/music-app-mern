import React, { useState } from "react";
import { FaMusic, FaImage, FaUpload, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadSong.css";

const UploadSong = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        artist: "",
        album: "",
        genre: "",
        duration: ""
    });
    const [songFile, setSongFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        if (e.target.name === "song") setSongFile(e.target.files[0]);
        if (e.target.name === "cover") setCoverFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!songFile || !coverFile) return alert("Please select both files.");

        setLoading(true);
        const data = new FormData();
        
        data.append("title", formData.title.trim());
        data.append("artist", formData.artist.trim());
        data.append("album", formData.album.trim());
        data.append("genre", formData.genre.trim());
        data.append("duration", formData.duration.trim());
        data.append("song", songFile);
        data.append("cover", coverFile);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:5100/api/users/upload", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(res.data.message);
            setTimeout(() => navigate("/profile"), 2000);
        } catch (err) {
            console.error(err);
            alert("Upload failed: " + (err.response?.data?.message || "Server error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-page">
            <nav className="top-nav">
                <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
                <h2>Upload Music</h2>
            </nav>

            <form className="upload-form" onSubmit={handleSubmit}>
                <div className="file-inputs-container">
                    <div className="file-box">
                        <label htmlFor="song-upload">
                            <FaMusic className="icon" />
                            <span>{songFile ? songFile.name : "Select Song File"}</span>
                        </label>
                        <input 
                            id="song-upload" 
                            type="file" 
                            name="song" 
                            accept="audio/*" 
                            onChange={handleFileChange} 
                            hidden 
                        />
                    </div>

                    <div className="file-box">
                        <label htmlFor="cover-upload">
                            <FaImage className="icon" />
                            <span>{coverFile ? coverFile.name : "Select Cover Art"}</span>
                        </label>
                        <input 
                            id="cover-upload" 
                            type="file" 
                            name="cover" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            hidden 
                        />
                    </div>
                </div>

                <div className="text-inputs">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Song Title" 
                        value={formData.title} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="artist" 
                        placeholder="Artist Name" 
                        value={formData.artist} 
                        onChange={handleInputChange} 
                        required 
                    />
                    <input 
                        type="text" 
                        name="album" 
                        placeholder="Album Name (Optional)" 
                        value={formData.album} 
                        onChange={handleInputChange} 
                    />
                    <input 
                        type="text" 
                        name="genre" 
                        placeholder="Genre (e.g. Pop, Jazz)" 
                        value={formData.genre} 
                        onChange={handleInputChange} 
                    />
                    <input 
                        type="text" 
                        name="duration" 
                        placeholder="Duration (e.g. 3:45)" 
                        value={formData.duration} 
                        onChange={handleInputChange} 
                        required 
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Uploading..." : <><FaUpload /> Upload Song</>}
                </button>

                {message && <p className="success-msg">{message}</p>}
            </form>
        </div>
    );
};

export default UploadSong;