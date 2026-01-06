import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Login from "../src/Pages/Auth/Login";
import Register from "../src/Pages/Auth/Register";
import Home from "../src/Pages/user/Home/Home";
import Profile from "../src/Pages/user/Profile/Profile";
import SearchPage from "../src/Components/Search/Search";
import SongDetail from "./Pages/user/SongDetail/SongDetail";
import DiscoverPage from "../src/Pages/user/Discover/Discover";
import AdminPage from "../src/Pages/admin/Dashboard/AdminPage";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return !token ? children : <Navigate to="/dashboard" replace />;
};

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace />;

    try {
        const decoded = jwtDecode(token);
        return decoded.role === "admin" ? children : <Navigate to="/dashboard" replace />;
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
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
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
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
                path="/song"
                element={
                    <PrivateRoute>
                        <SongDetail />
                    </PrivateRoute>
                }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
};

export default AppRoutes;