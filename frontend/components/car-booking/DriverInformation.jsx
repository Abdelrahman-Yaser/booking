"use client";

import { useState } from "react";
import Image from "next/image";

const DriverInformation = () => {
  const [formData, setFormData] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+90",
    phone: "",
    flightNumber: "",
    rememberDevice: false,
    agreeToTerms: false,
    subscribeToEmails: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="driver-information">
      <div className="info-header">
        <h3>Main Driver's Information</h3>
      </div>

      <div className="info-content">
        <div className="form-row">
          <div className="form-group title">
            <label>Title</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
          </div>

          <div className="form-group">
            <label>Name</label>
            <div className="name-inputs">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <div className="phone-inputs">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="form-select country-code"
              >
                <option value="+90">+90</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>I live in</label>
            <select className="form-select">
              <option value="Turkey">Turkey</option>
            </select>
          </div>
        </div>

        <div className="driver-age-notice">
          <i className="icon-info"></i>
          <span>Driver's age between 30-65?</span>
        </div>

        <div className="additional-info">
          <div className="info-header">
            <i className="icon-info"></i>
            <span>Additional Info</span>
          </div>

          <div className="form-group">
            <label>Flight Number (Optional)</label>
            <input
              type="text"
              name="flightNumber"
              placeholder="Flight Number"
              value={formData.flightNumber}
              onChange={handleInputChange}
              className="form-input"
            />
            <div className="input-help">
              It helps the supplier to track the flight in case of any delay
            </div>
          </div>
        </div>

        <div className="form-checkboxes">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="rememberDevice"
              checked={formData.rememberDevice}
              onChange={handleInputChange}
            />
            <span>Remember me on this device</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
            />
            <span>
              I confirm that I have read, understood and agree with the{" "}
              <a href="#">Rental Terms</a> and{" "}
              <a href="#">PRIVACY POLICY & TERMS & CONDITIONS</a> provided.
            </span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="subscribeToEmails"
              checked={formData.subscribeToEmails}
              onChange={handleInputChange}
            />
            <span>Subscribe me to the promotional emails.</span>
          </label>
        </div>

        <div className="privacy-notice">
          Check our <a href="#">Privacy Policy</a> to understand how we use your personal information & how your personal information is used.
        </div>

        <div className="secure-transaction">
          <div className="secure-badge">
            <span>100%</span>
            <span>Secure Transaction</span>
          </div>
          <button className="proceed-button">
            Proceed To Payment <i className="icon-arrow-right"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .driver-information {
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .info-header {
          background: #F3F4F6;
          padding: 1rem;
        }

        .info-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .info-content {
          padding: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          flex: 1;
        }

        .form-group.title {
          flex: 0 0 100px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          font-size: 14px;
          color: #374151;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #2563EB;
          ring: 2px solid rgba(37, 99, 235, 0.2);
        }

        .name-inputs {
          display: flex;
          gap: 1rem;
        }

        .phone-inputs {
          display: flex;
          gap: 1rem;
        }

        .country-code {
          width: 120px;
        }

        .driver-age-notice {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #FEF3C7;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          font-size: 14px;
          color: #92400E;
        }

        .additional-info {
          background: #F3F4F6;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .additional-info .info-header {
          background: none;
          padding: 0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .input-help {
          font-size: 12px;
          color: #6B7280;
          margin-top: 0.25rem;
        }

        .form-checkboxes {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 14px;
          color: #374151;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin-top: 0.25rem;
        }

        .checkbox-label a {
          color: #2563EB;
          text-decoration: none;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .privacy-notice {
          font-size: 12px;
          color: #6B7280;
          margin-bottom: 1.5rem;
        }

        .privacy-notice a {
          color: #2563EB;
          text-decoration: none;
        }

        .secure-transaction {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid #E5E7EB;
        }

        .secure-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          color: #059669;
        }

        .proceed-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .proceed-button:hover {
          background: #047857;
        }
      `}</style>
    </div>
  );
};

export default DriverInformation; 