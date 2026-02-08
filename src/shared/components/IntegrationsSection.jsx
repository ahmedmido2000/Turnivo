import React from 'react';
import './IntegrationsSection.css';

const IntegrationsSection = () => {
  // Row 1 - scrolls left
  const row1Logos = [
    'AVS', 'Lexware Office', 'Expedia', 'Airbnb', 'dormakaba'
  ];

  // Row 2 - scrolls right
  const row2Logos = [
    'Airbnb', 'dormakaba', 'AVS', 'Lexware Office', 'Expedia'
  ];

  // Row 3 - scrolls left
  const row3Logos = [
    'HOTEK', 'Booking.com', 'Exact', 'Google', 'Lightspeed'
  ];


  return (
    <section className="integrations-section">
      <div className="integrations-container">
        {/* Header */}
        <div className="integrations-header">
          <div className="integrations-badge">
            <span className="badge-icon">🔗</span>
            <span className="badge-text">Integrations</span>
          </div>
          <h2 className="integrations-title">
            We connect with all<br />
            your tools—guaranteed
          </h2>
          <p className="integrations-description">
            Noovy already connects with more than 500 tools.<br />
            If yours is missing, we'll build it for free—just ask.
          </p>
        </div>

        {/* Logo Rows */}
        <div className="logos-wrapper">
          {/* Row 1 - Scroll Left */}
          <div className="logo-row scroll-left">
            <div className="logo-track">
              {[...row1Logos, ...row1Logos, ...row1Logos].map((logo, index) => (
                <div key={index} className="logo-card">
                  <span className="logo-text">{logo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Scroll Right */}
          <div className="logo-row scroll-right">
            <div className="logo-track">
              {[...row2Logos, ...row2Logos, ...row2Logos].map((logo, index) => (
                <div key={index} className="logo-card">
                  <span className="logo-text">{logo}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 - Scroll Left */}
          <div className="logo-row scroll-left">
            <div className="logo-track">
              {[...row3Logos, ...row3Logos, ...row3Logos].map((logo, index) => (
                <div key={index} className="logo-card">
                  <span className="logo-text">{logo}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CTA Button */}
        <div className="integrations-cta-wrapper">
          <button className="integrations-cta">
            Let's talk integrations
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
