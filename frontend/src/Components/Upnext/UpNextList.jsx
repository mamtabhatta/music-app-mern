import React from "react";
import { FaPlay } from "react-icons/fa";
import "./UpNextList.css";

const UpNextList = ({ songs = [], currentSong, playSong }) => {
    if (!currentSong || !songs || songs.length === 0) {
        return (
            <div className="up-next-wrapper">
                <h3 className="queue-title">Next in queue</h3>
                <p className="queue-empty">Your queue is currently empty.</p>
            </div>
        );
    }

    const currentIndex = songs.findIndex((s) => (s._id || s.old_id) === (currentSong._id || currentSong.old_id));
    const queue = songs.slice(currentIndex + 1);

    return (
        <div className="up-next-wrapper">
            <h3 className="queue-title">Next in queue</h3>
            <div className="queue-list">
                {queue.length > 0 ? (
                    queue.map((song) => (
                        <div
                            key={song._id || song.old_id}
                            className="queue-item"
                            onClick={() => playSong(song, songs)}
                        >
                            <div className="queue-img-container">
                                <img 
                                    src={song.coverImageUrl || song.imageUrl} 
                                    alt={song.title} 
                                    onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
                                />
                                <div className="queue-play-overlay">
                                    <FaPlay size={10} />
                                </div>
                            </div>

                            <div className="queue-info">
                                <span className="q-title">{song.title}</span>
                                <span className="q-artist">{song.artist}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="queue-empty">End of playlist</p>
                )}
            </div>
        </div>
    );
};

export default UpNextList;