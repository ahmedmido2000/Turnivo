import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faBars, faDownload } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmark } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Swal from 'sweetalert2';
import { getTrainings } from '../../api/trainingApi';
import ProviderHeader from './ProviderHeader';
const DashboardTrainingMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  

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

  // Fetch training list
  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please login to continue',
          });
          return;
        }

        const response = await getTrainings(accessToken);

        if (response.status === 1) {
          const list = Array.isArray(response.data)
            ? response.data?.[0]?.items || []
            : response.data?.items || response.data?.[0]?.items || [];
          setTrainings(list);
          setFilteredTrainings(list);
        } else {
          setTrainings([]);
          setFilteredTrainings([]);
        }
      } catch (error) {
        console.error('Error fetching trainings:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to load trainings',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTrainings(trainings);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = trainings.filter((item) => {
      const title = (item.title || item.name || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      return title.includes(term) || description.includes(term);
    });

    setFilteredTrainings(filtered);
  }, [searchTerm, trainings]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getExcerpt = (html) => {
    if (!html) return '';
    const text = html.replace(/<[^>]+>/g, '');
    return text.slice(0, 160);
  };



  return (
    <section>
      <ProviderHeader title="add training" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
                      <div className="search-input-wrapper mt-2">
            <SearchOutlinedIcon className="search-icon" />
            <input
              type="text"
              className="search-gray-input form-control"
              placeholder="Find a request..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="row g-0 g-lg-2 mt-3">
          {isLoading && (
            <div className="col-12">
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          )}

          {!isLoading && filteredTrainings.length === 0 && (
            <div className="col-12">
              <div className="text-center py-4">
                <p className="m-0">No trainings found.</p>
              </div>
            </div>
          )}

          {!isLoading && filteredTrainings.map((item) => (
            <div className="col-md-6 mb-2" key={item.id || item.title}>
              <Link 
                to={`/supervisor/training-details?id=${item.id}`}
                className="card text-decoration-none rounded-top-4 h-100 training-card"
              >
                <img
                  src={item.image || '/assets/training-card-img.png'}
                  className="training-card-img img-fluid w-100 rounded-top-4"
                  alt={item.title || 'training'}
                />

                <div className="card-body p-2 d-flex flex-column">
                  <div className="training-card-title mb-2">
                    {item.title || item.name || 'Training title'}
                  </div>

                  <div className="training-card-desc mb-2">
                    {getExcerpt(item.content || item.description) || 'No description available.'}
                  </div>

                  <div className="card-actions d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <ThumbDownOffAltOutlinedIcon />
                      <ThumbUpOffAltOutlinedIcon />
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <FontAwesomeIcon icon={faDownload} className="fs-5" />
                      <FontAwesomeIcon icon={faBookmark} className="fs-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default DashboardTrainingMain;