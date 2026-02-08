import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, 
  faSearch, 
  faCalendarCheck, 
  faWandMagicSparkles, 
  faCreditCard, 
  faStar 
} from '@fortawesome/free-solid-svg-icons';

const HowWeWorkMain = () => {
  const steps = [
    {
      id: 1,
      title: 'Create Your Account',
      description: 'Sign up as a client or a service provider. It only takes a minute to get started with our professional network.',
      icon: faUserPlus,
      color: '#292760'
    },
    {
      id: 2,
      title: 'Choose Your Service',
      description: 'Browse through our wide range of premium services, from professional cleaning to complex property maintenance.',
      icon: faSearch,
      color: '#F59331'
    },
    {
      id: 3,
      title: 'Dynamic Scheduling',
      description: 'Select your preferred date and time. Our system matches you with the best available professional in your area.',
      icon: faCalendarCheck,
      color: '#292760'
    },
    {
      id: 4,
      title: 'Service Execution',
      description: 'Our certified professionals arrive and complete the task with the highest quality standards and attention to detail.',
      icon: faWandMagicSparkles,
      color: '#F59331'
    },
    {
      id: 5,
      title: 'Secure Payment',
      description: 'Pay safely through our integrated payment system only after the service is successfully completed.',
      icon: faCreditCard,
      color: '#292760'
    },
    {
      id: 6,
      title: 'Rate & Review',
      description: 'Share your experience to help us maintain our high-quality standards and help others in the community.',
      icon: faStar,
      color: '#F59331'
    }
  ];

  return (
    <div className="how-we-work-container">
      {/* Hero Section */}
      <section className="py-5 text-center bg-white border-bottom">
        <div className="container py-4">
          <span className="badge px-3 py-2 mb-3 rounded-pill" style={{ backgroundColor: 'var(--bg-success-light)', color: 'var(--color-accent-dark)', fontWeight: '600' }}>
            Our Process
          </span>
          <h1 className="fw-bold display-4 mb-3" style={{ color: 'var(--color-primary)' }}>How Turnivo Works</h1>
          <p className="text-muted mx-auto fs-5" style={{ maxWidth: '700px' }}>
            We've simplified the process of home maintenance and cleaning. Follow these simple steps to experience premium service.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 position-relative">
            {/* Connection Line (Desktop) */}
            <div className="d-none d-lg-block position-absolute start-50 translate-middle-x h-75" style={{ width: '2px', borderLeft: '2px dashed #CBD5E1', top: '12%', zIndex: 0 }}></div>
            
            {steps.map((step, index) => (
              <div key={step.id} className={`col-12 d-flex align-items-center mb-5 position-relative ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`} style={{ zIndex: 1 }}>
                {/* Content Side */}
                <div className="col-lg-5">
                  <div className={`p-4 bg-white rounded-4 shadow-sm border step-card transition-all ${index % 2 === 0 ? 'text-end' : 'text-start'}`}>
                    <h3 className="fw-bold mb-3" style={{ color: step.color }}>{step.title}</h3>
                    <p className="text-muted mb-0 lh-lg">{step.description}</p>
                  </div>
                </div>

                {/* Number/Icon Divider */}
                <div className="col-lg-2 d-none d-lg-flex justify-content-center align-items-center">
                  <div className="rounded-circle d-flex align-items-center justify-content-center shadow" 
                       style={{ width: '60px', height: '60px', backgroundColor: step.color, color: 'white', border: '4px solid white', fontSize: '1.2rem' }}>
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                </div>

                {/* Empty Side for Desktop */}
                <div className="col-lg-5 d-none d-lg-block"></div>

                {/* Mobile View Adjustment (Small screen icon) */}
                <div className="d-lg-none position-absolute start-0 top-0 translate-middle-y ms-3" style={{ zIndex: 2 }}>
                   <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                       style={{ width: '40px', height: '40px', backgroundColor: step.color, color: 'white' }}>
                    {step.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>Why Choose Turnivo?</h2>
            <div className="mx-auto bg-primary" style={{ height: '3px', width: '60px', borderRadius: '2px' }}></div>
          </div>
          
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="p-4 rounded-4 transition-all hover-bg-light">
                <div className="mb-3 fs-1" style={{ color: 'var(--color-secondary)' }}>🛡️</div>
                <h5 className="fw-bold">Trusted Professionals</h5>
                <p className="text-muted">Every provider is strictly vetted and background-checked for your peace of mind.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 transition-all hover-bg-light">
                <div className="mb-3 fs-1" style={{ color: 'var(--color-secondary)' }}>✨</div>
                <h5 className="fw-bold">Quality Guaranteed</h5>
                <p className="text-muted">Not satisfied? We will re-execute the service at no extra cost to you.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 rounded-4 transition-all hover-bg-light">
                <div className="mb-3 fs-1" style={{ color: 'var(--color-secondary)' }}>📱</div>
                <h5 className="fw-bold">Seamless Experience</h5>
                <p className="text-muted">Manage all your bookings, payments, and communication from one simple platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .step-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        }
        .hover-bg-light:hover {
          background-color: var(--bg-secondary);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default HowWeWorkMain;
