import React, { useState, useEffect } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import { getPendingTeam, acceptUser, rejectUser } from '../../api/superviserTeamApi';
import { useSelector } from 'react-redux';
import ProviderHeader from './ProviderHeader';

const TeamWorkRequestsMain = ({ onMobileMenuClick }) => {
  const { token: accessToken } = useSelector((state) => state.auth);
  const [pendingTeam, setPendingTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch pending team data
  const fetchPendingTeam = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const response = await getPendingTeam(accessToken);
      if (response.status === 1 && response.data?.[0]?.items) {
        setPendingTeam(response.data[0].items);
      }
    } catch (error) {
      console.error('Failed to fetch pending team:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTeam();
  }, [accessToken]);

  const handleAccept = async (userId) => {
    try {
      await acceptUser(accessToken, userId);
      fetchPendingTeam(); // Refresh list
    } catch (error) {
      console.error('Failed to accept user:', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectUser(accessToken, userId);
      fetchPendingTeam(); // Refresh list
    } catch (error) {
      console.error('Failed to reject user:', error);
    }
  };

  const handleViewProfile = (member) => {
    // Use the member data directly
    setSelectedMember(member);
    setShowModal(true);
  };

  const filteredRequests = pendingTeam.filter((item) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    const fullName = `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase();
    const email = (item.email || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const company = (item.company || '').toLowerCase();
    return fullName.includes(term) || email.includes(term) || phone.includes(term) || company.includes(term);
  });

  return (
    <section>
      <ProviderHeader title="Team Requests" onMobileMenuClick={onMobileMenuClick} />
      <div className="dashboard-home-content px-3 mt-2">
        <div className="d-flex justify-content-between align-items-center">
        <div className="search-input-wrapper mb-3 mt-2">
          <SearchOutlinedIcon className="search-icon" />
          <input
            type="text"
            className="search-gray-input form-control"
            placeholder="Search for a worker"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
          <div className="d-flex gap-2 align-items-center flex-wrap">
                      <Link to='/supervisor/team-work-add-employee' className='text-decoration-none'>
                      <button 
            type="submit" 
            className="sec-btn rounded-2 py-2 px-3 d-flex align-items-center justify-content-center gap-2 w-50-100"
          >
            <span>Add an employee</span>
                        </button>
            </Link>
          </div>


        </div>
        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((item) => (
              <div className="col-md-6 mb-3" key={item.id}>
                <div className="bg-light-gray p-3 rounded-4 h-100 d-flex gap-3 align-items-center position-relative hover-shadow transition-all" onClick={() => handleViewProfile(item)} style={{cursor: 'pointer', border: '1px solid #eee'}}>
                  <img src={item.user?.avatar || "/assets/team-img.png"} className='img-fluid rounded-circle shadow-sm' alt="service" style={{width: '90px', height: '90px', objectFit: 'cover'}} />
                  <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <h2 className="mb-0 dashboard-title fs-5 fw-bold">{item.first_name} {item.last_name}</h2>
                      <div className="d-flex align-items-center gap-1 bg-white px-2 py-1 rounded-pill shadow-sm">
                        <img src="/assets/flag-2.svg" className='flag-icon' alt="flag" style={{width: '14px'}} />
                        <span className='training-details-card-desc m-0 small fw-medium text-dark'>{item.company || 'Member'}</span>
                      </div>
                    </div>
                    <p className='m-0 mt-2 team-request-desc text-muted small'>Applied to join your timeline</p>
                    <div className="d-flex gap-2 mt-3">
                      <button className="sec-btn rounded-pill px-3 py-1 fs-6 flex-grow-1" onClick={(e) => { e.stopPropagation(); handleAccept(item.user?.id); }}>
                        Accept
                      </button>
                      <button className="btn btn-outline-danger rounded-pill px-3 py-1 fs-6 flex-grow-1" onClick={(e) => { e.stopPropagation(); handleReject(item.user?.id); }}>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="mb-3">
                <img src="/assets/people.svg" alt="No data" style={{ width: '80px', opacity: 0.2 }} />
              </div>
              <h5 className="text-muted fw-normal">No pending requests found</h5>
            </div>
          )}
        </div>

        {/* Profile Modal */}
        {showModal && selectedMember && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
            <div className="modal-dialog modal-dialog-centered" style={{maxWidth: '550px'}} onClick={(e) => e.stopPropagation()}>
              <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
                <div className="modal-header border-0 pb-0 pt-4 px-4">
                  <h5 className="modal-title fw-bold text-dark">Applicant Profile</h5>
                  <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  {/* Profile Header */}
                  <div className="text-center mb-4 p-4 bg-light-gray rounded-4">
                    <div className="position-relative d-inline-block">
                      <img src={selectedMember.user?.avatar || "/assets/user.png"} alt="Avatar" className="rounded-circle border border-4 border-white shadow" style={{width: '110px', height: '110px', objectFit: 'cover'}} />
                      <div className="position-absolute bottom-0 end-0 bg-success border border-3 border-white rounded-circle p-2 shadow-sm" style={{width: '20px', height: '20px'}}></div>
                    </div>
                    <h4 className="mt-3 mb-1 fw-bold text-dark">{selectedMember.first_name} {selectedMember.last_name}</h4>
                    <span className="badge bg-warning text-dark rounded-pill px-3 py-1 fw-medium shadow-sm">
                      {selectedMember.company || 'Team Member'}
                    </span>
                  </div>

                  {/* Profile Details Grid */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 bg-light-gray rounded-3 border-bottom border-warning border-3 h-100">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '10px', letterSpacing: '1px'}}>Email Address</small>
                        <p className="mb-0 fw-medium text-dark text-truncate">{selectedMember.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light-gray rounded-3 border-bottom border-warning border-3 h-100">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '10px', letterSpacing: '1px'}}>Phone Number</small>
                        <p className="mb-0 fw-medium text-dark">{selectedMember.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="p-3 bg-light-gray rounded-3 border-bottom border-warning border-3 h-100">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '10px', letterSpacing: '1px'}}>Primary Address</small>
                        <p className="mb-0 fw-medium text-dark">{selectedMember.address || 'No address provided'}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light-gray rounded-3 border-bottom border-warning border-3 h-100">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '10px', letterSpacing: '1px'}}>Experience Level</small>
                        <p className="mb-0 fw-medium text-dark">{selectedMember.experience ? `${selectedMember.experience} Years` : 'Fresh'}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light-gray rounded-3 border-bottom border-warning border-3 h-100">
                        <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{fontSize: '10px', letterSpacing: '1px'}}>Start Date</small>
                        <p className="mb-0 fw-medium text-dark">{selectedMember.start_date || 'TBD'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons in Modal */}
                  <div className="d-flex gap-3 mt-4 pt-2">
                    <button className="sec-btn rounded-pill py-2 px-4 flex-grow-1 shadow-sm fs-6" onClick={() => { handleAccept(selectedMember.user?.id); setShowModal(false); }}>
                      Accept Application
                    </button>
                    <button className="btn btn-outline-danger rounded-pill py-2 px-4 flex-grow-1 shadow-sm fs-6" onClick={() => { handleReject(selectedMember.user?.id); setShowModal(false); }}>
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .transition-all { transition: all 0.3s ease; }
        .hover-shadow:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          border-color: #F59331 !important;
        }
        .col-20-per { width: 20%; }
        @media (max-width: 992px) { .col-20-per { width: 50%; } }
      `}</style>
    </section>
  );
};

export default TeamWorkRequestsMain;