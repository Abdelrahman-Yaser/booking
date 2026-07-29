import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import countryList from "react-select-country-list";
import Select from "react-select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Flag from "react-flagkit"; // Import Flag component for country flags

import { all_routes } from "../router/all_routes";
import BannerCounter from "../home-Two/counter";
import HotelSlider from "./HotelSlide";

const HoteltSearch = () => {
  const [defaultDate] = useState(dayjs());
  const routes = all_routes;

  const [cabinClass, setCabinClass] = useState("Economy");

  const [carRadio, setCarRadio] = useState("same-drop");
  // State for form inputs
  const [city, setCity] = useState("New York, United States of America");
  const [checkInDate, setCheckInDate] = useState(
    dayjs("2025-03-15", "YYYY-MM-DD")
  );
  const [checkOutDate, setCheckOutDate] = useState(
    dayjs("2025-03-16", "YYYY-MM-DD")
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [priceRange, setPriceRange] = useState("$1000 - $15000");
  const [citizenship, setCitizenship] = useState(null);
  const [earlyCheckIn, setEarlyCheckIn] = useState(null);
  const [lateCheckOut, setLateCheckOut] = useState(null);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [starRating, setStarRating] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);

  // Get country list with flags
  const countryOptions = useMemo(() => {
    return countryList()
      .getData()
      .map((country) => ({
        value: country.value,
        label: country.label,
        code: country.value.toUpperCase(), // ISO2 code for flag
      }));
  }, []);

  // Custom Option rendering with flag
  // Custom Option rendering with flag
  const customOption = ({ innerProps, innerRef, data }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        cursor: "pointer",
      }}
      className="hover:bg-gray-100"
    >
      {data.code && (
        <Flag country={data.code} size={20} style={{ marginRight: "10px" }} />
      )}
      <span>{data.label}</span>
    </div>
  );

  // Custom SingleValue rendering with flag
  // Custom SingleValue rendering with flag
  const customSingleValue = ({ data }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
      }}
    >
      {data.code && (
        <Flag country={data.code} size={20} style={{ marginRight: "8px" }} />
      )}
      <span>{data.label}</span>
    </div>
  );
  // Handle country selection
  const handleCitizenshipChange = (selectedOption) => {
    setCitizenship(selectedOption);
  };

  // Handle star rating selection
  const handleStarRatingChange = (rating) => {
    setStarRating((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  // Handle meal plan selection
  const handleMealPlanChange = (plan) => {
    setMealPlan((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here, e.g., API call
    const searchData = {
      city,
      checkInDate: checkInDate.format("YYYY-MM-DD"),
      checkOutDate: checkOutDate.format("YYYY-MM-DD"),
      adults,
      children,
      infants,
      rooms,
      priceRange,
      citizenship: citizenship ? citizenship.value : "",
      earlyCheckIn: earlyCheckIn ? earlyCheckIn.format("HH:mm") : "",
      lateCheckOut: lateCheckOut ? lateCheckOut.format("HH:mm") : "",
      freeCancellation,
      starRating,
      mealPlan,
    };
    console.log("Search Data:", searchData);
    // Navigate to hotel list or process the search
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
          <h6 className="fw-medium fs-16 mb-2">
            Book Hotel - Villas, Apartments & more.
          </h6>
        </div>
        <div className="d-lg-flex">
          <div className="d-flex form-info">
            <div className="form-item dropdown">
              <div
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="menu"
              >
                <label className="form-label fs-14 text-default mb-1">
                  City, Property name or Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <p className="fs-12 mb-0">USA</p>
              </div>
              <div className="dropdown-menu dropdown-md p-0">
                <div className="input-search p-3 border-bottom">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for City, Property name or Location"
                    />
                    <span className="input-group-text px-2 border-start-0">
                      <i className="isax isax-search-normal" />
                    </span>
                  </div>
                </div>
                <ul>
                  <li className="border-bottom">
                    <Link className="dropdown-item" to="#">
                      <h6 className="fs-16 fw-medium">USA</h6>
                      <p>2000 Properties</p>
                    </Link>
                  </li>
                  <li className="border-bottom">
                    <Link className="dropdown-item" to="#">
                      <h6 className="fs-16 fw-medium">Japan</h6>
                      <p>3000 Properties</p>
                    </Link>
                  </li>
                  <li className="border-bottom">
                    <Link className="dropdown-item" to="#">
                      <h6 className="fs-16 fw-medium">Singapore</h6>
                      <p>8000 Properties</p>
                    </Link>
                  </li>
                  <li className="border-bottom">
                    <Link className="dropdown-item" to="#">
                      <h6 className="fs-16 fw-medium">Russia</h6>
                      <p>8000 Properties</p>
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      <h6 className="fs-16 fw-medium">Germany</h6>
                      <p>2000 Properties</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="form-item">
              <label className="form-label fs-14 text-default mb-1">
                Check In
              </label>
              <DatePicker
                className="form-control datetimepicker"
                placeholder="dd/mm/yyyy"
                value={checkInDate}
                format="MMM D, YYYY"
                onChange={(date) => setCheckInDate(date || dayjs())}
              />
              <p className="fs-12 mb-0">{checkInDate.format("dddd")}</p>
            </div>
            <div className="form-item">
              <label className="form-label fs-14 text-default mb-1">
                Check Out
              </label>
              <DatePicker
                className="form-control datetimepicker"
                placeholder="dd/mm/yyyy"
                value={checkOutDate}
                format="MMM D, YYYY"
                onChange={(date) => setCheckOutDate(date || dayjs())}
              />
              <p className="fs-12 mb-0">{checkOutDate.format("dddd")}</p>
            </div>
            <div className="form-item dropdown">
              <div
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="menu"
              >
                <label className="form-label fs-14 text-default mb-1">
                  Guests
                </label>
                <h5>
                  {adults + children + infants}{" "}
                  <span className="fw-normal fs-14">Guests</span>
                </h5>
                <p className="fs-12 mb-0">
                  {rooms} Room{rooms > 1 ? "s" : ""} for {adults} Adult
                  {adults > 1 ? "s" : ""}
                </p>
              </div>
              <div className="dropdown-menu dropdown-menu-end dropdown-xl">
                <h5 className="mb-3">Select Travelers & Rooms</h5>
                <div className="mb-3 border br-10 info-item pb-1">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3 d-flex align-items-center justify-content-between">
                        <label className="form-label text-gray-9 mb-2">
                          Rooms
                        </label>
                        <BannerCounter value={rooms} onChange={setRooms} />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3 d-flex align-items-center justify-content-between">
                        <label className="form-label text-gray-9 mb-2">
                          Adults
                        </label>
                        <BannerCounter value={adults} onChange={setAdults} />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3 d-flex align-items-center justify-content-between">
                        <label className="form-label text-gray-9 mb-2">
                          Children{" "}
                          <span className="text-default fw-normal">
                            (2-12 Yrs)
                          </span>
                        </label>
                        <BannerCounter
                          value={children}
                          onChange={setChildren}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3 d-flex align-items-center justify-content-between">
                        <label className="form-label text-gray-9 mb-2">
                          Infants{" "}
                          <span className="text-default fw-normal">
                            (0-12 Yrs)
                          </span>
                        </label>
                        <BannerCounter value={infants} onChange={setInfants} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3 border br-10 info-item pb-1">
                  <h6 className="fs-16 fw-medium mb-2">Travellers</h6>
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="form-check me-3 mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="room"
                        id="room1"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="room1">
                        Single
                      </label>
                    </div>
                    <div className="form-check me-3 mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="room"
                        id="room2"
                      />
                      <label className="form-check-label" htmlFor="room2">
                        Double
                      </label>
                    </div>
                    <div className="form-check me-3 mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="room"
                        id="room3"
                      />
                      <label className="form-check-label" htmlFor="room3">
                        Deluxe
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="room"
                        id="room4"
                      />
                      <label className="form-check-label" htmlFor="room4">
                        Suite
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-3 border br-10 info-item pb-1">
                  <h6 className="fs-16 fw-medium mb-2">Property Type</h6>
                  <div className="d-flex align-items-center flex-wrap">
                    <div className="form-check me-3 mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="property"
                        id="property1"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="property1">
                        Villa
                      </label>
                    </div>
                    <div className="form-check me-3 mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="property"
                        id="property2"
                      />
                      <label className="form-check-label" htmlFor="property2">
                        Condo
                      </label>
                    </div>
                    <div className="form-check me-3 mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="property"
                        id="property3"
                      />
                      <label className="form-check-label" htmlFor="property3">
                        Cabin
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="property"
                        id="property4"
                      />
                      <label className="form-check-label" htmlFor="property4">
                        Apartments
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <Link to="#" className="btn btn-light btn-sm me-2">
                    Cancel
                  </Link>
                  <Link
                    to={all_routes.hotelList}
                    className="btn btn-primary btn-sm"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            </div>
            <div className="form-item dropdown">
              <div
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="menu"
              >
                <label className="form-label fs-14 text-default mb-1">
                  Price per Night
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <p className="fs-12 mb-0">20 Offers Available</p>
              </div>
              <div className="dropdown-menu dropdown-md p-0">
                <ul>
                  <li className="border-bottom">
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setPriceRange("$500 - $2000")}
                    >
                      <h6 className="fs-16 fw-medium">$500 - $2000</h6>
                      <p>Upto 65% offers</p>
                    </Link>
                  </li>
                  <li className="border-bottom">
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setPriceRange("$2000 - $5000")}
                    >
                      <h6 className="fs-16 fw-medium">$2000 - $5000</h6>
                      <p>Upto 40% offers</p>
                    </Link>
                  </li>
                  <li className="border-bottom">
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setPriceRange("$5000 - $8000")}
                    >
                      <h6 className="fs-16 fw-medium">$5000 - $8000</h6>
                      <p>Upto 35% offers</p>
                    </Link>
                  </li>
                  <li className="border-bottom">
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setPriceRange("$9000 - $11000")}
                    >
                      <h6 className="fs-16 fw-medium">$9000 - $11000</h6>
                      <p>Upto 20% offers</p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setPriceRange("$11000 - $15000")}
                    >
                      <h6 className="fs-16 fw-medium">$11000 - $15000</h6>
                      <p>Upto 10% offers</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Link
            to={all_routes.hotelList}
            className="btn btn-primary search-btn rounded"
          >
            Search
          </Link>
        </div>

        {/* Additional Parameters Section */}
        <div className="mt-3">
          <div className="d-flex align-items-center gap-3">
            <h6 className="fw-medium fs-14 mb-2">Additional Parameters</h6>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="freeCancellation"
                checked={freeCancellation}
                onChange={(e) => setFreeCancellation(e.target.checked)}
                style={{ width: "1.2em", height: "1.2em" }}
              />
              <label
                className="form-check-label ms-1 fs-12"
                htmlFor="freeCancellation"
              >
                Free Cancellation
              </label>
            </div>
          </div>

          <div
            className="d-flex align-items-center gap-3"
            style={{ flexWrap: "nowrap", width: "100%" }}
          >
            {/* Guests' Citizenship */}
            <div
              className="form-group"
              style={{ flex: "1", minWidth: "150px" }}
            >
              <label className="form-label fs-12 text-default mb-1">
                Citizenship
              </label>
              <Select
                options={countryOptions}
                value={
                  countryOptions.find(
                    (option) =>
                      option.value === (citizenship ? citizenship.value : "")
                  ) || null
                }
                onChange={handleCitizenshipChange}
                placeholder="Select Citizenship"
                isSearchable={true}
                isClearable={true}
                components={{
                  Option: customOption,
                  SingleValue: customSingleValue,
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#ced4da",
                    "&:hover": { borderColor: "#ced4da" },
                    minHeight: "34px",
                    height: "34px",
                    fontSize: "14px",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    padding: "0 6px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start", // Align flag and text to the left
                  }),
                  singleValue: (base) => ({
                    ...base,
                    marginLeft: "0", // Remove extra margin to align with flag
                    display: "flex",
                    alignItems: "center",
                  }),
                  input: (base) => ({ ...base, margin: "0", padding: "0" }),
                  indicatorSeparator: (base) => ({ ...base, display: "none" }),
                  dropdownIndicator: (base) => ({ ...base, padding: "2px" }),
                }}
              />
            </div>

            {/* Combined Section for Star Rating and Meal Plan */}
            <div
              className="form-group"
              style={{ flex: "3", minWidth: "400px" }}
            >
              <div className="d-flex align-items-start gap-2 flex-nowrap w-100">
                {/* Star Rating Filter with Title and Star Icons */}
                <div className="form-item d-flex flex-column align-items-center gap-1 flex-grow-1">
                  <label className="form-label fs-12 text-default mb-1 text-center">
                    Star Rating
                  </label>
                  <div className="d-flex align-items-center gap-1">
                    {[
                      "No stars",
                      "2 stars",
                      "3 stars",
                      "4 stars",
                      "5 stars",
                    ].map((rating, index) => (
                      <OverlayTrigger
                        key={index}
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-${rating}`}>{rating}</Tooltip>
                        }
                      >
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            starRating.includes(rating)
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => handleStarRatingChange(rating)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            minWidth: "40px",
                          }}
                        >
                          {index === 0 ? (
                            "No"
                          ) : (
                            <span>
                              {[...Array(index)].map((_, i) => (
                                <i
                                  key={i}
                                  className="fas fa-star text-warning me-1"
                                />
                              ))}
                            </span>
                          )}
                        </button>
                      </OverlayTrigger>
                    ))}
                  </div>
                </div>

                {/* Meal Plan Options with Title */}
                <div className="form-item d-flex flex-column align-items-center gap-1 flex-grow-1">
                  <label className="form-label fs-12 text-default mb-1 text-center">
                    Meal Plan
                  </label>
                  <div className="d-flex align-items-center gap-1">
                    {[
                      { code: "RO", label: "Room Only" },
                      { code: "BB", label: "Bed & Breakfast" },
                      { code: "HB", label: "Half Board" },
                      { code: "FB", label: "Full Board" },
                      { code: "AI", label: "All Inclusive" },
                    ].map((plan) => (
                      <OverlayTrigger
                        key={plan.code}
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-${plan.code}`}>
                            {plan.label}
                          </Tooltip>
                        }
                      >
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            mealPlan.includes(plan.code)
                              ? "btn-primary"
                              : "btn-outline-primary"
                          }`}
                          onClick={() => handleMealPlanChange(plan.code)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "12px",
                            minWidth: "40px",
                          }}
                        >
                          {plan.code}
                        </button>
                      </OverlayTrigger>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Container for Early Check-in and Late Check-out */}
           <div
      className="d-flex align-items-center gap-2"
      style={{ flex: "1", minWidth: "300px" }}
    >
      {/* Early Check-in */}
      <div className="form-item" style={{ flex: "1" }}>
        <label className="form-label text-default mb-1">Early Check-in</label>
        <TimePicker
          className="form-control custom-time-picker" // Add a custom class
          format="h:mm A"
          placeholder="Time"
          onChange={(time) => setEarlyCheckIn(time)}
          value={earlyCheckIn}
          style={{ height: "34px", padding: "0 6px" }} // Keep inline styles for layout
        />
      </div>

      {/* Late Check-out */}
      <div className="form-item" style={{ flex: "1" }}>
        <label className="form-label text-default mb-1">Late Check-out</label>
        <TimePicker
          className="form-control custom-time-picker" // Add a custom class
          format="h:mm A"
          placeholder="Time"
          onChange={(time) => setLateCheckOut(time)}
          value={lateCheckOut}
          style={{ height: "34px", padding: "0 6px" }} // Keep inline styles for layout
        />
      </div>
    </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default HoteltSearch;
