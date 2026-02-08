import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Solid Icons (none needed now)
// import { 
//   faPhone, 
//   faMapMarkerAlt, 
// } from '@fortawesome/free-solid-svg-icons'; // No longer needed
// Regular (outlined) Icons (for envelope)
import { 
  faEnvelope as faEnvelopeRegular,
} from '@fortawesome/free-regular-svg-icons';
// Brand Icons (for social media)
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn, 
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';
// Material-UI Icons (for outlined phone and location)
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          {/* Left Column - Logo, Description and Payment Methods */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="mb-4">
              <img 
                src="/assets/logo.png" 
                alt="ONS Logo" 
                height="70" 
                className="mb-3"
              />
              <p className="footer-description mb-3">
                Reliable home services with high quality! Contact us anytime. 📞 ✨
              </p>
              <div className="d-flex gap-2 flex-wrap mt-3">
                <img src="/assets/pay-1.png" alt="PayPal" height="50" />
                <img src="/assets/pay-2.png" alt="Mastercard" height="50" />
                <img src="/assets/pay-3.png" alt="VISA" height="50" />
              </div>
            </div>
          </div>
          
          {/* Second Column - Basic Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="mb-3 footer-title">Basic Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-white text-decoration-none footer-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-white text-decoration-none footer-link">
                  Services
                </Link>
              </li>
             
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none footer-link">
                  Contact us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-white text-decoration-none footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-white text-decoration-none footer-link">
                  Terms and conditions
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Third Column - Contact Us */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3 footer-title">Contact us</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center footer-link">
                {/* Replaced FontAwesome with Material-UI Icon */}
                <LocalPhoneOutlinedIcon className="me-2 fs-5 contact-icon" />
                06272167182
              </li>
              <li className="mb-2 d-flex align-items-center footer-link">
                <FontAwesomeIcon icon={faEnvelopeRegular} className="me-2 contact-icon" />
                onnext@gmail.com
              </li>
              <li className="mb-2 d-flex align-items-start footer-link">
                {/* Replaced FontAwesome with Material-UI Icon */}
                <LocationOnOutlinedIcon className="me-2 fs-5 mt-1 contact-icon" />
                4517 Washington Ave
              </li>
            </ul>
          </div>
          
          {/* Fourth Column - Subscribe and Social Media */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3 footer-title">Subscribe</h5>
            <div className="position-relative">
              <input 
                type="email" 
                className="form-control rounded-2 py-2 ps-5" 
                placeholder="Enter your email"
                aria-label="Your email"
              />
              <div className="position-absolute" style={{ top: '50%', left: '15px', transform: 'translateY(-50%)' }}>
                <FontAwesomeIcon icon={faEnvelopeRegular} style={{ color: '#A6A6A6' }} />
              </div>
            </div>
            
            <div className="mt-4">
              <p className="mb-3 footer-title">Follow us:</p>
              <div className="d-flex gap-3">
                <a href="#" className="text-white footer-links-container">
                  <FontAwesomeIcon icon={faFacebookF} className="fs-5" />
                </a>
                <a href="#" className="text-white footer-links-container">
                  <FontAwesomeIcon icon={faWhatsapp} className="fs-5" />
                </a>
                <a href="#" className="text-white footer-links-container">
                  <FontAwesomeIcon icon={faLinkedinIn} className="fs-5" />
                </a>
                <a href="#" className="text-white footer-links-container">
                  <FontAwesomeIcon icon={faInstagram} className="fs-5" />
                </a>
                <a href="#" className="text-white footer-links-container">
                  <FontAwesomeIcon icon={faTwitter} className="fs-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 footer-copyright">© 2025 ONS - All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;