const mongoose = require("mongoose");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const Song = require("./src/models/song"); 

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const sync = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");

        const mongoSongs = await Song.find({});
        console.log(`Found ${mongoSongs.length} songs. Preparing Supabase upload...`);

        const formattedData = mongoSongs.map(song => ({
            id: song._id.toString(),
            // Using || "Unknown" ensures we never send a null value to Supabase
            title: song.title || "Untitled",
            artist: song.artist || "Unknown Artist", 
            genre: song.genre || "General",
            approved: true
        }));

        const { error } = await supabase
            .from("songs")
            .upsert(formattedData);

        if (error) throw error;

        console.log(" SUCCESS! All songs synced with valid data.");
        process.exit();
    } catch (err) {
        console.error(" Sync Failed:", err.message);
        process.exit(1);
    }
};

sync();