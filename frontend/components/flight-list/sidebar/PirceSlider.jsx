'use client'

import { useState } from "react";

const PirceSlider = () => {
  const [price, setPrice] = useState({
    min: 50,
    max: 1200,
  });

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= price.max) {
      setPrice({ ...price, min: value });
    }
  };

  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= price.min) {
      setPrice({ ...price, max: value });
    }
  };

  return (
    <div className="js-price-rangeSlider">
      <div className="text-14 fw-500"></div>

      <div className="d-flex justify-between mb-20">
        <div className="text-15 text-dark-1">
          <span className="js-lower">$</span>
          <span className="js-lower">{price.min}</span>
        </div>
        <div className="text-15 text-dark-1">
          <span className="js-upper">$</span>
          <span className="js-upper">{price.max}</span>
        </div>
      </div>

      <div className="px-5">
        <div className="row x-gap-10 y-gap-10">
          <div className="col-6">
            <div className="form-input">
              <input
                type="range"
                min="0"
                max="2000"
                value={price.min}
                onChange={handleMinChange}
                className="form-control"
                style={{ width: '100%' }}
              />
              <label className="lh-1 text-14 text-light-1 mt-5">Min: ${price.min}</label>
            </div>
          </div>
          <div className="col-6">
            <div className="form-input">
              <input
                type="range"
                min="0"
                max="2000"
                value={price.max}
                onChange={handleMaxChange}
                className="form-control"
                style={{ width: '100%' }}
              />
              <label className="lh-1 text-14 text-light-1 mt-5">Max: ${price.max}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PirceSlider;
