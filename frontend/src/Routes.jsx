import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import Home from "./Pages/user/Home/Home";
import Profile from "./Pages/user/Profile/Profile";
import SearchPage from "./Components/Search/Search";
import SongDetail from "./Pages/user/SongDetail/SongDetail";
import DiscoverPage from "./Pages/user/Discover/Discover";
import AdminPage from "./Pages/admin/Dashboard/AdminPage";
import UploadSong from "./Pages/user/UploadSong/UploadSong";
import EditProfile from "./Pages/user/EditProfile/EditProfile";
import PlaylistDetail from "./Pages/user/PlayList/ PlaylistDetail";

const getRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch (error) {
        return null;
    }
};

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const role = getRoleFromToken();
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "user") return <Navigate to="/dashboard" replace />;
    return children;
};

const AdminRoute = ({ children }) => {
    const role = getRoleFromToken();
    if (role === "admin") return children;
    return <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
            <Route
                path="/discover"
                element={
                    <PrivateRoute>
                        <DiscoverPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/search"
                element={
                    <PrivateRoute>
                        <SearchPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />

            <Route
                path="/profile/:id"
                element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/playlist/:id"
                element={
                    <PrivateRoute>
                        <PlaylistDetail />
                    </PrivateRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <PrivateRoute>
                        <EditProfile />
                    </PrivateRoute>
                }
            />
            <Route
                path="/song"
                element={
                    <PrivateRoute>
                        <SongDetail />
                    </PrivateRoute>
                }
            />
            <Route path="/upload"
                element={
                    <PrivateRoute>
                        <UploadSong />
                    </PrivateRoute>
                }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;