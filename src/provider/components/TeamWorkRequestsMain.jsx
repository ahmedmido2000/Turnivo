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
          ) : pendingTeam.length > 0 ? (
            pendingTeam.map((item) => (
              <div className="col-md-6 mb-3" key={item.id}>
                <div className="bg-light-gray p-3 rounded-3 h-100 d-flex gap-2 align-items-center" onClick={() => handleViewProfile(item)} style={{cursor: 'pointer'}}>
                  <img src={item.user?.avatar || "/assets/team-img.png"} className='img-fluid team-img-2' alt="service" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                  <div className="d-flex flex-column">
                    <h2 className="mb-0 dashboard-title pb-2 ps-1">{item.first_name} {item.last_name}</h2>
                    <div className="d-flex align-items-center gap-1">
                      <img src="/assets/flag-2.svg" className='flag-icon' alt="flag" />
                      <h3 className='training-details-card-desc m-0'>{item.company || 'Team Member'}</h3>
                    </div>
                    <p className='m-0 mt-1 ms-1 team-request-desc'>Asks to join your timeline</p>
                    <div className="d-flex gap-2 mt-1">
                      <button className="sec-btn rounded-2 px-4 py-2" onClick={(e) => { e.stopPropagation(); handleAccept(item.user?.id); }}>
                        Accept
                      </button>
                      <button className="btn btn-outline-danger py-2" onClick={(e) => { e.stopPropagation(); handleReject(item.user?.id); }}>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">No pending requests</div>
          )}
        </div>

        {/* Profile Modal */}
        {showModal && selectedMember && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Applicant Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-3">
                    <img src={selectedMember.user?.avatar || "/assets/user.png"} alt="Avatar" className="rounded-circle" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                    <h4 className="mt-2">{selectedMember.first_name} {selectedMember.last_name}</h4>
                  </div>
                  <div className="row g-3">
                    {selectedMember.email && <div className="col-md-6"><p><strong>Email:</strong> {selectedMember.email}</p></div>}
                    {selectedMember.phone && <div className="col-md-6"><p><strong>Phone:</strong> {selectedMember.phone}</p></div>}
                    {selectedMember.address && <div className="col-12"><p><strong>Address:</strong> {selectedMember.address}</p></div>}
                    {selectedMember.company && <div className="col-md-6"><p><strong>Company:</strong> {selectedMember.company}</p></div>}
                    {selectedMember.experience && <div className="col-md-6"><p><strong>Experience:</strong> {selectedMember.experience} Years</p></div>}
                    {selectedMember.start_date && <div className="col-md-6"><p><strong>Start Date:</strong> {selectedMember.start_date}</p></div>}
                    {selectedMember.created_at && <div className="col-md-6"><p><strong>Applied:</strong> {selectedMember.created_at}</p></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamWorkRequestsMain;