"use client";

import Image from "next/image";

const BookingSuccess = ({ bookingData }) => {
  return (
    <div className="booking-success">
      <div className="success-header">
        <div className="success-icon">
          <i className="icon-check text-success"></i>
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Your booking has been successfully completed.</p>
      </div>

      <div className="booking-details">
        <div className="section-title">
          <h3>Booking Details</h3>
          <button className="print-button">
            <i className="icon-print"></i> Print
          </button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Booking Reference</span>
            <span className="value">FLY-12345678</span>
          </div>
          <div className="detail-item">
            <span className="label">Booking Date</span>
            <span className="value">June 23, 2025</span>
          </div>
          <div className="detail-item">
            <span className="label">Pick-up Location</span>
            <span className="value">Istanbul Airport (IST)</span>
          </div>
          <div className="detail-item">
            <span className="label">Drop-off Location</span>
            <span className="value">Istanbul Airport (IST)</span>
          </div>
        </div>

        <div className="car-summary">
          <div className="car-image">
            <Image
              src="/img/cars/fiat-egea.png"
              width={200}
              height={120}
              alt="Fiat Egea"
            />
          </div>
          <div className="car-info">
            <h4>Fiat Egea</h4>
            <p className="car-type">Economy</p>
            <div className="features">
              <span><i className="icon-user"></i> 5 Seats</span>
              <span><i className="icon-luggage"></i> 2 Suitcases</span>
              <span><i className="icon-transmission"></i> Manual</span>
            </div>
          </div>
        </div>

        <div className="price-breakdown">
          <h4>Price Breakdown</h4>
          <div className="price-items">
            <div className="price-item">
              <span>Car Rental (8 days)</span>
              <span>TRY 13,404.52</span>
            </div>
            <div className="price-item">
              <span>Additional Driver</span>
              <span>TRY 1,224.48</span>
            </div>
            <div className="price-item">
              <span>Full Protection Cover</span>
              <span>TRY 4,049.08</span>
            </div>
            <div className="price-item total">
              <span>Total Amount</span>
              <span>TRY 18,678.08</span>
            </div>
          </div>
        </div>

        <div className="important-info">
          <h4>Important Information</h4>
          <ul>
            <li>Please present your driver's license and credit card at pick-up</li>
            <li>Free cancellation up to 48 hours before pick-up</li>
            <li>24/7 customer support available</li>
          </ul>
        </div>

        <div className="contact-support">
          <p>Need help with your booking?</p>
          <button className="support-button">
            <i className="icon-headphones"></i> Contact Support
          </button>
        </div>
      </div>

      <style jsx>{`
        .booking-success {
          max-width: 800px;
          margin: 0 auto;
        }

        .success-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .success-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: #F0FDF4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-icon i {
          font-size: 32px;
          color: #059669;
        }

        .success-header h2 {
          font-size: 24px;
          color: #059669;
          margin-bottom: 10px;
        }

        .success-header p {
          color: #6B7280;
        }

        .booking-details {
          background: white;
          border-radius: 8px;
          padding: 30px;
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title h3 {
          font-size: 18px;
          color: #374151;
        }

        .print-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: none;
          border: 1px solid #E5E7EB;
          border-radius: 6px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .print-button:hover {
          background: #F3F4F6;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .label {
          font-size: 14px;
          color: #6B7280;
        }

        .value {
          font-size: 16px;
          color: #374151;
          font-weight: 500;
        }

        .car-summary {
          display: flex;
          gap: 20px;
          padding: 20px;
          background: #F9FAFB;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .car-info h4 {
          font-size: 18px;
          color: #374151;
          margin-bottom: 4px;
        }

        .car-type {
          color: #6B7280;
          margin-bottom: 10px;
        }

        .features {
          display: flex;
          gap: 20px;
        }

        .features span {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
        }

        .price-breakdown {
          margin-bottom: 30px;
        }

        .price-breakdown h4 {
          font-size: 16px;
          color: #374151;
          margin-bottom: 15px;
        }

        .price-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .price-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #E5E7EB;
          font-size: 14px;
          color: #374151;
        }

        .price-item.total {
          border-bottom: none;
          font-weight: 600;
          font-size: 16px;
          color: #059669;
        }

        .important-info {
          background: #F3F4F6;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .important-info h4 {
          font-size: 16px;
          color: #374151;
          margin-bottom: 15px;
        }

        .important-info ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .important-info li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 10px;
        }

        .important-info li:before {
          content: "•";
          color: #059669;
        }

        .contact-support {
          text-align: center;
        }

        .contact-support p {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 10px;
        }

        .support-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin: 0 auto;
          transition: background-color 0.2s;
        }

        .support-button:hover {
          background: #1D4ED8;
        }
      `}</style>
    </div>
  );
};

export default BookingSuccess; 