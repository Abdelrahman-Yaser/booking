import Image from 'next/image';
import { useState } from 'react';

const AirlineLogo = ({ code, name, className = 'w-6 h-6' }) => {
  const [error, setError] = useState(false);
  
  // If image fails to load, show airline code instead
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`}>
        <span className="text-xs font-medium text-gray-600">{code}</span>
      </div>
    );
  }

  return (
    <Image
      src={`/img/airlines/${code.toLowerCase()}.png`}
      alt={name || code}
      width={24}
      height={24}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default AirlineLogo; 