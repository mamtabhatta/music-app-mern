import axios from "axios";

const API_URL = "http://localhost:5100/api/playlist";

const api = axios.create({
    baseURL: API_URL,
});

const getAuthHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

export const fetchMyPlaylists = (token) =>
    api.get("/my", getAuthHeader(token));

export const getPlaylistById = (playlistId, token) =>
    api.get(`/${playlistId}`, getAuthHeader(token));

export const createPlaylist = (title, token) =>
    api.post("/", { title }, getAuthHeader(token));

export const addSongToPlaylist = (playlistId, songId, token) =>
    api.put(`/${playlistId}/add`, { songId }, getAuthHeader(token));

export const removeSongFromPlaylist = (playlistId, songId, token) =>
    api.put(`/${playlistId}/remove`, { songId }, getAuthHeader(token));

export const deletePlaylist = (playlistId, token) =>
    api.delete(`/${playlistId}`, getAuthHeader(token));