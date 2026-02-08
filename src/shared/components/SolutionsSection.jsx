import React from 'react';
import './SolutionsSection.css';

const SolutionsSection = () => {
  const solutions = [
    {
      title: 'Operations & Automation',
      description: 'Simplify daily tasks, automate admin,\nand manage your hotel from anywhere.',
      features: [
        'Property Management',
        'Payment Collection',
        'Mobile App',
        'Task Management',
        'Scanners'
      ],
      previewType: 'occupancy'
    },
    {
      title: 'Bookings & Distribution',
      description: 'Capture more direct bookings and stay\nsynced with every OTA—all in one place.',
      features: [
        'Booking Engine',
        'Metasearch',
        'Channel Manager',
        'Rate Management',
        'Availability Sync'
      ],
      previewType: 'bookings'
    }
  ];

  return (
    <section className="solutions-section">
      {/* Header Part */}
      <div className="solutions-header">
        <div className="solutions-badge">
          <span className="badge-icon">🔑</span>
          <span className="badge-text">Solutions</span>
        </div>
        <h2 className="solutions-main-title">
          Whatever your hotel needs,<br />
          we've got you covered
        </h2>
        <p className="solutions-main-description">
          Noovy combines everything independent hotels need to run<br />
          smoothly, boost direct bookings, and create great guest experiences.
        </p>
      </div>

      {/* Sticky Slides Container */}
      <div className="sticky-container">
        {/* Slide 1 */}
        <div className="sticky-slide">
          <div className="slide-content">
            <div className="slide-text">
              <h3 className="slide-title">{solutions[0].title}</h3>
              <p className="slide-description">{solutions[0].description}</p>
              <ul className="features-list">
                {solutions[0].features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="slide-preview">
              <img src="/assets/home-5.avif" alt="Operations & Automation" className="solution-image" />
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="sticky-slide">
          <div className="slide-content">
            <div className="slide-text">
              <h3 className="slide-title">{solutions[1].title}</h3>
              <p className="slide-description">{solutions[1].description}</p>
              <ul className="features-list">
                {solutions[1].features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="slide-preview">
              <img src="/assets/home-4.avif" alt="Bookings & Distribution" className="solution-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
