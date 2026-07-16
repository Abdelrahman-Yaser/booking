"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelectedCar } from '@/contexts/SelectedCarContext';

const SimilarCars = ({ cars, bookingData }) => {
  const router = useRouter();
  const { setSelectedCar } = useSelectedCar();
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? cars.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === cars.length - 1 ? 0 : prev + 1));
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    // Refresh the current page to show the new car details
    router.refresh();
  };

  return (
    <div className="similar-cars">
      <div className="section-header">
        <h3>Similar Cars</h3>
        <div className="navigation-buttons">
          <button onClick={handlePrevious}>
            <i className="isax isax-arrow-left"></i>
          </button>
          <button onClick={handleNext}>
            <i className="isax isax-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="cars-slider">
        {cars.map((car, index) => (
          <div
            key={car.id}
            className={`car-card ${index === activeIndex ? 'active' : ''}`}
            style={{
              transform: `translateX(${(index - activeIndex) * 100}%)`,
              opacity: index === activeIndex ? 1 : 0.5,
              pointerEvents: index === activeIndex ? 'auto' : 'none',
            }}
          >
            <div className="car-image">
              <Image
                src={car.image}
                alt={car.name}
                width={400}
                height={250}
                className="car-photo"
              />
              {car.specialOffer && (
                <div className="special-offer">
                  <i className="isax isax-discount-shape"></i>
                  <span>{car.specialOffer}</span>
                </div>
              )}
            </div>

            <div className="car-info">
              <div className="car-header">
                <h4>{car.name}</h4>
                <div className="car-rating">
                  <i className="isax isax-star1"></i>
                  <span>{car.rating}</span>
                </div>
              </div>

              <div className="car-features">
                <div className="feature">
                  <i className="isax isax-user"></i>
                  <span>{car.seats} Seats</span>
                </div>
                <div className="feature">
                  <i className="isax isax-box"></i>
                  <span>{car.luggage} Luggage</span>
                </div>
                <div className="feature">
                  <i className="isax isax-setting"></i>
                  <span>{car.transmission}</span>
                </div>
              </div>

              <div className="car-price">
                <div className="price-info">
                  <span className="amount">${car.pricePerDay}</span>
                  <span className="period">per day</span>
                </div>
                <button 
                  className="select-button"
                  onClick={() => handleCarSelect(car)}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .similar-cars {
          padding: 2rem;
          background: white;
          border-radius: 16px;
          margin-top: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.5rem;
          color: #1a1a1a;
        }

        .navigation-buttons {
          display: flex;
          gap: 1rem;
        }

        .navigation-buttons button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #4f46e5;
          background: transparent;
          color: #4f46e5;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .navigation-buttons button:hover {
          background: #4f46e5;
          color: white;
        }

        .cars-slider {
          position: relative;
          height: 450px;
          overflow: hidden;
        }

        .car-card {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: all 0.5s ease;
        }

        .car-image {
          position: relative;
          width: 100%;
          height: 250px;
          border-radius: 12px;
          overflow: hidden;
        }

        .car-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .car-card:hover .car-photo {
          transform: scale(1.05);
        }

        .special-offer {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #4f46e5;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .car-info {
          padding: 1.5rem;
        }

        .car-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .car-header h4 {
          margin: 0;
          font-size: 1.25rem;
          color: #1a1a1a;
        }

        .car-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4f46e5;
        }

        .car-features {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
        }

        .feature i {
          color: #4f46e5;
        }

        .car-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-info {
          display: flex;
          flex-direction: column;
        }

        .amount {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .period {
          font-size: 0.875rem;
          color: #666;
        }

        .select-button {
          padding: 0.75rem 1.5rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .select-button:hover {
          background: #4338ca;
        }

        @media (max-width: 768px) {
          .car-features {
            flex-direction: column;
            gap: 1rem;
          }

          .car-price {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .select-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SimilarCars; 