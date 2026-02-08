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

const CompanyPoliciesMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [policyData, setPolicyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  // Fetch policy data
  useEffect(() => {
    const fetchPolicyData = async () => {
      try {
        setIsLoading(true);
        const response = await getTerms(1); // ID 1 for Company Policies
        if (response.status === 1 && response.data && response.data.length > 0) {
          setPolicyData(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching policy data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load company policies',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicyData();
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
      <ProviderHeader title="Company Policies" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
            <div className="d-flex flex-column gap-2 align-items-center justify-content-center text-center p-md-5 p-4">
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : policyData ? (
                  <>
                    <h1 className='policy-title m-0'>{policyData.title}</h1>
                    <div 
                      className="policy-container"
                      dangerouslySetInnerHTML={{ __html: policyData.content }}
                    />
                  </>
                ) : (
                  <div className="text-center py-5">
                    <p>No policy data available</p>
                  </div>
                )}
            </div>
      </div>
    </section>
  );
};

export default CompanyPoliciesMain;
