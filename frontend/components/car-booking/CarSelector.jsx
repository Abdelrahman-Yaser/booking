"use client";

import { useState } from "react";
import CarDetails from "./CarDetails";
import ExtrasSelector from "./ExtrasSelector";
import BookingSummarySidebar from "./BookingSummarySidebar";
import ProtectionCover from "./ProtectionCover";

const CarSelector = ({ onNext, data }) => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedProtection, setSelectedProtection] = useState(null);
  const [bookingData, setBookingData] = useState({
    pickupLocation: data?.pickupLocation || "Istanbul Airport (IST)",
    dropoffLocation: data?.dropoffLocation || "Istanbul Airport (IST)",
    pickupDate: data?.pickupDate || "Jul 15, 2023 - 12:00",
    dropoffDate: data?.dropoffDate || "Jul 18, 2023 - 12:00",
    duration: data?.duration || 3,
    car: {
      name: "Fiat Egea",
      category: "Economy",
      image: "/img/cars/fiat-egea.png",
      seats: 5,
      transmission: "Automatic",
      fuelType: "Diesel",
      luggage: 2,
      pricePerDay: 150
    }
  });

  const handleServiceSelect = (serviceId) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === serviceId);
      if (isSelected) {
        return prev.filter(s => s.id !== serviceId);
      } else {
        const service = services.find(s => s.id === serviceId);
        return [...prev, service];
      }
    });
  };

  const handleProtectionSelect = (protection) => {
    setSelectedProtection(protection);
  };

  const handlePromoCodeApply = (code) => {
    // Implement promo code logic
    console.log("Applying promo code:", code);
  };

  const handleContinue = () => {
    onNext({
      car: bookingData.car,
      selectedServices,
      selectedProtection,
      totalAmount: (
        bookingData.car.pricePerDay * bookingData.duration +
        (selectedProtection?.price || 0) +
        selectedServices.reduce((sum, service) => sum + service.price, 0)
      ).toFixed(2)
    });
  };

  return (
    <div className="car-selector-page">
      <div className="content-area">
        <div className="booking-card">
          <CarDetails car={bookingData.car} />
        </div>
        <div className="booking-card">
          <ProtectionCover
            onSelect={handleProtectionSelect}
            selectedProtection={selectedProtection}
          />
        </div>
        <div className="booking-card">
          <ExtrasSelector
            onSelect={handleServiceSelect}
            selectedServices={selectedServices}
          />
        </div>
      </div>
      <div className="sidebar-area">
        <BookingSummarySidebar
          bookingData={{
            ...bookingData,
            selectedServices,
            package: selectedProtection,
            totalCarPrice: bookingData.car.pricePerDay * bookingData.duration,
            totalAmount: (
              bookingData.car.pricePerDay * bookingData.duration +
              (selectedProtection?.price || 0) +
              selectedServices.reduce((sum, service) => sum + service.price, 0)
            ).toFixed(2)
          }}
          onPromoCodeApply={handlePromoCodeApply}
          onContinue={handleContinue}
        />
      </div>

      <style jsx>{`
        .car-selector-page {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 24px;
          padding: 24px;
          background: transparent;

          @media (max-width: 1024px) {
            grid-template-columns: 1fr;
            padding: 16px;
          }
        }

        .content-area {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .booking-card {
          background: linear-gradient(145deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          color: white;
        }

        .sidebar-area {
          position: sticky;
          top: 24px;
          height: fit-content;

          @media (max-width: 1024px) {
            grid-row: 1;
            position: relative;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CarSelector;