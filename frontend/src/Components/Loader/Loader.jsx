import React from "react";
import "./Loader.css";

const Loader = () => (
    <div className="loader-container">
        <div className="equalizer">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>
        <div className="loader-text">Loading</div>
    </div>
);

export default Loader;
