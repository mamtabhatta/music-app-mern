const Playlist = require("../models/playlist");

const createPlaylist = async (req, res) => {
    try {
        const { title, description } = req.body;
        const playlist = await Playlist.create({
            userId: req.user._id,
            title,
            description: description || "",
            songIds: []
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.user._id });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addSongToPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        // Convert to string just to be safe
        const cleanSongId = String(songId);

        const playlist = await Playlist.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { songIds: cleanSongId } }, // $addToSet prevents duplicates automatically
            { new: true }
        );

        if (!playlist) return res.status(404).json({ message: "Playlist not found" });
        res.json(playlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const removeSongFromPlaylist = async (req, res) => {
    try {
        const { songId } = req.body;
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        playlist.songIds = playlist.songIds.filter(id => id !== songId);
        await playlist.save();

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        if (playlist.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
};
