import React from 'react';
import './Footer.css';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="spotify-footer">
      <div className="footer-upper">
        <div className="footer-links-container">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>About</li>
              <li>Jobs</li>
              <li>For the Record</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Communities</h4>
            <ul>
              <li>For Artists</li>
              <li>Developers</li>
              <li>Advertising</li>
              <li>Investors</li>
              <li>Vendors</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Useful links</h4>
            <ul>
              <li>Support</li>
              <li>Free Mobile App</li>
              <li>Popular by Country</li>
              <li>Import your music</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Spotify Plans</h4>
            <ul>
              <li>Premium Individual</li>
              <li>Premium Duo</li>
              <li>Premium Family</li>
              <li>Premium Student</li>
              <li>TuneHub Free</li>
            </ul>
          </div>
        </div>

        <div className="footer-social-icons">
          <div className="icon-circle"><FaInstagram /></div>
          <div className="icon-circle"><FaTwitter /></div>
          <div className="icon-circle"><FaFacebookF /></div>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-lower">
        <div className="legal-links">
          <span>Legal</span>
          <span>Safety & Privacy Center</span>
          <span>Privacy Policy</span>
          <span>Cookies</span>
          <span>About Ads</span>
          <span>Accessibility</span>
        </div>
        <div className="copyright">
          © 2025 TuneHub AB
        </div>
      </div>
    </footer>
  );
};

export default Footer;