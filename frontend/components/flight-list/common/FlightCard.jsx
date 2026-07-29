import { useState } from 'react';
import Image from 'next/image';
import { FaPlane, FaArrowRight, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import BaggageInfo from './BaggageInfo';
import LayoverInfo from './LayoverInfo';

const FlightCard = ({ flight }) => {
  const [expanded, setExpanded] = useState(false);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const calculateTotalPrice = () => {
    const {
      adtFare = 0,
      adtTax = 0,
      tktFee = 0,
      adults = 1,
      platformServiceFee = 0,
      merchantFee = 0
    } = flight.priceInfo || {};

    return (adtFare + adtTax + tktFee) * adults + platformServiceFee + merchantFee;
  };

  return (
    <div className="flight-card px-30 py-20 rounded-4 bg-white shadow-1">
      {/* Airline Info */}
      <div className="d-flex justify-between items-center">
        <div className="d-flex items-center gap-15">
          <Image
            src={`/img/airlines/${flight.segments[0].airline.toLowerCase()}.png`}
            alt={flight.segments[0].airlineName}
            width={40}
            height={40}
            className="rounded-4"
          />
          <div>
            <div className="text-16 fw-500">{flight.segments[0].airlineName}</div>
            <div className="text-14 text-light-1">Flight {flight.segments[0].flightNum}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-20 fw-500">${calculateTotalPrice()}</div>
          <div className="text-14 text-light-1">per person</div>
        </div>
      </div>

      {/* Flight Route */}
      <div className="mt-20">
        <div className="d-flex justify-between items-center">
          <div>
            <div className="text-18 fw-500">{formatTime(flight.segments[0].departureDate)}</div>
            <div className="text-15">{flight.segments[0].departure}</div>
          </div>
          <div className="text-center flex-grow-1 px-20">
            <div className="text-14 text-light-1">
              {formatDuration(flight.segments.reduce((total, segment) => total + segment.flightTime, 0))}
            </div>
            <div className="flight-line"></div>
            <div className="text-14 text-light-1">
              {flight.segments.length > 1 ? `${flight.segments.length - 1} stop` : 'Direct'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-18 fw-500">
              {formatTime(flight.segments[flight.segments.length - 1].arrivalDate)}
            </div>
            <div className="text-15">{flight.segments[flight.segments.length - 1].arrival}</div>
          </div>
        </div>
      </div>

      {/* Baggage Info */}
      <div className="mt-20">
        <BaggageInfo baggage={flight.baggage} />
      </div>

      {/* Layover Info */}
      <LayoverInfo segments={flight.segments} />

      {/* Expand/Collapse Button */}
      <div className="mt-20 d-flex justify-center">
        <button
          className="button -dark-1 px-20 py-10 rounded-4"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="d-flex items-center gap-10">
            <span>{expanded ? 'Show less' : 'Show more'}</span>
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-20 pt-20 border-dashed-t">
          {flight.segments.map((segment, index) => (
            <div key={index} className="segment-details">
              <div className="d-flex items-center gap-15 mb-15">
                <Image
                  src={`/img/airlines/${segment.airline.toLowerCase()}.png`}
                  alt={segment.airlineName}
                  width={30}
                  height={30}
                  className="rounded-4"
                />
                <div className="text-15 fw-500">{segment.airlineName} {segment.flightNum}</div>
              </div>

              <div className="d-flex justify-between items-center">
                <div>
                  <div className="text-16 fw-500">{formatTime(segment.departureDate)}</div>
                  <div className="text-14">{segment.departure}</div>
                  <div className="text-14 text-light-1">Terminal {segment.departureTerminal}</div>
                </div>
                <div className="text-center flex-grow-1 px-20">
                  <div className="text-14 text-light-1">{formatDuration(segment.flightTime)}</div>
                  <div className="flight-line"></div>
                  <div className="text-14 text-light-1">{segment.cabinClass}</div>
                </div>
                <div className="text-right">
                  <div className="text-16 fw-500">{formatTime(segment.arrivalDate)}</div>
                  <div className="text-14">{segment.arrival}</div>
                  <div className="text-14 text-light-1">Terminal {segment.arrivalTerminal}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Price Breakdown */}
          <div className="mt-20">
            <div className="text-16 fw-500 mb-10">Price Breakdown</div>
            <div className="d-flex justify-between text-14 mb-5">
              <span>Base Fare</span>
              <span>${flight.priceInfo.adtFare}</span>
            </div>
            <div className="d-flex justify-between text-14 mb-5">
              <span>Taxes & Fees</span>
              <span>${flight.priceInfo.adtTax}</span>
            </div>
            <div className="d-flex justify-between text-14 mb-5">
              <span>Ticketing Fee</span>
              <span>${flight.priceInfo.tktFee}</span>
            </div>
            {flight.priceInfo.platformServiceFee > 0 && (
              <div className="d-flex justify-between text-14 mb-5">
                <span>Service Fee</span>
                <span>${flight.priceInfo.platformServiceFee}</span>
              </div>
            )}
            {flight.priceInfo.merchantFee > 0 && (
              <div className="d-flex justify-between text-14 mb-5">
                <span>Payment Fee</span>
                <span>${flight.priceInfo.merchantFee}</span>
              </div>
            )}
            <div className="d-flex justify-between text-16 fw-500 mt-10 pt-10 border-dashed-t">
              <span>Total Price</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard; 