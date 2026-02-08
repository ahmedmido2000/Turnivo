import React from 'react';
import './BenefitsSection.css';

const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        {/* Left Content */}
        <div className="benefits-content">
          <div className="benefits-label">Benefits</div>
          <h2 className="benefits-title">
            Save time, from front<br />
            desk to back office
          </h2>
          <p className="benefits-description">
            Noovy automates the admin that eats up your day. From check-ins<br />
            to payments, daily tasks run smoother—so your team spends less<br />
            time clicking, and more time caring.
          </p>
          <button className="benefits-cta">
            Save more time
            <span className="cta-arrow">→</span>
          </button>
        </div>

        {/* Right Image */}
        <div className="benefits-image-container">
          <div className="benefits-card">
            <div className="hotel-scene">
              <img src="/assets/home-1.avif" alt="Hotel entrance" className="hotel-image rounded-4" />
            </div>
            
            {/* Check-in Interface Overlay */}
            <div className="checkin-interface">
              <div className="guest-profile">
                <div className="guest-avatar">
                  <img src="/assets/user.png" alt="Guest" />
                </div>
                <div className="vip-badge">VIP</div>
              </div>
              <div className="guest-name">Anna Richards</div>
              <button className="checkin-button">
                <span>Check-in</span>
                <span className="checkin-icon">🔑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
