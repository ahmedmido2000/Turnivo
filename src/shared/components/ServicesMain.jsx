import React from 'react';
import { useServices } from '../../hooks/useSite';
import { Spinner } from 'react-bootstrap';

const ServicesMain = () => {
  const { data, isLoading, isError } = useServices();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">Failed to load services</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  // Extract services from the new lists endpoint response
  const services = data?.data?.[0]?.AdditionService || [];

  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="text-center mb-5 mt-4">
          <span className="badge px-3 py-2 mb-3 rounded-pill" style={{ backgroundColor: 'var(--bg-success-light)', color: 'var(--color-accent-dark)', fontWeight: '600' }}>
            Available Services
          </span>
          <h2 className="fw-bold mb-3 display-5" style={{ color: 'var(--color-primary)' }}>Our Premium Services</h2>
          <div className="mx-auto bg-primary mb-4" style={{ height: '3px', width: '60px', borderRadius: '2px' }}></div>
          <p className="text-muted mx-auto fs-5" style={{ maxWidth: '700px' }}>
            Discover a wide range of professional home and property services tailored to meet your high standards.
          </p>
        </div>

        <div className="row g-4 mb-5">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={service.id || index} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden service-card transition-all">
                  <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                    <img 
                      src={service.image || '/assets/default-service.jpg'} 
                      alt={service.name} 
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onError={(e) => { e.target.src = '/assets/home-1.avif'; }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-3 fw-bold">
                        {service.price} {service.currency || '€'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h4 className="card-title fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>
                      {service.name}
                    </h4>
                    <p className="card-text text-muted mb-4 flex-grow-1" style={{ fontSize: 'var(--font-size-base)', lineHeight: '1.6' }}>
                      {service.body || "Professional high-quality service guaranteed by our experienced team member experts."}
                    </p>
                    <div className="d-grid mt-2">
                      <button className="main-btn py-2 px-4 rounded-3 fw-bold">
                        Book Service
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="p-5 rounded-4 bg-white shadow-sm border">
                <p className="text-muted fs-5 mb-0">No services available at the moment. Please check back later.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        .service-card:hover img {
          transform: scale(1.1);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ServicesMain;
