import React from 'react';
import './FinalCTASection.css';

const FinalCTASection = () => {
  return (
    <section className="final-cta-section">
      <div className="final-cta-container">
        {/* Left Floating Card - Bookings */}
        <div className="floating-card left-card">
          <div className="card-header">
            <div className="card-badge">NEW BOOKINGS</div>
            <div className="card-subtitle">Last 30 Days</div>
          </div>
          <div className="donut-chart">
            <svg viewBox="0 0 100 100" className="chart-svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="12" />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#7c3aed" 
                strokeWidth="12"
                strokeDasharray="150 251"
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="12"
                strokeDasharray="75 251"
                strokeDashoffset="-150"
                transform="rotate(-90 50 50)"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                fill="none" 
                stroke="#fbbf24" 
                strokeWidth="12"
                strokeDasharray="26 251"
                strokeDashoffset="-225"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="chart-center">2059</div>
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-dot purple"></span>
              <span className="legend-text">Booking.com</span>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="final-cta-content">
          <h2 className="final-cta-title">
            Let's make running<br />
            your hotel feel effortless
          </h2>
          <p className="final-cta-description">
            Everything in one place. Nothing slipping through the cracks. Just<br />
            smooth, simple control. Let us walk you through how it all works.
          </p>
          <button className="final-cta-button">
            Book a demo
            <span className="arrow">→</span>
          </button>
        </div>

        {/* Right Floating Card - Room Inspection */}
        <div className="floating-card right-card">
          <div className="card-header-right">
            <div className="card-title-small">Room Inspection — VIP Arrival</div>
            <div className="card-menu">⋯</div>
          </div>
          <div className="priority-badge">High</div>
          <div className="task-details">
            <div className="task-row"></div>
            <div className="task-row"></div>
            <div className="task-row"></div>
          </div>
          <div className="assignees">
            <div className="avatar avatar-1"></div>
            <div className="avatar avatar-2"></div>
            <div className="avatar avatar-3"></div>
            <div className="avatar-count">+2</div>
          </div>
          <div className="card-footer">
            <div className="comment-icon">💬</div>
            <div className="comment-count">4</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
