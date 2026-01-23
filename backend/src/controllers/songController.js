const Song = require("../models/song");

const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({ approved: true })
            .sort({ createdAt: -1 })
            .populate("artistId", "name profilePictureUrl");
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([
            { $match: { approved: true } },
            { $sample: { size: 6 } },
        ]);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMadeForYouSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([
            { $match: { approved: true } },
            { $sample: { size: 4 } },
        ]);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTrendingSongs = async (req, res) => {
    try {
        const songs = await Song.find({ approved: true })
            .sort({ playCount: -1 })
            .limit(4);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id).populate(
            "artistId",
            "name profilePictureUrl"
        );
        if (!song || !song.approved) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchSongs = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const songs = await Song.find({
            approved: true,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { artist: { $regex: query, $options: "i" } },
                { genre: { $regex: query, $options: "i" } },
            ],
        }).populate("artistId", "name");

        const formattedSongs = songs.map(song => {
            const s = song.toObject();
            return {
                ...s,
                _id: s._id,
                artist: (typeof s.artist === 'string' && !/^[0-9a-fA-F]{24}$/.test(s.artist)) 
                    ? s.artist 
                    : (s.artistId?.name || "Unknown Artist"),
                coverImageUrl: s.coverImageUrl || s.imageUrl,
                songUrl: s.songUrl || s.audioUrl
            };
        });

        res.json(formattedSongs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllSongs,
    getFeaturedSongs,
    getMadeForYouSongs,
    getTrendingSongs,
    getSongById,
    searchSongs,
};