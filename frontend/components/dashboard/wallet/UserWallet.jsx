'use client'

import React, { useState } from 'react';
import Link from 'next/link';

const UserWallet = () => {
  const [paymentRadio, setPaymentRadio] = useState('credit-card');
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <>
      {/* First Row: Wallet Cards and Payment Form */}
      <div className="row">
        {/* Wallet Statistics Cards - Left Side (col-5) */}
        <div className="col-xl-5 col-lg-12 d-flex">
          <div className="row flex-fill">
            <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
              <div className="card shadow-none mb-4 flex-fill">
                <div className="card-body">
                  <span className="avatar avatar-lg rounded-circle bg-primary mb-3">
                    <i className="isax isax-calendar-15 text-white" />
                  </span>
                  <div className="mb-3">
                    <p className="mb-0 text-truncate line-ellipsis-2">
                      Wallet Balance
                    </p>
                    <h4>$4596</h4>
                  </div>
                  <p className="fs-14">
                    <span className="text-teal fw-medium">+8%</span> last Month
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
              <div className="card shadow-none mb-4 flex-fill">
                <div className="card-body">
                  <span className="avatar avatar-lg rounded-circle bg-secondary mb-3">
                    <i className="isax isax-money-send5 text-white" />
                  </span>
                  <div className="mb-3">
                    <p className="mb-0 text-truncate line-ellipsis-2">
                      Total Credit
                    </p>
                    <h4>$15659</h4>
                  </div>
                  <p className="fs-14">
                    <span style={{ 
                      color: '#dc3545 !important',
                      backgroundColor: 'transparent !important',
                      background: 'transparent !important',
                      backgroundImage: 'none !important',
                      fontWeight: '500',
                      border: 'none !important',
                      outline: 'none !important'
                    }}>-6%</span> last Month
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
              <div className="card shadow-none mb-4 flex-fill">
                <div className="card-body">
                  <span className="avatar avatar-lg rounded-circle bg-purple mb-3">
                    <i className="isax isax-money-time5 text-white" />
                  </span>
                  <div className="mb-3">
                    <h4>$16598</h4>
                    <p className="mb-0">Total Debit</p>
                  </div>
                  <p className="fs-14">
                    <span className="text-teal fw-medium">+9%</span> last Month
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 d-flex">
              <div className="card shadow-none mb-4 flex-fill">
                <div className="card-body">
                  <span className="avatar avatar-lg rounded-circle bg-teal mb-3">
                    <i className="isax isax-money-time5 text-white" />
                  </span>
                  <div className="mb-3">
                    <h4>60</h4>
                    <p className="mb-0">Transactions</p>
                  </div>
                  <p className="fs-14">
                    <span className="text-teal fw-medium">+7%</span> last Month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Payment Form - Right Side */}
        <div className="col-xl-7 col-lg-12 d-flex">
          <div className="card payment-details flex-fill mb-4">
            <div className="card-header">
              <h5>Wallet</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Add Amount</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Enter amount" 
                  min="1"
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div className="tab-pane fade active show" id="wallet">
                <div className="mb-3">
                  <h6 className="fs-16 mb-3">Payment Type</h6>
                  <div className="d-flex align-items-center flex-wrap payment-form">
                    <div className="form-check me-4 mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentType"
                        id="credit-card"
                        value="credit-card"
                        onChange={() => setPaymentRadio('credit-card')}
                        checked={paymentRadio === 'credit-card'}
                        style={{ width: '16px', height: '16px', marginRight: '8px', cursor: 'pointer' }}
                      />
                      <label className="form-check-label fs-14" htmlFor="credit-card" style={{ cursor: 'pointer', marginBottom: '0' }}>
                        Credit / Debit Card
                      </label>
                    </div>
                    <div className="form-check me-4 mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentType"
                        id="paypal"
                        value="paypal"
                        onChange={() => setPaymentRadio('paypal')}
                        checked={paymentRadio === 'paypal'}
                        style={{ width: '16px', height: '16px', marginRight: '8px', cursor: 'pointer' }}
                      />
                      <label className="form-check-label fs-14" htmlFor="paypal" style={{ cursor: 'pointer', marginBottom: '0' }}>
                        Paypal
                      </label>
                    </div>
                    <div className="form-check mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentType"
                        id="stripe"
                        value="stripe"
                        onChange={() => setPaymentRadio('stripe')}
                        checked={paymentRadio === 'stripe'}
                        style={{ width: '16px', height: '16px', marginRight: '8px', cursor: 'pointer' }}
                      />
                      <label className="form-check-label fs-14" htmlFor="stripe" style={{ cursor: 'pointer', marginBottom: '0' }}>
                        Stripe
                      </label>
                    </div>
                  </div>
                </div>

                <div className="credit-card-details" style={{ display: paymentRadio === 'credit-card' ? 'block' : 'none' }}>
                  <div className="card-form">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-2">
                          <label className="form-label">Card Holder Name</label>
                          <div className="user-icon">
                            <span className="input-icon fs-14">
                              <i className="isax isax-user" />
                            </span>
                            <input type="text" className="form-control" placeholder="Enter card holder name" />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-2">
                          <label className="form-label">Card Number</label>
                          <div className="user-icon">
                            <span className="input-icon fs-14">
                              <i className="isax isax-card-tick" />
                            </span>
                            <input type="text" className="form-control" placeholder="1234 5678 9012 3456" maxLength="19" />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Expire Date</label>
                          <div>
                            <input
                              className="form-control"
                              placeholder="dd/mm/yyyy"
                              type="date"
                              style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                fontSize: '14px'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">CVV</label>
                          <div className="user-icon">
                            <span className="input-icon fs-14">
                              <i className="isax isax-check" />
                            </span>
                            <input type="text" className="form-control" placeholder="123" maxLength="4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Paypal */}
                <div className="paypal-details" style={{ display: paymentRadio === 'paypal' ? 'block' : 'none' }}>
                  <div className="mb-3">
                    <h6 className="fs-16">Payment With Paypal</h6>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="user-icon">
                          <span className="input-icon fs-14">
                            <i className="isax isax-sms" />
                          </span>
                          <input 
                            type="email" 
                            className="form-control"
                            placeholder="Enter email address"
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-icon">
                          <span className="input-icon-addon">
                            <i className="isax isax-lock" />
                          </span>
                          <input
                            type={passwordVisibility.password ? "text" : "password"}
                            className="pass-input form-control"
                            placeholder="Enter password"
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '14px'
                            }}
                          />
                          <span
                            className={`isax toggle-passwords ${passwordVisibility.password ? "isax-eye" : "isax-eye-slash"}`}
                            onClick={() => togglePasswordVisibility("password")}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe */}
                <div className="stripe-details" style={{ display: paymentRadio === 'stripe' ? 'block' : 'none' }}>
                  <div className="mb-3">
                    <h6 className="fs-16">Payment With Stripe</h6>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <div className="user-icon">
                          <span className="input-icon fs-14">
                            <i className="isax isax-sms" />
                          </span>
                          <input 
                            type="email" 
                            className="form-control"
                            placeholder="Enter email address"
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-icon">
                          <span className="input-icon-addon">
                            <i className="isax isax-lock" />
                          </span>
                          <input
                            type={passwordVisibility.password ? "text" : "password"}
                            className="pass-input form-control"
                            placeholder="Enter password"
                            style={{
                              border: '1px solid #ddd',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '14px'
                            }}
                          />
                          <span
                            className={`isax toggle-passwords ${passwordVisibility.password ? "isax-eye" : "isax-eye-slash"}`}
                            onClick={() => togglePasswordVisibility("password")}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{
                      backgroundColor: '#0d6efd',
                      borderColor: '#0d6efd',
                      padding: '16px 32px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                      border: 'none',
                      minWidth: '180px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e67e22';
                      e.target.style.borderColor = '#e67e22';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#0d6efd';
                      e.target.style.borderColor = '#0d6efd';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    onClick={() => {
                      // Add payment logic here
                      console.log('Add Payment clicked');
                    }}
                  >
                    <i className="isax isax-card-add" style={{ fontSize: '18px' }}></i>
                    Add Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: Transactions Section */}
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap row-gap-3">
                <div>
                  <h6>Transactions</h6>
                  <p className="fs-14">No of Transactions : 60</p>
                </div>
                <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                  <div style={{ minWidth: '160px', maxWidth: '160px' }}>
                    <input 
                      type="date" 
                      className="form-control" 
                      style={{ 
                        width: '160px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        height: '38px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Transactions List */}
      <div className="row">
        <div className="col-12">
          <div className="card hotel-list mb-0">
            <div className="card-body p-0">
              <div className="list-header d-flex align-items-center justify-content-between flex-wrap">
                <h6>Transactions List</h6>
                <div className="d-flex align-items-center flex-wrap">
                  <div className="input-icon-start me-2 position-relative">
                    <span className="icon-addon">
                      <i className="isax isax-search-normal-1 fs-14" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        paddingLeft: '40px',
                        padding: '12px 16px 12px 40px',
                        fontSize: '14px',
                        minWidth: '200px'
                      }}
                    />
                  </div>
                  <div className="dropdown me-3">
                    <Link
                      href="#"
                      className="dropdown-toggle d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                      style={{
                        border: '1px solid #ddd !important',
                        borderRadius: '8px !important',
                        padding: '12px 16px !important',
                        fontSize: '14px !important',
                        color: '#6c757d !important',
                        backgroundColor: '#fff !important',
                        textDecoration: 'none !important',
                        minWidth: '100px !important',
                        justifyContent: 'center !important',
                        gap: '8px !important',
                        boxShadow: 'none !important',
                        outline: 'none !important',
                        transition: 'none !important'
                      }}
                      onMouseEnter={(e) => {
                        // Force override all hover effects
                        e.target.style.setProperty('background-color', '#fff', 'important');
                        e.target.style.setProperty('color', '#6c757d', 'important');
                        e.target.style.setProperty('border-color', '#ddd', 'important');
                        e.target.style.setProperty('box-shadow', 'none', 'important');
                        e.target.style.setProperty('outline', 'none', 'important');
                      }}
                      onMouseLeave={(e) => {
                        // Force override all effects
                        e.target.style.setProperty('background-color', '#fff', 'important');
                        e.target.style.setProperty('color', '#6c757d', 'important');
                        e.target.style.setProperty('border-color', '#ddd', 'important');
                        e.target.style.setProperty('box-shadow', 'none', 'important');
                        e.target.style.setProperty('outline', 'none', 'important');
                      }}
                      onFocus={(e) => {
                        // Force override focus effects
                        e.target.style.setProperty('background-color', '#fff', 'important');
                        e.target.style.setProperty('color', '#6c757d', 'important');
                        e.target.style.setProperty('border-color', '#ddd', 'important');
                        e.target.style.setProperty('box-shadow', 'none', 'important');
                        e.target.style.setProperty('outline', 'none', 'important');
                      }}
                      onClick={(e) => {
                        // Force override active/click effects
                        e.target.style.setProperty('background-color', '#fff', 'important');
                        e.target.style.setProperty('color', '#6c757d', 'important');
                        e.target.style.setProperty('border-color', '#ddd', 'important');
                        e.target.style.setProperty('box-shadow', 'none', 'important');
                        e.target.style.setProperty('outline', 'none', 'important');
                      }}
                    >
                      Status
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-end p-3">
                      <li>
                        <Link href="#" className="dropdown-item rounded-1">
                          Completed
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="dropdown-item rounded-1">
                          Pending
                        </Link>
                      </li>
                      <li>
                        <Link href="#" className="dropdown-item rounded-1">
                          Cancelled
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th>Payment Type</th>
                      <th>Credit / Debit</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Balance</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-gray-9 fw-medium">Card</td>
                      <td>Debit</td>
                      <td>15 May 2025, 10:00 AM</td>
                      <td style={{ backgroundColor: 'transparent !important', background: 'none !important' }}>
                        <span 
                          className=""
                          style={{ 
                            backgroundColor: 'transparent !important', 
                            background: 'none !important', 
                            color: '#dc3545 !important', 
                            padding: '0 !important', 
                            margin: '0 !important', 
                            border: 'none !important', 
                            outline: 'none !important',
                            boxShadow: 'none !important',
                            textShadow: 'none !important',
                            backgroundImage: 'none !important',
                            backgroundAttachment: 'initial !important',
                            backgroundBlendMode: 'initial !important',
                            backgroundClip: 'initial !important',
                            WebkitBackgroundClip: 'initial !important'
                          }}
                        >-$256</span>
                      </td>
                      <td>$11,569</td>
                      <td>
                        <span className="badge badge-success rounded-pill d-inline-flex align-items-center fs-10">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-9 fw-medium">Paypal</td>
                      <td>Credit</td>
                      <td>20 May 2025, 11:20 AM</td>
                      <td style={{ backgroundColor: 'transparent !important', background: 'none !important' }}>
                        <span style={{ backgroundColor: 'transparent !important', background: 'none !important', color: '#28a745', padding: '0', margin: '0', border: 'none', outline: 'none' }}>+$3000</span>
                      </td>
                      <td>$11,569</td>
                      <td>
                        <span className="badge badge-secondary rounded-pill d-inline-flex align-items-center fs-10">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Pending
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-9 fw-medium">Stripe</td>
                      <td>Credit</td>
                      <td>22 May 2025, 02:40 PM</td>
                      <td style={{ backgroundColor: 'transparent !important', background: 'none !important' }}>
                        <span style={{ backgroundColor: 'transparent !important', background: 'none !important', color: '#28a745', padding: '0', margin: '0', border: 'none', outline: 'none' }}>+$4000</span>
                      </td>
                      <td>$12,497</td>
                      <td>
                        <span className="badge badge-success rounded-pill d-inline-flex align-items-center fs-10">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-9 fw-medium">Card</td>
                      <td>Debit</td>
                      <td>12 Jun 2025, 05:15 PM</td>
                      <td style={{ backgroundColor: 'transparent !important', background: 'none !important' }}>
                        <span style={{ backgroundColor: 'transparent !important', background: 'none !important', color: '#dc3545', padding: '0', margin: '0', border: 'none', outline: 'none' }}>-$600</span>
                      </td>
                      <td>$14,284</td>
                      <td>
                        <span className="badge badge-danger rounded-pill d-inline-flex align-items-center fs-10">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Cancelled
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-gray-9 fw-medium">Card</td>
                      <td>Debit</td>
                      <td>17 Jun 2025, 09:30 AM</td>
                      <td style={{ backgroundColor: 'transparent !important', background: 'none !important' }}>
                        <span style={{ backgroundColor: 'transparent !important', background: 'none !important', color: '#28a745', padding: '0', margin: '0', border: 'none', outline: 'none' }}>+$11,569</span>
                      </td>
                      <td>$13,025</td>
                      <td>
                        <span className="badge badge-success rounded-pill d-inline-flex align-items-center fs-10">
                          <i className="fa-solid fa-circle fs-5 me-1" />
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserWallet; 