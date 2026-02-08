import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Decorative badges */}
        <div className="hero-badge hero-badge-left">
          <span className="badge-icon">✈️</span>
          <span className="badge-text">House keeping</span>
        </div>
        
        <div className="hero-badge hero-badge-right">
          <span className="badge-icon">🔔</span>
          <span className="badge-text">Front desk</span>
        </div>

        {/* Main content */}
        <div className="hero-content">
          <h1 className="hero-title">
            All-in-one hotel software<br />
            for independent hotels
          </h1>
          
          <p className="hero-description">
            Noovy combines your PMS, channel manager, booking engine, and more into<br />
            one platform. Less admin, more direct bookings—for independent hotels.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <button className="hero-btn hero-btn-primary">
              Book a demo
              <span className="btn-arrow">→</span>
            </button>
            <button className="hero-btn hero-btn-secondary">
              Why Noovy
            </button>
          </div>

          {/* Trust badges */}
          <div className="hero-trust-badges">
            <div className="trust-badge">
              <div className="trust-badge-logo">
                <span className="capterra-logo">🏆 Capterra</span>
              </div>
              <div className="trust-badge-rating">
                <div className="stars">
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                </div>
                <span className="rating-score">4.9</span>
              </div>
            </div>

            <div className="trust-badge">
              <div className="trust-badge-logo">
                <span className="hoteltech-logo">HotelTechReport 😊</span>
              </div>
              <div className="trust-badge-rating">
                <div className="stars">
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                </div>
                <span className="rating-score">5.0</span>
              </div>
            </div>

            <div className="trust-badge">
              <div className="trust-badge-logo">
                <span className="software-advice-logo">Software Advice™</span>
              </div>
              <div className="trust-badge-rating">
                <div className="stars">
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                </div>
                <span className="rating-score">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
