import React from 'react';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        {/* Left Payment Card */}
        <div className="payment-card cta-card-left">
          <div className="card-header">Total Received:</div>
          <div className="payment-item">
            <div className="payment-icon credit-card-icon">💳</div>
            <div className="payment-details">
              <div className="payment-method">By Credit Cards</div>
              <div className="payment-amount cyan">€140.000</div>
            </div>
          </div>
          <div className="payment-item">
            <div className="payment-icon cash-icon">💵</div>
            <div className="payment-details">
              <div className="payment-method">By Cash</div>
              <div className="payment-amount yellow">€80.000</div>
            </div>
          </div>
          <div className="payment-item">
            <div className="payment-icon bank-icon">🏦</div>
            <div className="payment-details">
              <div className="payment-method">By Bank Tr...</div>
              <div className="payment-amount gray">€25.000</div>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="cta-content">
          <h2 className="cta-title">
            Let's make running your<br />
            hotel feel easier—every day
          </h2>
          <p className="cta-description">
            Bookings to check-outs, Noovy handles it.<br />
            Setup done. Support included. Tasks simplified.
          </p>
          <button className="cta-button">
            Book a demo
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Right Booking Card */}
        <div className="booking-card cta-card-right">
          <div className="booking-badge">New Booking</div>
          <div className="booking-header">
            <div className="booking-title">NEW BOOKINGS</div>
            <div className="booking-subtitle">Last 30 Days</div>
          </div>
          <div className="booking-chart">
            <svg viewBox="0 0 120 120" className="donut-chart">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
              />
              {/* Purple segment (largest) */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="20"
                strokeDasharray="157 314"
                strokeDashoffset="0"
                transform="rotate(-90 60 60)"
              />
              {/* Cyan segment */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="20"
                strokeDasharray="94 314"
                strokeDashoffset="-157"
                transform="rotate(-90 60 60)"
              />
              {/* Yellow segment */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="20"
                strokeDasharray="63 314"
                strokeDashoffset="-251"
                transform="rotate(-90 60 60)"
              />
              {/* Center text */}
              <text
                x="60"
                y="65"
                textAnchor="middle"
                fontSize="24"
                fontWeight="900"
                fill="#0a0a1f"
              >
                2059
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
