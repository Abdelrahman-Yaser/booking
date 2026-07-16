"use client";

import { useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AvailableRooms = ({ hotel }) => {
  const router = useRouter();
  const [selectedRoomOptions, setSelectedRoomOptions] = useState({});

  // Slider settings for room images
  const roomSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    adaptiveHeight: true,
  };

  // Custom arrow component
  function Arrow(props) {
    let className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-25 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-25 rounded-full sm:d-none js-prev";
    className += " arrow";
    const char =
      props.type === "next" ? (
        <i className="icon icon-chevron-right text-10"></i>
      ) : (
        <span className="icon icon-chevron-left text-10"></span>
      );
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    );
  }

  // Room images from hotel data or default images
  const roomImages = hotel?.slideImg || [
    "/img/hotels/1.png",
    "/img/hotels/2.png", 
    "/img/hotels/3.png"
  ];

  // Room options data
  const roomOptions = [
    {
      id: 1,
      title: "Standard Option",
      benefits: ["Pay at the hotel", "Pay nothing until March 30, 2022", "Free cancellation before April 1, 2022"],
      price: hotel?.price || 68
    },
    {
      id: 2,
      title: "Premium Option", 
      benefits: ["Pay at the hotel", "Pay nothing until March 30, 2022", "Free cancellation before April 1, 2022"],
      price: (hotel?.price || 68) + 20
    },
    {
      id: 3,
      title: "Luxury Option",
      benefits: ["Pay at the hotel", "Pay nothing until March 30, 2022", "Free cancellation before April 1, 2022"],
      price: (hotel?.price || 68) + 40
    }
  ];

  const handleRoomOptionSelect = (roomType, optionId) => {
    setSelectedRoomOptions(prev => ({
      ...prev,
      [roomType]: optionId
    }));
  };

  const handleReserve = (roomType) => {
    const selectedOption = selectedRoomOptions[roomType];
    if (!selectedOption) {
      alert("الرجاء تحديد خيار الغرفة أولاً");
      return;
    }
    // Navigate to booking page with hotel and room information
    router.push("/booking-page");
  };

  return (
    <>
      {/* Standard Twin Room */}
      <div className="px-30 py-30 sm:px-20 sm:py-20 mb-30">
        <div className="row y-gap-20">
          <div className="col-12">
            <h3 className="text-18 fw-500 mb-15">Standard Twin Room</h3>
            <div className="roomGrid">
              <div className="roomGrid__header text-white" style={{backgroundColor: '#6B46C1'}}>
                <div>Room Type</div>
                <div>Benefits</div>  
                <div>Sleeps</div>
                <div>Price for 5 nights</div>
                <div>Select Rooms</div>
                <div />
              </div>

              <div className="roomGrid__grid" style={{alignItems: 'start'}}>
                <div 
                  className="room-info-container" 
                  style={{
                    borderRadius: '8px',
                    padding: '20px',
                    marginTop: '-130px',
                    alignSelf: 'start',
                    width: '100%'
                  }}
                >
                  <div className="ratio ratio-1:1 mb-20">
                    <div className="position-relative room-slider-container">
                      <Slider
                        {...roomSliderSettings}
                        nextArrow={<Arrow type="next" />}
                        prevArrow={<Arrow type="prev" />}
                      >
                        {roomImages.map((image, i) => (
                          <div key={i} className="slider-item">
                            <Image
                              width={350}
                              height={350}
                              src={image}
                              alt={`Room image ${i + 1}`}
                              className="img-ratio rounded-4 object-cover"
                              priority={i === 0}
                              unoptimized
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>

                  <div className="y-gap-5 mb-20">
                    <div className="d-flex items-center">
                      <i className="icon-no-smoke text-20 mr-10" />
                      <div className="text-15">Non-smoking rooms</div>
                    </div>
                    <div className="d-flex items-center">
                      <i className="icon-wifi text-20 mr-10" />
                      <div className="text-15">Free WiFi</div>
                    </div>
                    <div className="d-flex items-center">
                      <i className="icon-parking text-20 mr-10" />
                      <div className="text-15">Parking</div>
                    </div>
                    <div className="d-flex items-center">
                      <i className="icon-kitchen text-20 mr-10" />
                      <div className="text-15">Kitchen</div>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="d-inline-block text-15 fw-500 underline"
                    style={{color: '#6B46C1', whiteSpace: 'nowrap'}}
                  >
                    Show Room Information
                  </a>
                </div>

                <div className="y-gap-15">
                  {roomOptions.map((option, index) => (
                    <div 
                      key={option.id} 
                      className={`roomGrid__content cursor-pointer ${selectedRoomOptions['standard'] === option.id ? 'selected-option' : ''}`} 
                      style={{
                        border: selectedRoomOptions['standard'] === option.id ? '2px solid #6B46C1' : '1px solid #e5e5e5',
                        borderRadius: '8px',
                        padding: '15px',
                        margin: '5px 0',
                        backgroundColor: selectedRoomOptions['standard'] === option.id ? '#f8f6ff' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleRoomOptionSelect('standard', option.id)}
                    >
                      <div>
                        <div className="text-15 fw-500 mb-10 d-flex items-center" style={{color: '#6B46C1'}}>
                          {selectedRoomOptions['standard'] === option.id && (
                            <i className="icon-check text-12 mr-10" style={{color: '#6B46C1'}} />
                          )}
                          {option.title}
                        </div>
                        <div className="y-gap-8">
                          {option.benefits.map((benefit, idx) => (
                            <div key={idx} className="d-flex items-center text-green-2">
                              <i className="icon-check text-12 mr-10" />
                              <div className="text-15">{benefit}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="d-flex items-center text-light-1">
                          <div className="icon-man text-24" />
                          <div className="icon-man text-24" />
                        </div>
                      </div>

                      <div>
                        <div className="text-18 lh-15 fw-500">
                          US${option.price}
                        </div>
                        <div className="text-14 lh-18 text-light-1">
                          Includes taxes and charges
                        </div>
                      </div>

                      <div>
                        <div className="dropdown js-dropdown js-price-1-active">
                          <select className="form-select dropdown__button d-flex items-center rounded-4 border-light px-15 h-50 text-14">
                            <option value="1" defaultValue>
                              1 (US$ {option.price * 5})
                            </option>
                            <option value="2">2 (US$ {option.price * 10})</option>
                            <option value="3">3 (US$ {option.price * 15})</option>
                            <option value="4">4 (US$ {option.price * 20})</option>
                            <option value="5">5 (US$ {option.price * 25})</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-14 lh-1">
                    {selectedRoomOptions['standard'] ? `Selected: ${roomOptions.find(opt => opt.id === selectedRoomOptions['standard'])?.title}` : 'Select an option'}
                  </div>
                  <div className="text-22 fw-500 lh-17 mt-5">
                    US${selectedRoomOptions['standard'] ? roomOptions.find(opt => opt.id === selectedRoomOptions['standard'])?.price : (hotel?.price || 68)}
                  </div>
                  <button
                    onClick={() => handleReserve('standard')}
                    className="button h-50 px-24 -dark-1 text-white mt-10"
                    style={{backgroundColor: '#6B46C1'}}
                  >
                    Reserve <div className="icon-arrow-top-right ml-15" />
                  </button>
                  <div className="text-15 fw-500 mt-30">
                    You&lsquo;ll be taken to the next step
                  </div>
                  <ul className="list-disc y-gap-4 pt-5">
                    <li className="text-14">Confirmation is immediate</li>
                    <li className="text-14">No registration required</li>
                    <li className="text-14">No booking or credit card fees!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deluxe King Room */}
      <div className="px-30 py-30 sm:px-20 sm:py-20">
        <div className="row y-gap-20">
          <div className="col-12">
            <h3 className="text-18 fw-500 mb-15">Deluxe King Room</h3>
            <div className="roomGrid">
              <div className="roomGrid__header text-white" style={{backgroundColor: '#6B46C1'}}>
                <div>Room Type</div>
                <div>Benefits</div>
                <div>Sleeps</div>
                <div>Price for 5 nights</div>
                <div>Select Rooms</div>
                <div />
              </div>

              <div className="roomGrid__grid" style={{alignItems: 'start'}}>
                <div 
                  className="room-info-container" 
                  style={{
                    borderRadius: '8px',
                    padding: '20px',
                    marginTop: '-130px',
                    alignSelf: 'start',
                    width: '100%'
                  }}
                >
                  <div className="ratio ratio-1:1 mb-20">
                    <div className="position-relative room-slider-container">
                      <Slider
                        {...roomSliderSettings}
                        nextArrow={<Arrow type="next" />}
                        prevArrow={<Arrow type="prev" />}
                      >
                        {roomImages.map((image, i) => (
                          <div key={i} className="slider-item">
                            <Image
                              width={350}
                              height={350}
                              src={image}
                              alt={`Deluxe Room image ${i + 1}`}
                              className="img-ratio rounded-4 object-cover"
                              priority={i === 0}
                              unoptimized
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>

                  <div className="y-gap-5 mb-20">
                    <div className="d-flex items-center">
                      <i className="icon-no-smoke text-20 mr-10" />
                      <div className="text-15">Non-smoking rooms</div>
                    </div>
                    <div className="d-flex items-center">
                      <i className="icon-wifi text-20 mr-10" />
                      <div className="text-15">Free WiFi</div>
                    </div>
                    <div className="d-flex items-center">
                      <i className="icon-parking text-20 mr-10" />
                      <div className="text-15">Parking</div>
                    </div>
                    <div className="d-flex items-center">
                      <i className="icon-kitchen text-20 mr-10" />
                      <div className="text-15">Kitchen</div>
                    </div>
                  </div>

                  <a
                    href="#"
                    className="d-inline-block text-15 fw-500 underline"
                    style={{color: '#6B46C1', whiteSpace: 'nowrap'}}
                  >
                    Show Room Information
                  </a>
                </div>

                <div className="y-gap-15">
                  {roomOptions.map((option, index) => (
                    <div 
                      key={option.id} 
                      className={`roomGrid__content cursor-pointer ${selectedRoomOptions['deluxe'] === option.id ? 'selected-option' : ''}`} 
                      style={{
                        border: selectedRoomOptions['deluxe'] === option.id ? '2px solid #6B46C1' : '1px solid #e5e5e5',
                        borderRadius: '8px',
                        padding: '15px',
                        margin: '5px 0',
                        backgroundColor: selectedRoomOptions['deluxe'] === option.id ? '#f8f6ff' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleRoomOptionSelect('deluxe', option.id)}
                    >
                      <div>
                        <div className="text-15 fw-500 mb-10 d-flex items-center" style={{color: '#6B46C1'}}>
                          {selectedRoomOptions['deluxe'] === option.id && (
                            <i className="icon-check text-12 mr-10" style={{color: '#6B46C1'}} />
                          )}
                          {option.title}
                        </div>
                        <div className="y-gap-8">
                          {option.benefits.map((benefit, idx) => (
                            <div key={idx} className="d-flex items-center text-green-2">
                              <i className="icon-check text-12 mr-10" />
                              <div className="text-15">{benefit}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="d-flex items-center text-light-1">
                          <div className="icon-man text-24" />
                          <div className="icon-man text-24" />
                        </div>
                      </div>

                      <div>
                        <div className="text-18 lh-15 fw-500">
                          US${option.price + 30}
                        </div>
                        <div className="text-14 lh-18 text-light-1">
                          Includes taxes and charges
                        </div>
                      </div>

                      <div>
                        <div className="dropdown js-dropdown js-price-1-active">
                          <select className="form-select dropdown__button d-flex items-center rounded-4 border-light px-15 h-50 text-14">
                            <option value="1" defaultValue>
                              1 (US$ {(option.price + 30) * 5})
                            </option>
                            <option value="2">2 (US$ {(option.price + 30) * 10})</option>
                            <option value="3">3 (US$ {(option.price + 30) * 15})</option>
                            <option value="4">4 (US$ {(option.price + 30) * 20})</option>
                            <option value="5">5 (US$ {(option.price + 30) * 25})</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-14 lh-1">
                    {selectedRoomOptions['deluxe'] ? `Selected: ${roomOptions.find(opt => opt.id === selectedRoomOptions['deluxe'])?.title}` : 'Select an option'}
                  </div>
                  <div className="text-22 fw-500 lh-17 mt-5">
                    US${selectedRoomOptions['deluxe'] ? (roomOptions.find(opt => opt.id === selectedRoomOptions['deluxe'])?.price + 30) : (hotel?.price || 68) + 30}
                  </div>
                  <button
                    onClick={() => handleReserve('deluxe')}
                    className="button h-50 px-24 -dark-1 text-white mt-10"
                    style={{backgroundColor: '#6B46C1'}}
                  >
                    Reserve <div className="icon-arrow-top-right ml-15" />
                  </button>
                  <div className="text-15 fw-500 mt-30">
                    You&lsquo;ll be taken to the next step
                  </div>
                  <ul className="list-disc y-gap-4 pt-5">
                    <li className="text-14">Confirmation is immediate</li>
                    <li className="text-14">No registration required</li>
                    <li className="text-14">No booking or credit card fees!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailableRooms;