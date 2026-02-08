import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      <style jsx>{`
        /* Hide Bootstrap's default navbar-toggler-icon */
        .navbar-toggler-icon {
          background-image: none !important;
        }
        
        /* Style for the FontAwesome icon */
        .navbar-toggler {
          border: none;
          padding: 0.25rem 0.5rem;
        }
        
        .navbar-toggler:focus {
          box-shadow: none;
        }
      `}</style>
      
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          {/* Logo and Brand */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img 
              src="/assets/logo.png" 
              alt="Logo" 
              height="40" 
              className="me-2"
            />
          </Link>

          {/* Mobile menu toggle */}
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={toggleMobileMenu}
            aria-controls="navbarNav"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <FontAwesomeIcon 
              icon={isMobileMenuOpen ? faTimes : faBars} 
              className="navbar-toggler-icon"
            />
          </button>

          {/* Collapsible content */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            {/* Navigation items on the left */}
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/services')}`} to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/how-we-work')}`} to="/how-we-work">How we work</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/contact')}`} to="/contact">Contact us</Link>
              </li>
            </ul>

            {/* Buttons on the right */}
            <div className="d-flex gap-2 align-items-md-center flex-column flex-lg-row mt-3 mt-lg-0 align-items-start">
              <Link to='/join-confirm-page' className="main-btn rounded-2 px-3 py-2 text-decoration-none">
                Join as a service provider
              </Link>
              <Link to='/login' className="sec-btn rounded-2 px-4 py-2 text-decoration-none">
                Login
              </Link>
              <Link className="create-account-btn" to="/activation-code">
                Creating an account
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;