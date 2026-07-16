'use client'

import React, { useState, useEffect } from "react";

const Counter = ({ name, value, onCounterChange, min = 0, max = 10 }) => {
  const incrementCount = () => {
    if (value < max) {
      onCounterChange(name, value + 1);
    }
  };
  
  const decrementCount = () => {
    if (value > min) {
      onCounterChange(name, value - 1);
    }
  };

  return (
    <>
      <div className="row y-gap-10 justify-between items-center">
        <div className="col-auto">
          <div className="text-15 lh-12 fw-500">{name}</div>
          {name === "أطفال" && (
            <div className="text-14 lh-12 text-light-1 mt-5">أعمار 0 - 17</div>
          )}
        </div>
        <div className="col-auto">
          <div className="d-flex items-center js-counter">
            <button
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4 js-down"
              onClick={decrementCount}
              disabled={value <= min}
            >
              <i className="icon-minus text-12" />
            </button>
            <div className="flex-center size-20 ml-15 mr-15">
              <div className="text-15 js-count">{value}</div>
            </div>
            <button
              className="button -outline-blue-1 text-blue-1 size-38 rounded-4 js-up"
              onClick={incrementCount}
              disabled={value >= max}
            >
              <i className="icon-plus text-12" />
            </button>
          </div>
        </div>
      </div>
      <div className="border-top-light mt-24 mb-24" />
    </>
  );
};

const GuestSearch = ({ value = 1, onChange, cabin = 'economy', onCabinChange }) => {
  const [guestCounts, setGuestCounts] = useState({
    بالغين: 1,
    أطفال: 0,
  });

  const cabinClasses = [
    { value: 'economy', label: 'اقتصادية', icon: 'icon-seat' },
    { value: 'business', label: 'رجال أعمال', icon: 'icon-seat' },
    { value: 'first', label: 'الدرجة الأولى', icon: 'icon-seat' }
  ];

  useEffect(() => {
    if (value) {
      const total = guestCounts.بالغين + guestCounts.أطفال;
      if (total !== value) {
        setGuestCounts(prev => ({
          ...prev,
          بالغين: Math.max(1, value - prev.أطفال)
        }));
      }
    }
  }, [value]);

  const handleCounterChange = (name, newValue) => {
    const newCounts = { ...guestCounts, [name]: newValue };
    setGuestCounts(newCounts);
    
    const total = newCounts.بالغين + newCounts.أطفال;
    if (onChange) {
      onChange(total);
    }
  };

  const handleCabinSelect = (cabinValue) => {
    if (onCabinChange) {
      onCabinChange(cabinValue);
    }
  };

  const totalPassengers = guestCounts.بالغين + guestCounts.أطفال;
  const selectedCabin = cabinClasses.find(c => c.value === cabin);

  return (
    <div className="searchMenu-guests px-24 lg:py-20 lg:px-0 js-form-dd js-form-counters">
      <div
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
        data-bs-offset="0,22"
      >
        <h4 className="text-15 fw-500 ls-2 lh-16">
          <i className="icon-person text-16 mr-5"></i>
          المسافرون والدرجة
        </h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          {totalPassengers} راكب • {selectedCabin?.label || 'اقتصادية'}
        </div>
      </div>

      <div className="shadow-2 dropdown-menu min-width-400">
        <div className="bg-white px-30 py-30 rounded-4 counter-box">
          
          {/* Passengers Section */}
          <div className="mb-30">
            <h5 className="text-16 fw-600 mb-20">عدد المسافرين</h5>
            <Counter
              name="بالغين"
              value={guestCounts.بالغين}
              onCounterChange={handleCounterChange}
              min={1}
              max={9}
            />
            <Counter
              name="أطفال"
              value={guestCounts.أطفال}
              onCounterChange={handleCounterChange}
              min={0}
              max={8}
            />
          </div>

          {/* Cabin Class Section */}
          <div className="border-top-light pt-20">
            <h5 className="text-16 fw-600 mb-20">
              <i className="icon-seat text-16 mr-5"></i>
              درجة السفر
            </h5>
            <div className="row y-gap-10">
              {cabinClasses.map((cabinClass) => (
                <div key={cabinClass.value} className="col-12">
                  <label className="d-flex items-center cursor-pointer py-10 px-15 rounded-4 hover-bg-blue-1-05">
                    <input
                      type="radio"
                      name="cabin"
                      value={cabinClass.value}
                      checked={cabin === cabinClass.value}
                      onChange={() => handleCabinSelect(cabinClass.value)}
                      className="form-check-input mr-15"
                    />
                    <div className="d-flex items-center">
                      <i className={`${cabinClass.icon} text-18 mr-10 text-blue-1`}></i>
                      <div>
                        <div className="text-15 fw-500">{cabinClass.label}</div>
                        <div className="text-13 text-light-1">
                          {cabinClass.value === 'economy' && 'أسعار اقتصادية ومقاعد مريحة'}
                          {cabinClass.value === 'business' && 'مقاعد واسعة وخدمة متميزة'}
                          {cabinClass.value === 'first' && 'أقصى درجات الراحة والفخامة'}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-top-light pt-20 mt-20">
            <div className="d-flex items-center justify-between">
              <div className="text-14 text-light-1">الإجمالي:</div>
              <div className="text-15 fw-600">
                {totalPassengers} راكب • {selectedCabin?.label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;
