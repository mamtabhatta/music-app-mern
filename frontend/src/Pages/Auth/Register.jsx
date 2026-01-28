import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import musicImg from "../../assets/music.png";
import "../Auth/Auth.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axios.post("http://localhost:5100/api/auth/signup", formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-left">
                    <img src={musicImg} alt="logo" />
                    <h1>Join us</h1>
                    <p>The only music that matters</p>
                </div>
                <div className="auth-right">
                    <h2>Registration</h2>
                    {error && <p className="error-text">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <FaUser className="icon" />
                            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <FaEnvelope className="icon" />
                            <input type="email" name="email" placeholder="Email address" onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <FaLock className="icon" />
                            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <button type="submit" className="auth-btn">Sign up</button>
                    </form>
                    <p className="switch-text">
                        Already have an account? <Link to="/login" className="link">Click here to login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;