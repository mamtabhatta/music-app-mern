import React from "react";
import { FaMusic, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./PlaylistCard.css";

const PlaylistCard = ({ playlist, userName }) => {
  const navigate = useNavigate();
  const id = playlist?._id || playlist?.id;

  return (
    <div className="pl-card" onClick={() => navigate(`/playlist/${id}`)}>
      <div className="pl-card-image-container">
        {playlist?.coverUrl ? (
          <img src={playlist.coverUrl} alt={playlist.title} className="pl-card-img" />
        ) : (
          <div className="pl-card-placeholder">
            <FaMusic size={40} />
          </div>
        )}
        <button className="pl-play-badge">
          <FaPlay />
        </button>
      </div>
      <div className="pl-card-info">
        <h3 className="pl-title">{playlist?.title || "Untitled Playlist"}</h3>
        <p className="pl-subtitle">By {userName || "User"}</p>
      </div>
    </div>
  );
};

export default PlaylistCard;