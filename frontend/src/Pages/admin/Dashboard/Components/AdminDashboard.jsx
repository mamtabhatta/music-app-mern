import React from 'react';
import { Music, Users, ListMusic, ChevronRight } from 'lucide-react';
// import './Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  return (
    <div className="panel-wrapper">
      <header className="header-section">
        <h1>Control Center</h1>
        <p>Manage your platform's core infrastructure.</p>
      </header>

      <div className="metric-grid">
        <div className="hub-card songs-hover" onClick={() => onNavigate('songs')}>
          <div className="icon-container blue-theme">
            <Music size={32} strokeWidth={2.5} />
          </div>
          <div className="info-stack">
            <span className="label-text">New Requests</span>
            <span className="value-text">Review and approve pending songs</span>
          </div>
          <ChevronRight className="chevron" size={24} />
        </div>

        <div className="hub-card users-hover" onClick={() => onNavigate('users')}>
          <div className="icon-container purple-theme">
            <Users size={32} strokeWidth={2.5} />
          </div>
          <div className="info-stack">
            <span className="label-text">Community</span>
            <span className="value-text">Manage users and account permissions</span>
          </div>
          <ChevronRight className="chevron" size={24} />
        </div>

        <div className="hub-card mod-hover" onClick={() => onNavigate('mod')}>
          <div className="icon-container red-theme">
            <ListMusic size={32} strokeWidth={2.5} />
          </div>
          <div className="info-stack">
            <span className="label-text">All Songs</span>
            <span className="value-text"> Edit or delete any song</span>
          </div>
          <ChevronRight className="chevron" size={24} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;