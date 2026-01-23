import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createClient } from "@supabase/supabase-js";
import Song from "../backend/src/models/song.js"; // Your Mongoose model

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));


const songs = JSON.parse(fs.readFileSync(path.resolve("../backend/supabase_songs_backup.json"), "utf-8"));

async function saveMetadataOnly() {
    const fakeArtistId = new mongoose.Types.ObjectId(); 
    for (const song of songs) {
        try {
            await Song.create({
                title: song.title,
                artist: song.artist,
                artistId: fakeArtistId,
                album: song.album || "",
                genre: song.genre || "",
                duration: song.duration,
                songUrl: song.audioUrl,       
                coverImageUrl: song.imageUrl, 
                approved: song.approved,
                isPublic: song.approved
            });

            console.log("✅ Saved metadata:", song.title);

        } catch (err) {
            console.log("❌ Error:", song.title, err.message);
        }
    }
    console.log("🎉 All metadata saved to MongoDB");
    mongoose.disconnect();
}

saveMetadataOnly();
