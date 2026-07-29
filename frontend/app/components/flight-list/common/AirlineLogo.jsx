import Image from 'next/image';
import { useState } from 'react';
import { getAirlineByIata, getAirlineLogo } from '@/lib/aviation';

const AirlineLogo = ({ code, name, className = 'w-6 h-6' }) => {
  const [error, setError] = useState(false);
  
  // Get airline data from our local database
  const airline = getAirlineByIata(code);
  const logoUrl = getAirlineLogo(code);
  
  // If no logo found or image fails to load, show airline code
  if (!logoUrl || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`}>
        <span className="text-xs font-medium text-gray-600">{code}</span>
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={name || airline?.name || code}
      width={24}
      height={24}
      className={`rounded ${className}`}
      onError={() => setError(true)}
      priority={true}
    />
  );
};

export default AirlineLogo;
