import React from 'react';
import './DirectBookingsSection.css';

const DirectBookingsSection = () => {
  return (
    <section className="direct-bookings-section">
      <div className="direct-bookings-container">
        {/* Left Image */}
        <div className="bookings-image-container">
          <div className="bookings-card">
            <div className="hotel-room-image">
              <img src="/assets/home-1.avif" alt="Hotel room" className="room-image rounded-4" />
            </div>
            
            {/* Booking Sources Overlay */}
            <div className="booking-sources-overlay">
              <div className="booking-source google-source">
                <div className="source-icon google-icon">G</div>
                <div className="source-info">
                  <div className="source-name">Hotel Estrella</div>
                  <div className="source-url">hotelestrella.com</div>
                </div>
                <div className="cursor-pointer">🖱️</div>
              </div>
              
              <div className="booking-source booking-com-source">
                <div className="source-icon booking-icon">B.</div>
                <div className="source-info">
                  <div className="source-name">Grand Vineli Hotel</div>
                  <div className="source-url">booking.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="bookings-content">
          <div className="bookings-label">Benefits</div>
          <h2 className="bookings-title">
            Boost direct bookings,<br />
            save on OTAs
          </h2>
          <p className="bookings-description">
            Noovy helps you drive more direct bookings while staying fully<br />
            synced with every OTA. Your website converts better, your visibility<br />
            on Google increases, and you keep the revenue that used to go to<br />
            commissions.
          </p>
          <button className="bookings-cta">
            Get more booking
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DirectBookingsSection;
