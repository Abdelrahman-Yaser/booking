import { useState } from 'react';
import { FaSuitcase, FaInfoCircle } from 'react-icons/fa';

const BaggageInfo = ({ baggage }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!baggage) return null;

  return (
    <div className="baggage-info relative">
      <div 
        className="d-flex items-center gap-10 cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FaSuitcase className="text-15" />
        <span className="text-14">
          {baggage.included ? baggage.allowance : 'No baggage included'}
        </span>
        <FaInfoCircle className="text-14 text-light-1" />
      </div>

      {showTooltip && (
        <div className="tooltip-content absolute top-100 left-0 mt-5 p-15 bg-white rounded-4 shadow-1 z-10">
          <div className="text-14">
            <div className="fw-500 mb-10">Baggage Information</div>
            {baggage.included ? (
              <>
                <div className="mb-5">✓ Checked baggage: {baggage.allowance}</div>
                <div>✓ Carry-on baggage: 7kg</div>
              </>
            ) : (
              <>
                <div className="mb-5">✗ No checked baggage included</div>
                <div>✓ Carry-on baggage: 7kg</div>
                <div className="mt-10 text-12 text-light-1">
                  Additional baggage can be purchased during booking
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BaggageInfo; 