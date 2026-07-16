"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header3 from "@/components/header/header-3";
import Footer3 from "@/components/footer/footer-3";

const FlightBookingPage = () => {
  const params = useParams();
  const flightId = params.id;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [flightData, setFlightData] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "حجز الرحلة - GoTrip";
  }, []);

  // Mock flight data
  useEffect(() => {
    setFlightData({
      id: flightId,
      airline: 'Turkish Airlines',
      flightNumber: 'TK1234',
      from: 'IST',
      to: 'AYT',
      departureTime: '14:30',
      arrivalTime: '16:45',
      date: '2024-01-15',
      duration: '2h 15m',
      price: 145,
      aircraft: 'Boeing 737-800'
    });
  }, [flightId]);

  if (!flightData) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <>
      <div className="header-margin"></div>
      <Header3 />

      <section className="pt-40 pb-40">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center mb-40">
                <h1 className="text-30 fw-600">حجز الرحلة</h1>
                <p className="text-15 text-light-1 mt-10">
                  أكمل بياناتك لإتمام الحجز
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="bg-white rounded-4 shadow-3 px-30 py-30">
                <h3 className="text-22 fw-500 mb-20">تفاصيل الرحلة</h3>
                
                <div className="border-light rounded-4 px-20 py-20">
                  <div className="row y-gap-20">
                    <div className="col-12">
                      <div className="d-flex items-center justify-between">
                        <div>
                          <h4 className="text-18 fw-500">{flightData.airline}</h4>
                          <p className="text-14 text-light-1">{flightData.flightNumber} • {flightData.aircraft}</p>
                        </div>
                        <div className="text-right">
                          <h4 className="text-18 fw-500 text-blue-1">${flightData.price}</h4>
                          <p className="text-14 text-light-1">للشخص الواحد</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-12">
                      <div className="d-flex items-center justify-between">
                        <div>
                          <h5 className="text-16 fw-500">{flightData.from}</h5>
                          <p className="text-14 text-light-1">{flightData.departureTime}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-14 text-light-1">{flightData.duration}</p>
                          <div className="border-top-light"></div>
                          <p className="text-14 text-light-1">مباشر</p>
                        </div>
                        
                        <div className="text-right">
                          <h5 className="text-16 fw-500">{flightData.to}</h5>
                          <p className="text-14 text-light-1">{flightData.arrivalTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-center mt-30">
                  <button 
                    className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
                    onClick={() => alert('سيتم تطوير نظام الحجز الكامل قريباً')}
                  >
                    احجز الآن
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="bg-white rounded-4 shadow-3 px-30 py-30">
                <h4 className="text-18 fw-500 mb-20">ملخص الحجز</h4>
                
                <div className="border-light rounded-4 px-20 py-20">
                  <div className="d-flex items-center justify-between mb-10">
                    <span className="text-14">الرحلة</span>
                    <span className="text-14 fw-500">{flightData.flightNumber}</span>
                  </div>
                  <div className="d-flex items-center justify-between mb-10">
                    <span className="text-14">المسار</span>
                    <span className="text-14 fw-500">{flightData.from} → {flightData.to}</span>
                  </div>
                  <div className="d-flex items-center justify-between">
                    <span className="text-14">السعر</span>
                    <span className="text-18 fw-600 text-blue-1">${flightData.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer3 />
    </>
  );
};

export default FlightBookingPage; 