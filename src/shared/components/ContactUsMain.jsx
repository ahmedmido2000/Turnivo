import React, { useState } from 'react';
import { useContactMutation } from '../../hooks/useSite';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const ContactUsMain = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    body: ''
  });

  const contactMutation = useContactMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile field, only allow numbers
    if (name === 'mobile') {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.body) {
      toast.error('Please fill in all required fields');
      return;
    }

    contactMutation.mutate(formData, {
      onSuccess: (data) => {
        if (data.status === 1) {
          toast.success(data.message || 'Message sent successfully!');
          setFormData({ name: '', mobile: '', email: '', body: '' });
        } else {
          toast.error(data.message || 'Failed to send message');
        }
      },
      onError: () => {
        toast.error('Something went wrong. Please try again later.');
      }
    });
  };

  return (
    <div className="py-5 bg-white">
      <div className="container">
        <div className="row g-5">
          {/* Contact Information */}
          <div className="col-lg-5">
            <h2 className="fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>Get in Touch</h2>
            <p className="text-muted mb-5">
              Have questions about our services or need support? Our team is here to help you.
            </p>

            <div className="d-flex flex-column gap-4">
              <div className="d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px', backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)' }}>
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Phone</h6>
                  <p className="mb-0 text-muted">06272167182</p>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px', backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)' }}>
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Email</h6>
                  <p className="mb-0 text-muted">onnext@gmail.com</p>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '50px', height: '50px', backgroundColor: 'var(--bg-secondary)', color: 'var(--color-primary)' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Address</h6>
                  <p className="mb-0 text-muted">4517 Washington Ave, Manchester</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="p-4 p-md-5 shadow-sm rounded-3 border">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control py-2 px-3 rounded-2"
                      placeholder="John Doe"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control py-2 px-3 rounded-2"
                      placeholder="+1 (555) 000-0000"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control py-2 px-3 rounded-2"
                      placeholder="name@example.com"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium">Message Body</label>
                    <textarea 
                      className="form-control py-2 px-3 rounded-2" 
                      rows="5"
                      placeholder="How can we help you?"
                      name="body"
                      value={formData.body}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="main-btn w-100 py-3 rounded-2 fw-bold"
                      disabled={contactMutation.isPending}
                    >
                      {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsMain;
