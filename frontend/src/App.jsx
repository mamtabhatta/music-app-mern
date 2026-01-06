import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppRoutes from "./Routes";
import { MusicProvider } from "./Context/MusicContext";
import FooterPlayer from "./Components/FooterPlayer/FooterPlayer";
import "../src/App.css";

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="app-main-layout">
      <AppRoutes />
      {!isAdminPage && <FooterPlayer />}
    </div>
  );
}

function App() {
  return (
    <MusicProvider>
      <Router>
        <AppContent />
      </Router>
    </MusicProvider>
  );
}

export default App;