import React from 'react';
import DashboardChart1 from './DashboardChart1';
import DashboardChart2 from './DashboardChart2';
import ClientHeader from './ClientHeader';

const DashboardMain = ({ onMobileMenuClick }) => {
  return (
    <section>
        <ClientHeader title="Dashboard" onMobileMenuClick={onMobileMenuClick} />
        <div className="dashboard-home-content px-3 mt-2">
            <h4 className="dashboard-home-title mb-1">Welcome to Turnivo Dashboard !</h4>
            <h6 className="dashboard-home-desc m-0">Manage your short-term  rental operations seamlessly.</h6>
            <div className="row">
                <div className="col-lg-3 col-md-6 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-3 align-tems-start sec-border-1">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="dashboard-home-card-title dashboard-home-card-title-1 mb-0">Active Booking</h5>
                            <img src="/assets/dashboard-card-icon-1.svg" alt="icon" />
                        </div>
                        <h5 className='dashboard-home-card-number dashboard-home-card-number-1 mb-0'>08</h5>
                        <h5 className='dashboard-home-card-desc dashboard-home-card-desc-1 mb-0'>+ 2 from yesterday</h5>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-3 align-tems-start sec-border-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="dashboard-home-card-title dashboard-home-card-title-2 mb-0">Pending Check-ins</h5>
                            <img src="/assets/dashboard-card-icon-2.svg" alt="icon" />
                        </div>
                        <h5 className='dashboard-home-card-number dashboard-home-card-number-2 mb-0'>03</h5>
                        <h5 className='dashboard-home-card-desc dashboard-home-card-desc-2 mb-0'>Next 24 h</h5>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-3 align-tems-start sec-border-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="dashboard-home-card-title dashboard-home-card-title-3 mb-0">Open Tasks</h5>
                            <img src="/assets/dashboard-card-icon-3.svg" alt="icon" />
                        </div>
                        <h5 className='dashboard-home-card-number dashboard-home-card-number-3 mb-0'>07</h5>
                        <h5 className='dashboard-home-card-desc dashboard-home-card-desc-3 mb-0'>Requires attention</h5>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-3 align-tems-start sec-border-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="dashboard-home-card-title dashboard-home-card-title-4 mb-0">System Alerts</h5>
                            <img src="/assets/dashboard-card-icon-4.svg" alt="icon" />
                        </div>
                        <h5 className='dashboard-home-card-number dashboard-home-card-number-4 mb-0'>01</h5>
                        <h5 className='dashboard-home-card-desc dashboard-home-card-desc-4 mb-0'>Critical issue</h5>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-3 align-tems-start">
                        <div className="d-flex gap-1 align-items-center">
                            <img src="/assets/dashboard-card-icon-5.svg" alt="icon" />
                            <h5 className="dashboard-home-card-2-title mb-0">Check in / Check out</h5>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">
                            <div>
                                <h6 className="dashboard-home-card-2-desc-1">Checkin with access code 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <h6 className="dashboard-home-card-2-desc-2 m-0">Checked-in : Today, 02:30 PM</h6>
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard-card-btn-1">View Details</div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">
                            <div>
                                <h6 className="dashboard-home-card-2-desc-1">Checkin with access code 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <h6 className="dashboard-home-card-2-desc-2 m-0">Checked-in : Today, 02:30 PM</h6>
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard-card-btn-1">Manage</div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">
                            <div>
                                <h6 className="dashboard-home-card-2-desc-1">Checkin with access code 22333 at 12:00</h6>
                                <div className="d-flex align-items-center gap-1">
                                    <h6 className="dashboard-home-card-2-desc-2 m-0">Checked-in : Today, 02:30 PM</h6>
                                    <div className="d-flex align-items-center gap-1">
                                        <img src="/assets/dashboard-card-icon-8.svg" alt="icon" />
                                        <p className="dashboard-home-card-2-desc-3 m-0">05 / 03 / 2025</p>
                                    </div>
                                </div>
                            </div>
                            <div className="btn btn-danger py-2 px-1">Follow Up</div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-3 align-tems-start">
                        <div className="d-flex gap-1 align-items-center">
                            <img src="/assets/dashboard-card-icon-6.svg" alt="icon" />
                            <h5 className="dashboard-home-card-2-title mb-0">Smart Locks Overview</h5>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-center flex-wrap">
                            <h6 className="dashboard-home-card-2-title-1">Sunny illa Main Door</h6>
                            <div className="dashboard-card-badge-1">Locked</div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-center flex-wrap">
                            <h6 className="dashboard-home-card-2-title-1">Sunny illa Main Door</h6>
                            <div className="dashboard-card-badge-2">Open</div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-center flex-wrap">
                            <h6 className="dashboard-home-card-2-title-1">Sunny illa Main Door</h6>
                            <div className="dashboard-card-badge-1">Locked</div>
                        </div>
                        <a href='#' className="dashboard-card-link">
                            View All Locks
                        </a>
                    </div>
                </div>
                <div className="col-md-4 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-2 align-tems-start">
                        <div className="d-flex gap-1 align-items-center">
                            <img src="/assets/dashboard-card-icon-7.svg" alt="icon" />
                            <h5 className="dashboard-home-card-2-title mb-0">Packages Overview</h5>
                        </div>
                        <h3 className='dashboard-home-card-2-title-2 m-0'>Deep cleaning</h3>
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                            <h4 className='dashboard-home-card-2-label-1 m-0'>50$</h4>
                            <h4 className='dashboard-home-card-2-label-2 m-0'>/monthly</h4>
                        </div>
                            <h4 className='dashboard-home-card-2-label-3 m-0'>Get 7 free days</h4>
                        <a href='#' className="dashboard-card-link">
                            View All Packages
                        </a>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-3 align-tems-start">
                        <div className="d-flex gap-1 align-items-center">
                            <img src="/assets/dashboard-card-icon-9.svg" alt="icon" />
                            <h5 className="dashboard-home-card-2-title mb-0">Task Management</h5>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">

                            <div className='d-flex align-items-center gap-2'>
                                <img src="/assets/dashboard-card-icon-10.svg" alt="icon" />
                                <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Clean Property Alpha (Sky higt Apartments)</h6>
                                    <h6 className="dashboard-home-card-3-desc-1 mb-1">High Priority - Status : in progress</h6>
                                        <p className="dashboard-home-card-2-desc-3 m-0">Assigned to : Jane D .</p>
                                </div>
                            </div>
                            <div className="dashboard-card-btn-2 d-flex gap-1">
                                <span>Edit</span>
                                <img src="/assets/dashboard-card-icon-13.svg" alt="icon" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">

                            <div className='d-flex align-items-center gap-2'>
                                <img src="/assets/dashboard-card-icon-11.svg" alt="icon" />
                                <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Fix Leaky Faucet (Ocean View Villa)</h6>
                                    <h6 className="dashboard-home-card-3-desc-1 mb-1">Medium Priority - Status :  Pending</h6>
                                        <p className="dashboard-home-card-2-desc-3 m-0">Assigned to : Jane D .</p>
                                </div>
                            </div>
                            <div className="dashboard-card-btn-2 d-flex gap-1">
                                <span>Edit</span>
                                <img src="/assets/dashboard-card-icon-13.svg" alt="icon" />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">

                            <div className='d-flex align-items-center gap-2'>
                                <img src="/assets/dashboard-card-icon-12.svg" alt="icon" />
                                <div>
                                <h6 className="dashboard-home-card-2-desc-1 mb-1">Gust welcome Prep (Downtown Studio )</h6>
                                    <h6 className="dashboard-home-card-3-desc-1 mb-1">High Priority - Status : in Todo</h6>
                                        <p className="dashboard-home-card-2-desc-3 m-0">Assigned to : Jane D .</p>
                                </div>
                            </div>
                            <div className="dashboard-card-btn-2 d-flex gap-1">
                                <span>Edit</span>
                                <img src="/assets/dashboard-card-icon-13.svg" alt="icon" />
                            </div>
                        </div>
                        <div className="sec-btn rounded-3 py-2 text-center">View All tasks</div>
                    </div>
                </div>
                <div className="col-md-6 mt-3">
                    <div className="shadow p-3 rounded-4 bg-white h-100 d-flex flex-column gap-4 align-tems-start">
                        <div className="d-flex gap-1 align-items-center">
                            <img src="/assets/dashboard-card-icon-14.svg" alt="icon" />
                            <h5 className="dashboard-home-card-2-title mb-0">Recent Activity</h5>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">

                            <div className='d-flex align-items-center gap-2'>
                                <img src="/assets/dashboard-card-icon-15.svg" alt="icon" />
                                <div>
                                    <div className="d-flex align-items-center gap-1">
                                        <h6 className="dashboard-home-card-2-desc-1 mb-1">Guest Alice Checked-in at </h6>
                                        <h6 className="dashboard-home-card-3-desc-2 mb-1">Sunny Villa</h6>

                                    </div>
                                        <p className="dashboard-home-card-2-desc-3 m-0">10 min ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">

                            <div className='d-flex align-items-center gap-2'>
                                <img src="/assets/dashboard-card-icon-16.svg" alt="icon" />
                                <div>
                                    <div className="d-flex align-items-center gap-1">
                                        <h6 className="dashboard-home-card-2-desc-1 mb-1">Cleaner Bob Completed cleaning at </h6>
                                        <h6 className="dashboard-home-card-3-desc-2 mb-1">Beach House</h6>

                                    </div>
                                        <p className="dashboard-home-card-2-desc-3 m-0">2 h ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">

                            <div className='d-flex align-items-center gap-2'>
                                <img src="/assets/dashboard-card-icon-17.svg" alt="icon" />
                                <div>
                                    <div className="d-flex align-items-center gap-1">
                                        <h6 className="dashboard-home-card-2-desc-1 mb-1">Maintenance C . Fixed tap at </h6>
                                        <h6 className="dashboard-home-card-3-desc-2 mb-1">City Loft</h6>

                                    </div>
                                        <p className="dashboard-home-card-2-desc-3 m-0">3 h ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between gap-2 align-items-start flex-wrap">

                            <div className='d-flex align-items-center gap-2'>
                                <img src="/assets/dashboard-card-icon-18.svg" alt="icon" />
                                <div>
                                    <div className="d-flex align-items-center gap-1">
                                        <h6 className="dashboard-home-card-2-desc-1 mb-1">Guest DavidChecked-out at </h6>
                                        <h6 className="dashboard-home-card-3-desc-2 mb-1"> Mountain Cabin</h6>

                                    </div>
                                        <p className="dashboard-home-card-2-desc-3 m-0">5 h ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5 mt-3">
                    <div className='shadow p-3 rounded-4 bg-white h-100'>
                        <DashboardChart1 />
                    </div>
                </div>
                <div className="col-md-7 mt-3">
                    <div className='shadow p-3 rounded-4 bg-white h-100'>
                        <DashboardChart2 />
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default DashboardMain;