import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faBars,
  faUser,
  faLocationDot,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Person, Settings, Logout } from "@mui/icons-material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import { Link } from "react-router-dom";

const DashboardAddWorkEmpMain = ({ onMobileMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // State for employee image
  const [employeeImage, setEmployeeImage] = useState("/assets/user.png");
  const fileInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image/jpeg') && !file.type.match('image/jpg') && 
          !file.type.match('image/png') && !file.type.match('image/gif')) {
        alert('Please upload a valid image file (jpg, jpeg, png, or gif)');
        return;
      }
      
      // Check file size (800 kB = 800 * 1024 bytes)
      if (file.size > 800 * 1024) {
        alert('Image size should not exceed 800 kB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setEmployeeImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    
    // Reset the input value to allow uploading the same file again
    e.target.value = '';
  };

  // Handle image delete
  const handleImageDelete = () => {
    setEmployeeImage("/assets/user.png");
  };

  // Trigger file input when upload button is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <section>
      <div className="dashboard-main-nav px-3 py-1">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <button
              className="mobile-menu-btn"
              onClick={onMobileMenuClick}
              aria-label="Toggle menu">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h2 className="mb-0 dashboard-title">Work team</h2>
          </div>
          <div className="d-flex justify-content-end gap-2 align-items-center">
            <div className="dashboard-lang-btn d-flex gap-1 align-items-center">
              <img src="/assets/global.svg" alt="notification" />
              <span>English</span>
            </div>
            <Link to='/provider/notifications' className="notification-icon-container">
              <img src="/assets/notification.svg" alt="notification" />
            </Link>

            {/* User Profile Dropdown */}
            <div
              className="user-dropdown-container d-none d-md-block"
              ref={dropdownRef}>
              <div
                className="user-profile-trigger d-flex gap-2 align-items-center"
                onClick={toggleDropdown}>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`dropdown-chevron ${isDropdownOpen ? "open" : ""}`}
                />
                <span className="user-name">Omar Alrajhi</span>
                <img
                  src="/assets/user.png"
                  alt="User Profile"
                  className="user-avatar-small"
                />
              </div>

              {isDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div
                    className="dropdown-item d-flex gap-2 align-items-center"
                    onClick={() => handleDropdownItemClick("profile")}>
                    <img src="/assets/user-square.svg" alt="settings" />
                    <span>Profile</span>
                  </div>
                  <div
                    className="dropdown-item d-flex gap-2 align-items-center"
                    onClick={() => handleDropdownItemClick("settings")}>
                    <img src="/assets/setting-icon.svg" alt="settings" />
                    <span>Settings</span>
                  </div>
                  <div
                    className="dropdown-item d-flex gap-2 align-items-center"
                    onClick={() => handleDropdownItemClick("logout")}>
                    <img src="/assets/logout-icon.svg" alt="settings" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-home-content px-3 mt-2">
        <h2 className="mb-0 property-problem-title">Add an employee</h2>
        <h6 className="service-desc mt-3">Basic information</h6>
        <div className="bg-light-gray p-3 rounded-3 h-100 d-flex gap-2 align-items-center">
          <div className="position-relative">
            <img src={employeeImage} className="employee-profile-img" alt="user" />

          </div>
          <div className="d-flex flex-column">
            <div className="d-flex gap-3 align-items-center">
              <button 
                className="sec-btn rounded-2 px-md-4 px-2 py-2" 
                onClick={triggerFileInput}
              >
                add new photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg, image/jpg, image/png, image/gif"
                onChange={handleImageUpload}
              />
              {employeeImage !== "/assets/user.png" && (
                <img
                  src="/assets/delete.svg"
                  className="del-icon"
                  alt="delete"
                  onClick={handleImageDelete}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
            <p className="m-0 upload-info mt-1">
              Allowed jpg, gif or png, maximum size 800 kB
            </p>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <label className="form-label mb-1">first name</label>
              <input
                type="text"
                className="form-control rounded-2 py-2 px-3 w-100"
                placeholder="Omar"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 w-100">
              <label className="form-label mb-1">last name</label>
              <input
                type="text"
                className="form-control rounded-2 py-2 px-3 w-100"
                placeholder="Alrajihi"
              />
            </div>
          </div>
          <div className="col-12">
              <label className="form-label mb-1">Email</label>
            <div className="mb-3 w-100 search-input-wrapper">
              <img src="/assets/sms.svg" className="search-icon" alt="sms" />
              <input
                type="email"
                className="form-control rounded-2 py-2 ps-5 px-3 w-100"
                placeholder="Omaralrajihi@gmail.com"
              />
            </div>
          </div>
          <div className="col-12">
              <label className="form-label mb-1">Phone number</label>
            <div className="mb-3 w-100 search-input-wrapper">
                            <img src="/assets/call.svg" className="search-icon" alt="call" />

              <input
                type="text"
                className="form-control rounded-2 ps-5 py-2 px-3 w-100"
                placeholder="+299 876 434 999"
              />
            </div>
          </div>
          <div className="col-12">
              <label className="form-label mb-1">Address</label>
            <div className="mb-3 w-100 search-input-wrapper">
                                          <img src="/assets/location-3.svg" className="search-icon" alt="call" />
              <input
                type="text"
                className="form-control rounded-2 py-2 ps-5 px-3 w-100"
                placeholder="Enter address"
              />
            </div>
          </div>
            <h6 className="service-desc mb-3">Job information</h6>
          <div className="col-12">
                <div className="position-relative mb-3">
                    <label className="form-label mb-1">Job title</label>
                    <select
                      id="propertyType"
                      className="form-select custom-select-bs py-2"
                      defaultValue=""
                      required
                    >
                      <option value="Upholstery cleaning">Upholstery cleaning</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
          </div>
          <div className="col-md-6">
                <div className="position-relative mb-3">
                    <label className="form-label mb-1">Contract type</label>
                    <select
                      id="propertyType"
                      className="form-select custom-select-bs py-2"
                      defaultValue=""
                      required
                    >
                      <option value="full time">full time</option>
                    </select>

                    {/* Bootstrap Icon */}
                    <i className="bi bi-chevron-down select-bs-icon"></i>
                  </div>
          </div>
            <div className="col-md-6">
            <div className="mb-3 w-100">
              <label className="form-label mb-1">Employment history</label>
              <input
                type="date"
                className="form-control rounded-2 py-2 px-3 w-100"
              />
            </div>
          </div>
          <div className="col-12">
                                  <button 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center justify-content-center gap-2 w-50-100"
          >
            <span>Add an employee</span>
                        </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardAddWorkEmpMain;