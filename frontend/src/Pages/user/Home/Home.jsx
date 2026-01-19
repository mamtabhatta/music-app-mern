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
                console.error(err.message);
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
                <Sidebar />
                <main className="home-main">
                    <section className="section">
                        <h2>Featured</h2>
                        <div className="song-grid">
                            {featured.map((song, index) => (
                                <SongCard 
                                    key={`feat-${song.id || index}`} 
                                    song={song} 
                                    list={featured} 
                                />
                            ))}
                        </div>
                    </section>

                    <section className="section">
                        <h2>Trending Now</h2>
                        <div className="song-grid">
                            {trending.map((song, index) => (
                                <SongCard 
                                    key={`trend-${song.id || index}`} 
                                    song={song} 
                                    list={trending} 
                                />
                            ))}
                        </div>
                    </section>

                    <section className="section">
                        <h2>Made For You</h2>
                        <div className="song-grid">
                            {forYou.map((song, index) => (
                                <SongCard 
                                    key={`foryou-${song.id || index}`} 
                                    song={song} 
                                    list={forYou} 
                                />
                            ))}
                        </div>
                    </section>
                    <Footer />
                </main>
            </div>
            <FooterPlayer />
        </div>
    );
};

export default Home;