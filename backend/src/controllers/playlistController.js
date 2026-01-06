const Playlist = require("../models/playlist");
const Song = require("../models/song");

const createPlaylist = async (req, res) => {
    try {
        const { title, description } = req.body;
        const playlist = await Playlist.create({
            userId: req.user._id,
            title,
            description,
            songIds: []
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.user._id }).populate("songIds");
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlaylistsByUserId = async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.params.id }).populate("songIds");
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate("songIds");
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addSongToPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        if (!playlist.songIds.includes(songId)) {
            playlist.songIds.push(songId);
        }
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeSongFromPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        playlist.songIds = playlist.songIds.filter(id => id.toString() !== songId);
        await playlist.save();
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        res.json({ message: "Playlist deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPlaylist,
    getMyPlaylists,
    getPlaylistsByUserId,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
};