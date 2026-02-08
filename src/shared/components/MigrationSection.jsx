import React from 'react';
import './MigrationSection.css';

const MigrationSection = () => {
  const cards = [
    {
      title: 'We set up your entire system',
      description: 'Rooms, rates, channels, payments, we handle it all, so you don\'t have to lift a finger.',
      image: 'setup'
    },
    {
      title: 'We move your bookings into Noovy',
      description: 'Every upcoming reservation is imported and ready to go. No double entry. No downtime.',
      image: 'bookings'
    },
    {
      title: 'We train your team, hands-on',
      description: 'Live sessions, clear guides, and simple tools, your staff feels confident from day one.',
      image: 'training'
    },
    {
      title: 'We\'re your support team—24/7',
      description: 'Real people. Real hospitality experience. Available 24/7 on chat, phone, or WhatsApp.',
      image: 'support'
    }
  ];

  return (
    <section className="migration-section">
      <div className="migration-wrapper">
        <div className="migration-container">
          {/* Static Left Side - stays fixed */}
          <div className="migration-left-static">
            <div className="migration-badge">Done-for-you Migration</div>
            <h2 className="migration-title">
              Switching to<br />
              Noovy is a breeze
            </h2>
            <p className="migration-description">
              Switching systems can feel overwhelming. That's why we handle the setup, migration, and training for you, step by step, side by side.
            </p>
            <button className="migration-cta">
              Book a demo
              <span className="arrow">→</span>
            </button>
          </div>

          {/* Scrolling Right Side - Cards */}
          <div className="migration-right-scroll">
            {cards.map((card, index) => (
              <div key={index} className="migration-card-sticky">
                <div className="migration-card">
                  <div className={`card-image ${card.image}`}>
                    <img src="/assets/home-1.avif" alt={card.title} className="migration-image" />
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-description">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MigrationSection;
