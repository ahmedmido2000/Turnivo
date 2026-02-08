import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars } from '@fortawesome/free-solid-svg-icons';
import { Person, Settings, Logout } from '@mui/icons-material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { Link } from 'react-router-dom';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import { getTerms } from '../../api/cleanerApi';
import Swal from 'sweetalert2';
import ProviderHeader from './ProviderHeader';

const WorkAgreementMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [agreementData, setAgreementData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  // Fetch agreement data
  useEffect(() => {
    const fetchAgreementData = async () => {
      try {
        setIsLoading(true);
        const response = await getTerms(2); // ID 2 for Work Agreement
        if (response.status === 1 && response.data && response.data.length > 0) {
          setAgreementData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching agreement data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load work agreement',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgreementData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownItemClick = (item) => {
    console.log(`Clicked on ${item}`);
    setIsDropdownOpen(false);
    // Add your navigation logic here
  };



  return (
    <section>
      <ProviderHeader title="Work Agreement" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
            <div className="d-flex flex-column gap-2 align-items-center justify-content-center text-center p-md-5 p-4">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : agreementData ? (
                  <>
                    <h1 className='policy-title m-0'>{agreementData.title}</h1>
                    <div 
                      className="policy-container"
                      dangerouslySetInnerHTML={{ __html: agreementData.content }}
                    />
                  </>
                ) : (
                  <div className="text-center py-5">
                    <p>No agreement data available</p>
                  </div>
                )}
            </div>
      </div>
    </section>
  );
};

export default WorkAgreementMain;
