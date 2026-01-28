import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import musicImg from "../../assets/music.png";
import "../Auth/Auth.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5100/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data));
            const payload = JSON.parse(window.atob(data.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            navigate(payload.role === "admin" ? "/admin" : "/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-left">
                    <img src={musicImg} alt="logo" />
                    <h1>Welcome</h1>
                    <p>Back to the rhythm</p>
                </div>
                <div className="auth-right">
                    <h2>Login</h2>
                    {error && <p className="error-text">{error}</p>}
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                    <p className="switch-text">
                        Don't have an account? <Link to="/register" className="link">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;