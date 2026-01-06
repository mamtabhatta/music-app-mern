import axios from "axios";

const API_URL = "http://localhost:5100/api/playlist";


export const fetchMyPlaylists = (token) => {
    return axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
};


export const getPlaylistById = (playlistId, token) => {
    return axios.get(`${API_URL}/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const createPlaylist = (title, token) => {
    return axios.post(
        API_URL,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const addSongToPlaylist = (playlistId, songId, token) => {
    return axios.put(
        `${API_URL}/${playlistId}/add`,
        { songId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const removeSongFromPlaylist = (playlistId, songId, token) => {
    return axios.put(
        `${API_URL}/${playlistId}/remove`,
        { songId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const deletePlaylist = (playlistId, token) => {
    return axios.delete(`${API_URL}/${playlistId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};