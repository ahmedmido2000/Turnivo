import React, { useState } from 'react';
import ClientHeader from './ClientHeader';
import { useClientData } from '../context/ClientDataContext';

const DashboardPaymentMain = ({ onMobileMenuClick }) => {
  const [activeTab, setActiveTab] = useState('payments');
  const { userFullName, userAvatar, status_name, userAddress, userStatus } = useClientData();

  // Demo data for Payments Management
  const paymentMethods = [
    { id: 'apple-pay', name: 'apple pay', icon: '/assets/APPLEPAY.png' },
    { id: 'mastercard', name: 'master card', icon: '/assets/payment-card-img-2.png' },
    { id: 'visa', name: 'visa', icon: '/assets/payment-card-img-1.png' },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: '' },
    { id: 'instapay', name: 'insta pay', icon: '/assets/instapay.png' },
    { id: 'valu', name: 'valu', icon: '/assets/payment-card-img-4.svg' },
  ];

  // Demo data for Smart wallet transactions
  const transactions = [
    { id: 1, type: 'withdraw', amount: -300, description: 'Send earnings to your PayPal account', date: '05 / 03 / 2025' },
    { id: 2, type: 'profit', amount: 300, description: 'Profit from Hosting Service', date: '05 / 03 / 2025' },
    { id: 3, type: 'profit', amount: 300, description: 'Profit from Hosting Service', date: '05 / 03 / 2025' },
    { id: 4, type: 'withdraw', amount: -300, description: 'Send earnings to your PayPal account', date: '05 / 03 / 2025' },
    { id: 5, type: 'profit', amount: 300, description: 'Profit from Hosting Service', date: '05 / 03 / 2025' },
    { id: 6, type: 'profit', amount: 300, description: 'Profit from Hosting Service', date: '05 / 03 / 2025' },
  ];

  return (
    <section className="payment-page">
      <ClientHeader title="Payment and smart wallet" onMobileMenuClick={onMobileMenuClick} />
      
      <div className="payment-content px-3 mt-4">
        {/* User Info Section */}
        <div className="user-info-card d-flex align-items-center gap-3 mb-4">
          <img src={userAvatar || '/assets/user.png'} alt="User" className="user-avatar-large rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
          <div>
            <h4 className="user-name-text mb-1">{userFullName || 'Omar Alrajihi'}</h4>
            <div className="d-flex align-items-center gap-2 text-muted mb-1">
              <img src="/assets/user-icon.svg" alt="icon" width="16" />
              <span className="user-status-text">{status_name || 'New user'}</span>
            </div>
            <div className="d-flex align-items-center gap-2 text-muted">
              <img src="/assets/location.svg" alt="icon" width="16" />
              <span className="user-location-text">{userAddress || 'No Address Added'}</span>
            </div>
          </div>
        </div>

        {/* Tabs and Action Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="tabs-container d-flex p-1 bg-white border rounded-3">
            <button 
              className={`tab-btn px-4 py-2 border-0 rounded-3 ${activeTab === 'payments' ? 'active-tab shadow-sm' : 'bg-transparent text-muted'}`}
              onClick={() => setActiveTab('payments')}
            >
              Payments Management
            </button>
            <button 
              className={`tab-btn px-4 py-2 border-0 rounded-3 ${activeTab === 'wallet' ? 'active-tab shadow-sm' : 'bg-transparent text-muted'}`}
              onClick={() => setActiveTab('wallet')}
            >
              Smart wallet
            </button>
          </div>
          
          <button className="top-up-btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0">
            <img src="/assets/wallet-icon.svg" alt="wallet" width="20" className="icon-white" />
            <span>Top up balance</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content-area">
          {activeTab === 'payments' ? (
            <div className="payments-management-list d-flex flex-column gap-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="payment-method-item d-flex justify-content-between align-items-center p-3 bg-white border rounded-3 shadow-sm">
                  <div className="d-flex align-items-center gap-3">
                    {method.icon && (
                      <div className="payment-icon-wrapper d-flex align-items-center justify-content-center" style={{ width: '60px' }}>
                        <img src={method.icon} alt={method.name} style={{ maxWidth: '100%', maxHeight: '30px' }} />
                      </div>
                    )}
                    <span className={`payment-method-name ${!method.icon ? 'ms-5' : ''}`}>{method.name}</span>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input payment-radio" type="radio" name="paymentMethod" id={method.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="smart-wallet-content">
              {/* Total Balance Card */}
              <div className="total-balance-card text-center p-4 rounded-4 mb-4 shadow-sm" style={{ backgroundColor: '#FFEBD8' }}>
                <h5 className="balance-label mb-2">Total balance</h5>
                <h2 className="balance-amount">860 $</h2>
              </div>

              {/* Transactions List */}
              <div className="transactions-list d-flex flex-column gap-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="transaction-item d-flex justify-content-between align-items-center p-3 rounded-3 shadow-sm" style={{ backgroundColor: '#F8F9FA' }}>
                    <div className="d-flex align-items-center gap-3">
                      <h4 className={`transaction-amount mb-0 ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                        {tx.amount > 0 ? `+ ${tx.amount} $` : `- ${Math.abs(tx.amount)} $`}
                      </h4>
                      <div>
                        <h6 className="transaction-desc mb-1">{tx.description}</h6>
                        <div className="d-flex align-items-center gap-1 text-muted small">
                          <img src="/assets/calendar-icon.svg" alt="calendar" width="14" />
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .payment-page {
          background-color: #fcfcfc;
          min-height: 100vh;
        }
        .active-tab {
          background-color: #F2994A;
          color: white;
        }
        .tab-btn {
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .top-up-btn {
          background-color: #2D3162;
          color: white;
          font-weight: 500;
        }
        .icon-white {
          filter: brightness(0) invert(1);
        }
        .payment-method-item {
          transition: transform 0.2s ease;
        }
        .payment-method-item:hover {
          transform: translateY(-2px);
        }
        .payment-method-name {
          font-weight: 500;
          color: #2D3162;
          text-transform: capitalize;
        }
        .payment-radio {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        .payment-radio:checked {
          background-color: #F2994A;
          border-color: #F2994A;
        }
        .balance-label {
          color: #2D3162;
          font-weight: 600;
        }
        .balance-amount {
          color: #2D3162;
          font-weight: 700;
          font-size: 2.5rem;
        }
        .transaction-item {
          border-left: 4px solid transparent;
        }
        .transaction-amount {
          font-weight: 700;
          min-width: 100px;
        }
        .transaction-desc {
          font-weight: 500;
          color: #2D3162;
        }
        .user-name-text {
          font-weight: 700;
          color: #2D3162;
        }
      `}</style>
    </section>
  );
};

export default DashboardPaymentMain;
