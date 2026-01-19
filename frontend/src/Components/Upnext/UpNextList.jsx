import React from "react";
import { FaPlay } from "react-icons/fa";
import "./UpNextList.css";

const UpNextList = ({ songs = [], currentSong, playSong }) => {
    if (!currentSong || songs.length === 0) {
        return (
            <div className="up-next-wrapper">
                <h3 className="queue-title">Next in queue</h3>
                <p className="queue-empty">Your queue is currently empty.</p>
            </div>
        );
    }

    const currentIndex = songs.findIndex((s) => s.old_id === currentSong.old_id);
    const queue = songs.slice(currentIndex + 1);

    return (
        <div className="up-next-wrapper">
            <h3 className="queue-title">Next in queue</h3>
            <div className="queue-list">
                {queue.length > 0 ? (
                    queue.map((song, index) => (
                        <div
                            key={song.old_id}
                            className="queue-item"
                            onClick={() => playSong(song, songs)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px' }}
                        >
                            {/* FORCE IMAGE SIZE HERE */}
                            <div className="queue-img-container" style={{ 
                                width: '40px', 
                                height: '40px', 
                                minWidth: '40px', 
                                flexShrink: 0 
                            }}>
                                <img 
                                    src={song.imageUrl} 
                                    alt={song.title} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover', 
                                        borderRadius: '4px' 
                                    }} 
                                />
                                <div className="queue-play-overlay">
                                    <FaPlay size={10} />
                                </div>
                            </div>

                            <div className="queue-info" style={{ overflow: 'hidden' }}>
                                <span className="q-title" style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    fontWeight: '500',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {song.title}
                                </span>
                                <span className="q-artist" style={{ 
                                    fontSize: '12px', 
                                    color: '#b3b3b3' 
                                }}>
                                    {song.artist}
                                </span>
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