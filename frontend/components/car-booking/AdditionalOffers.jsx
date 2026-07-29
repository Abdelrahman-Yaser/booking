"use client";

import { useState } from "react";

const AdditionalOffers = () => {
  const [selectedOffers, setSelectedOffers] = useState([]);

  const offers = [
    {
      id: "priority",
      title: "Priority Check-in",
      description: "Skip the line and get your car faster",
      price: 75,
      icon: "icon-star",
    },
    {
      id: "delivery",
      title: "Hotel Delivery",
      description: "Get your car delivered to your hotel",
      price: 150,
      icon: "icon-location",
    },
    {
      id: "fuel",
      title: "Full Tank Option",
      description: "Return the car with any fuel level",
      price: 200,
      icon: "icon-fuel",
    },
  ];

  const toggleOffer = (offerId) => {
    setSelectedOffers((prev) =>
      prev.includes(offerId)
        ? prev.filter((id) => id !== offerId)
        : [...prev, offerId]
    );
  };

  return (
    <div className="additional-offers bg-white rounded-4 border-light shadow-3">
      <div className="px-30 py-30">
        <div className="d-flex justify-between items-center mb-20">
          <h3 className="text-22 fw-500">Additional Services</h3>
          <div className="text-14 text-light-1">Optional services to enhance your rental</div>
        </div>

        <div className="row y-gap-20">
          {offers.map((offer) => (
            <div className="col-12" key={offer.id}>
              <div
                className={`border-light rounded-4 px-20 py-20 cursor-pointer ${
                  selectedOffers.includes(offer.id) ? "border-blue-1" : ""
                }`}
                onClick={() => toggleOffer(offer.id)}
              >
                <div className="row y-gap-10 justify-between items-center">
                  <div className="col-auto">
                    <div className="d-flex items-center">
                      <div className="form-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedOffers.includes(offer.id)}
                          onChange={() => toggleOffer(offer.id)}
                        />
                        <div className="checkbox-mark"></div>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <div className="row x-gap-20 items-center">
                      <div className="col-auto">
                        <div className="size-50 flex-center bg-blue-1-05 rounded-4">
                          <i className={`${offer.icon} text-24 text-blue-1`}></i>
                        </div>
                      </div>
                      <div className="col">
                        <div className="text-16 fw-500">{offer.title}</div>
                        <div className="text-14 text-light-1 mt-5">{offer.description}</div>
                      </div>
                      <div className="col-auto">
                        <div className="text-16 fw-500">TRY {offer.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="d-flex items-center">
            <i className="icon-info-circle text-16 mr-10 text-blue-1"></i>
            <div className="text-14 text-light-1">
              These services can be added or removed at the rental counter.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .border-blue-1 {
          border-color: #4285F4;
        }

        .text-blue-1 {
          color: #4285F4;
        }

        .bg-blue-1-05 {
          background-color: rgba(66, 133, 244, 0.05);
        }

        .size-50 {
          width: 50px;
          height: 50px;
        }

        .form-checkbox {
          position: relative;
          width: 20px;
          height: 20px;
        }

        .form-checkbox input {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .checkbox-mark {
          position: absolute;
          top: 0;
          left: 0;
          width: 20px;
          height: 20px;
          border: 2px solid #EAEEF3;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .form-checkbox input:checked + .checkbox-mark {
          background-color: #4285F4;
          border-color: #4285F4;
        }

        .form-checkbox input:checked + .checkbox-mark:after {
          content: "";
          position: absolute;
          top: 2px;
          left: 6px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      `}</style>
    </div>
  );
};

export default AdditionalOffers; 