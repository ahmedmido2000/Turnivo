import React from 'react';
import './RevenueGrowthSection.css';

const RevenueGrowthSection = () => {
  return (
    <section className="revenue-growth-section">
      <div className="revenue-container">
        {/* Left Content */}
        <div className="revenue-content">
          <div className="revenue-label">Benefits</div>
          <h2 className="revenue-title">
            Grow your revenue,<br />
            not your workload
          </h2>
          <p className="revenue-description">
            With Noovy, smarter pricing meets smoother operations. You get<br />
            real-time market insights, flexible rate tools, and upsell options built<br />
            in—so you can earn more from every room, without adding<br />
            complexity.
          </p>
          <button className="revenue-cta">
            Get more revenue
            <span className="cta-arrow">→</span>
          </button>
        </div>

        {/* Right Image */}
        <div className="revenue-image-container">
          <div className="revenue-card">
            <div className="room-service-image">
              <img src="/assets/home-2.avif" alt="Hotel room service" className="service-image rounded-4" />
            </div>
            
            {/* Payment Analytics Overlay */}
            <div className="payment-analytics-overlay">
              <div className="analytics-icon">💳</div>
              <div className="analytics-chart">
                <svg viewBox="0 0 100 40" className="revenue-chart">
                  <path 
                    d="M 0,35 Q 20,25 40,20 T 80,15 L 100,10" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="analytics-label">Total Payment</div>
              <div className="analytics-amount">€140.272</div>
              <div className="analytics-growth">
                <span className="growth-percentage">20%</span>
                <span className="growth-icon">📈</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueGrowthSection;
