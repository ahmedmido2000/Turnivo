import React from 'react';
import './GuestExperienceSection.css';

const GuestExperienceSection = () => {
  return (
    <section className="guest-experience-section">
      <div className="guest-container">
        {/* Left Image */}
        <div className="guest-image-container">
          <div className="guest-card">
            <div className="guest-photo">
              <img src="/assets/home-3.avif" alt="Guest experience" className="guest-image rounded-4" />
            </div>
            
            {/* Check-in Interface Overlay */}
            <div className="checkin-status-overlay">
              <div className="hotel-header">
                <div className="hotel-logo">🏨</div>
                <div className="hotel-name">Hotel Estrella</div>
                <div className="menu-dots">⋯</div>
              </div>
              
              <div className="checkin-badge-container">
                <div className="checkin-badge">
                  <span className="badge-text">Online Check-in</span>
                </div>
                <div className="date-badge">
                  <span className="calendar-icon">📅</span>
                  <span className="date-text">20 - 24 April</span>
                </div>
              </div>
              
              <div className="status-message">
                <span className="status-text">Self check-in </span>
                <span className="status-complete">is complete!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="guest-content">
          <div className="guest-label">Benefits</div>
          <h2 className="guest-title">
            Happier guests,<br />
            without the extra work
          </h2>
          <p className="guest-description">
            Guests notice the little things—especially when they go smoothly.<br />
            Noovy speeds up arrivals, automates messages, and cuts the<br />
            paperwork—so every stay starts with ease, not friction.
          </p>
          <button className="guest-cta">
            Get happier guests
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default GuestExperienceSection;
