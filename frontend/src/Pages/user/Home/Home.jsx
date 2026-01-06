import React, { useEffect, useState } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import FooterPlayer from "../../../Components/FooterPlayer/FooterPlayer";
import { supabase } from "../../../Lib/SupabaseClient";
import SongCard from "../../../Components/Songcard/Songcard";
import Footer from '../../../Components/Footer/Footer';
import "./Home.css";

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [trending, setTrending] = useState([]);
    const [forYou, setForYou] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const { data, error } = await supabase
                    .from("songs")
                    .select("*")
                    .eq("approved", true);

                if (error) throw error;

                setFeatured(data.slice(0, 6));
                setTrending(data.slice(6, 12));
                setForYou(data.slice(12));
            } catch (err) {
                console.error("Error fetching songs:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    if (loading) return <div className="loader">Loading...</div>;

    return (
        <div className="app-container">
            <Navbar />
            <div className="content-container">
                <Sidebar onToggle={(open) => setSidebarOpen(open)} />
                <div className={`home-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

                    <section className="section">
                        <h2>Featured</h2>
                        <div className="song-grid">
                            {featured.map((song) => (
                                <SongCard key={song.id} song={song} />
                            ))}
                        </div>
                    </section>

                    <section className="section">
                        <h2>Trending Now</h2>
                        <div className="song-grid">
                            {trending.map((song) => (
                                <SongCard key={song.id} song={song} />
                            ))}
                        </div>
                    </section>

                    <section className="section">
                        <h2>Made For You</h2>
                        <div className="song-grid">
                            {forYou.map((song) => (
                                <SongCard key={song.id} song={song} />
                            ))}
                        </div>
                        <Footer />
                    </section>
                </div>
            </div>
            <FooterPlayer />
        </div>
    );
};

export default Home;