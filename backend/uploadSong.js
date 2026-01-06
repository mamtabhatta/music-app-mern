import fs from "fs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Read JSON file containing song info (with genre)
const songs = JSON.parse(fs.readFileSync("./songsInfo.json", "utf-8"));

async function uploadSongs() {
    for (const song of songs) {
        try {
            // Read local files
            const audio = fs.readFileSync(`songs/${song.audioFile}`);
            const image = fs.readFileSync(`covers/${song.imageFile}`);

            // Upload audio
            await supabase.storage.from("music").upload(song.audioFile, audio, { upsert: true });

            // Upload image
            await supabase.storage.from("cover").upload(song.imageFile, image, { upsert: true });

            // Get public URLs
            const { data: audioData } = supabase.storage.from("music").getPublicUrl(song.audioFile);
            const { data: imageData } = supabase.storage.from("cover").getPublicUrl(song.imageFile);
            const audioUrl = audioData.publicUrl;
            const imageUrl = imageData.publicUrl;

            // Insert metadata into Supabase table
            const { error: insertError } = await supabase.from("songs").insert({
                title: song.title,
                artist: song.artist,
                genre: song.genre,
                duration: song.duration,
                audioUrl,
                imageUrl,
                approved: true
            });

            if (insertError) throw insertError;

            console.log("✅ Uploaded:", song.title);
        } catch (err) {
            console.log("❌ Error:", song.title, err.message);
        }
    }
}

uploadSongs();
