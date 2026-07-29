import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";

import { all_routes } from "../router/all_routes";

import ImageWithBasePath from "../../core/common/imageWithBasePath";
import Slider from "react-slick";
import BannerCounter from "../home-Two/counter";
import { useFlightContext } from "../flight/FlightContext";

// Define airport options
const settings = {
  dots: false,
  arrows: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
  draggable: true,
  swipeToSlide: true,
  focusOnSelect: false,
};
const airports = [
  { code: "LON", name: "London", airport: "Heathrow International Airport" },
  {
    code: "JFK",
    name: "New York",
    airport: "John F. Kennedy International Airport",
  },
  { code: "CDG", name: "Paris", airport: "Charles de Gaulle Airport" },
  { code: "DXB", name: "Dubai", airport: "Dubai International Airport" },
  { code: "SIN", name: "Singapore", airport: "Changi Airport" },
  { code: "HND", name: "Tokyo", airport: "Haneda Airport" },
];

const FlightSearch = () => {
  const defaultTime = dayjs("10:30 AM", "h:mm A");
  const [carRadio, setCarRadio] = useState("same-drop");
  const { setFlights, setShowFlightDetails, setLoading } = useFlightContext();

  const routes = all_routes;
  const [flightRadio, setFlightRadio] = useState("oneway");
  const [defaultDate] = useState(dayjs());

  // State for origin and destination airports
  const [origin, setOrigin] = useState(airports[0]);
  const [destination, setDestination] = useState(airports[1]);
  const [departureDate, setDepartureDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [returnDate, setReturnDate] = useState(
    dayjs().add(7, "day").format("YYYY-MM-DD")
  );
  const [cabinClass, setCabinClass] = useState("Economy");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleOriginSelect = (airport) => {
    setOrigin(airport);
  };

  const handleDestinationSelect = (airport) => {
    setDestination(airport);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create search legs based on flight type
    const searchAirLegs = [
      {
        cabinClass: cabinClass,
        departureDate: departureDate,
        destination: destination.code,
        origin: origin.code,
        airline: "",
      },
    ];

    // Add return leg if round trip
    if (flightRadio === "roundtrip") {
      searchAirLegs.push({
        cabinClass: cabinClass,
        departureDate: returnDate,
        destination: origin.code,
        origin: destination.code,
        airline: "",
      });
    }

    const requestBody = {
      search: {
        adults: adults,
        children: children,
        infants: infants,
        nonstop: 0,
        airline: "",
        solutions: 0,
        searchAirLegs: searchAirLegs,
      },
    };

    try {
      const response = await axios.post(
        "https://api.flymefy.com/shopping",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      setFlights(response.data);
      setShowFlightDetails(true);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Flight Search */}
      <div className="banner-form-tab">
        <ul className="nav">
          <li>
            <Link
              to={all_routes.flightList}
              className="nav-link "
              onClick={() =>
                window.history.pushState({}, "", all_routes.flightList)
              }
            >
              <i className="fa-solid fa-plane-up me-2" />
              Flights
            </Link>
          </li>
          <li>
            <Link
              to={all_routes.hotelList}
              className="nav-link"
              onClick={() =>
                window.history.pushState({}, "", all_routes.hotelList)
              }
            >
              <i className="fa-solid fa-hotel me-2" />
              Hotels
            </Link>
          </li>
          <li>
            <Link
              to={all_routes.carList}
              className="nav-link"
              onClick={() =>
                window.history.pushState({}, "", all_routes.carList)
              }
            >
              <i className="fa-solid fa-car me-2" />
              Cars
            </Link>
          </li>
          <li>
            <Link
              to={all_routes.cruiseList}
              className="nav-link active"
              onClick={() =>
                window.history.pushState({}, "", all_routes.cruiseList)
              }
            >
              <i className="fa-solid fa-ship me-2" />
              Cruise
            </Link>
          </li>
          <li>
            <Link
              to={all_routes.tourList}
              className="nav-link"
              onClick={() =>
                window.history.pushState({}, "", all_routes.tourList)
              }
            >
              <i className="fa-solid fa-camera me-2" />
              Tour
            </Link>
          </li>
        </ul>
      </div>
      <div className="banner-form card mb-0">
        <div className="card-body">
          <div>
            <div className="tab-content">
              <div className="tab-pane fade " id="flight">
                <div className="">
                  <div className="">
                    <div className="">
                      <form onSubmit={handleSubmit}>
                        <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="form-check d-flex align-items-center me-3 mb-2">
                              <input
                                className="form-check-input mt-0"
                                type="radio"
                                name="Radio"
                                id="oneway"
                                onChange={() => setFlightRadio("oneway")}
                                checked={flightRadio === "oneway"}
                              />
                              <label
                                className="form-check-label fs-14 ms-2"
                                htmlFor="oneway"
                              >
                                Oneway
                              </label>
                            </div>
                            <div className="form-check d-flex align-items-center me-3 mb-2">
                              <input
                                className="form-check-input mt-0"
                                type="radio"
                                name="Radio"
                                id="roundtrip"
                                onChange={() => setFlightRadio("roundtrip")}
                                checked={flightRadio === "roundtrip"}
                              />
                              <label
                                className="form-check-label fs-14 ms-2"
                                htmlFor="roundtrip"
                              >
                                Round Trip
                              </label>
                            </div>
                          </div>
                          <h6 className="fw-medium fs-16 mb-2">
                            Millions of cheap flights. One simple search
                          </h6>
                        </div>
                        <div
                          className="normal-trip"
                          style={{
                            display: "block",
                          }}
                        >
                          <div className="d-lg-flex">
                            <div className="d-flex form-info">
                              {/* From dropdown */}
                              <div className="form-item dropdown">
                                <div
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="outside"
                                  role="menu"
                                >
                                  <label className="form-label fs-14 text-default mb-1">
                                    From
                                  </label>
                                  <h5>{origin.name}</h5>
                                  <p className="fs-12 mb-0">{origin.airport}</p>
                                </div>
                                <div className="dropdown-menu dropdown-md p-0">
                                  <div className="input-search p-3 border-bottom">
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search Location"
                                      />
                                      <span className="input-group-text px-2 border-start-0">
                                        <i className="isax isax-search-normal" />
                                      </span>
                                    </div>
                                  </div>
                                  <ul>
                                    {airports.map((airport) => (
                                      <li
                                        key={airport.code}
                                        className="border-bottom"
                                      >
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleOriginSelect(airport);
                                          }}
                                        >
                                          <h6 className="fs-16 fw-medium">
                                            {airport.name}
                                          </h6>
                                          <p>{airport.airport}</p>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* To dropdown */}
                              <div className="form-item dropdown ps-2 ps-sm-3">
                                <div
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="outside"
                                  role="menu"
                                >
                                  <label className="form-label fs-14 text-default mb-1">
                                    To
                                  </label>
                                  <h5>{destination.name}</h5>
                                  <p className="fs-12 mb-0">
                                    {destination.airport}
                                  </p>
                                  <span className="way-icon badge badge-primary rounded-pill translate-middle">
                                    <i className="fa-solid fa-arrow-right-arrow-left" />
                                  </span>
                                </div>
                                <div className="dropdown-menu dropdown-md p-0">
                                  <div className="input-search p-3 border-bottom">
                                    <div className="input-group">
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search Location"
                                      />
                                      <span className="input-group-text px-2 border-start-0">
                                        <i className="isax isax-search-normal" />
                                      </span>
                                    </div>
                                  </div>
                                  <ul>
                                    {airports.map((airport) => (
                                      <li
                                        key={airport.code}
                                        className="border-bottom"
                                      >
                                        <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDestinationSelect(airport);
                                          }}
                                        >
                                          <h6 className="fs-16 fw-medium">
                                            {airport.name}
                                          </h6>
                                          <p>{airport.airport}</p>
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Departure Date */}
                              <div className="form-item">
                                <label className="form-label fs-14 text-default mb-1">
                                  Departure
                                </label>
                                <DatePicker
                                  className="form-control datetimepicker"
                                  placeholder="dd/mm/yyyy"
                                  defaultValue={defaultDate}
                                  format="DD-MM-YYYY"
                                  onChange={(date) =>
                                    setDepartureDate(date.format("YYYY-MM-DD"))
                                  }
                                />
                                <p className="fs-12 mb-0">
                                  {defaultDate.format("dddd")}
                                </p>
                              </div>

                              {/* Return Date (if roundtrip) */}
                              <div
                                className="form-item round-drip"
                                style={{
                                  display:
                                    flightRadio === "roundtrip"
                                      ? "block"
                                      : "none",
                                }}
                              >
                                <label className="form-label fs-14 text-default mb-1">
                                  Return
                                </label>
                                <DatePicker
                                  className="form-control datetimepicker"
                                  placeholder="dd/mm/yyyy"
                                  defaultValue={defaultDate.add(7, "day")}
                                  format="DD-MM-YYYY"
                                  onChange={(date) =>
                                    setReturnDate(date.format("YYYY-MM-DD"))
                                  }
                                />
                                <p className="fs-12 mb-0">
                                  {defaultDate.add(7, "day").format("dddd")}
                                </p>
                              </div>

                              {/* Travelers dropdown */}
                              <div className="form-item dropdown">
                                <div
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="outside"
                                  role="menu"
                                >
                                  <label className="form-label fs-14 text-default mb-1">
                                    Travellers and cabin class
                                  </label>
                                  <h5>
                                    {adults + children + infants}{" "}
                                    <span className="fw-normal fs-14">
                                      Persons
                                    </span>
                                  </h5>
                                  <p className="fs-12 mb-0">
                                    {adults} Adult, {cabinClass}
                                  </p>
                                </div>
                                <div className="dropdown-menu dropdown-menu-end dropdown-xl">
                                  <h5 className="mb-3">
                                    Select Travelers &amp; Class
                                  </h5>
                                  <div className="mb-3 border br-10 info-item pb-1">
                                    <h6 className="fs-16 fw-medium mb-2">
                                      Travellers
                                    </h6>
                                    <div className="row">
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <label className="form-label text-gray-9 mb-2">
                                            Adults{" "}
                                            <span className="text-default fw-normal">
                                              ( 12+ Yrs )
                                            </span>
                                          </label>
                                          <div className="d-flex align-items-center">
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() =>
                                                setAdults(
                                                  Math.max(1, adults - 1)
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <span className="mx-3">
                                              {adults}
                                            </span>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() =>
                                                setAdults(adults + 1)
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <label className="form-label text-gray-9 mb-2">
                                            Children{" "}
                                            <span className="text-default fw-normal">
                                              ( 2-12 Yrs )
                                            </span>
                                          </label>
                                          <div className="d-flex align-items-center">
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() =>
                                                setChildren(
                                                  Math.max(0, children - 1)
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <span className="mx-3">
                                              {children}
                                            </span>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() =>
                                                setChildren(children + 1)
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-4">
                                        <div className="mb-3">
                                          <label className="form-label text-gray-9 mb-2">
                                            Infants
                                            <span className="text-default fw-normal">
                                              ( 0-2 Yrs )
                                            </span>
                                          </label>
                                          <div className="d-flex align-items-center">
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() =>
                                                setInfants(
                                                  Math.max(0, infants - 1)
                                                )
                                              }
                                            >
                                              -
                                            </button>
                                            <span className="mx-3">
                                              {infants}
                                            </span>
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() =>
                                                setInfants(infants + 1)
                                              }
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mb-3 border br-10 info-item pb-1">
                                    <h6 className="fs-16 fw-medium mb-2">
                                      Cabin Class
                                    </h6>
                                    <div className="d-flex align-items-center flex-wrap">
                                      <div className="form-check me-3 mb-3">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          value="Economy"
                                          name="cabin-class"
                                          id="economy"
                                          checked={cabinClass === "Economy"}
                                          onChange={() =>
                                            setCabinClass("Economy")
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="economy"
                                        >
                                          Economy
                                        </label>
                                      </div>
                                      <div className="form-check me-3 mb-3">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          value="Premium Economy"
                                          name="cabin-class"
                                          id="premium-economy"
                                          checked={
                                            cabinClass === "Premium Economy"
                                          }
                                          onChange={() =>
                                            setCabinClass("Premium Economy")
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="premium-economy"
                                        >
                                          Premium Economy
                                        </label>
                                      </div>
                                      <div className="form-check me-3 mb-3">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          value="Business"
                                          name="cabin-class"
                                          id="business"
                                          checked={cabinClass === "Business"}
                                          onChange={() =>
                                            setCabinClass("Business")
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="business"
                                        >
                                          Business
                                        </label>
                                      </div>
                                      <div className="form-check mb-3">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          value="First Class"
                                          name="cabin-class"
                                          id="first-class"
                                          checked={cabinClass === "First Class"}
                                          onChange={() =>
                                            setCabinClass("First Class")
                                          }
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="first-class"
                                        >
                                          First Class
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-end">
                                    <button
                                      type="button"
                                      className="btn btn-light btn-sm me-2"
                                      data-bs-dismiss="dropdown"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      data-bs-dismiss="dropdown"
                                    >
                                      Apply
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Search button */}
                            <button
                              type="submit"
                              className="btn btn-primary search-btn rounded"
                            >
                              {"Search"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade " id="Hotels">
                <form>
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                    <h6 className="fw-medium fs-16 mb-2">
                      Book Hotel - Villas, Apartments &amp; more.
                    </h6>
                  </div>
                  <div className="d-lg-flex">
                    <div className="d-flex  form-info">
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
                            defaultValue="Newyork"
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
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Monday</p>
                      </div>
                      <div className="form-item">
                        <label className="form-label fs-14 text-default mb-1">
                          Check Out
                        </label>
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Monday</p>
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
                            4 <span className="fw-normal fs-14">Persons</span>
                          </h5>
                          <p className="fs-12 mb-0">4 Adult, 2 Rooms</p>
                        </div>
                        <div className="dropdown-menu dropdown-menu-end dropdown-xl">
                          <h5 className="mb-3">Select Travelers &amp; Class</h5>
                          <div className="mb-3 border br-10 info-item pb-1">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                  <label className="form-label text-gray-9 mb-2">
                                    Rooms
                                  </label>
                                  <BannerCounter />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                  <label className="form-label text-gray-9 mb-2">
                                    Adults
                                  </label>
                                  <BannerCounter />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                  <label className="form-label text-gray-9 mb-2">
                                    Children{" "}
                                    <span className="text-default fw-normal">
                                      ( 2-12 Yrs )
                                    </span>
                                  </label>
                                  <BannerCounter />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                  <label className="form-label text-gray-9 mb-2">
                                    Infants{" "}
                                    <span className="text-default fw-normal">
                                      ( 0-12 Yrs )
                                    </span>
                                  </label>
                                  <BannerCounter />
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
                                <label
                                  className="form-check-label"
                                  htmlFor="room1"
                                >
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
                                <label
                                  className="form-check-label"
                                  htmlFor="room2"
                                >
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
                                <label
                                  className="form-check-label"
                                  htmlFor="room3"
                                >
                                  Delux
                                </label>
                              </div>
                              <div className="form-check mb-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="room"
                                  id="room4"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="room4"
                                >
                                  Suite
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 border br-10 info-item pb-1">
                            <h6 className="fs-16 fw-medium mb-2">
                              Property Type
                            </h6>
                            <div className="d-flex align-items-center flex-wrap">
                              <div className="form-check me-3 mb-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="property"
                                  id="property1"
                                  defaultChecked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="property1"
                                >
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
                                <label
                                  className="form-check-label"
                                  htmlFor="property2"
                                >
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
                                <label
                                  className="form-check-label"
                                  htmlFor="property3"
                                >
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
                                <label
                                  className="form-check-label"
                                  htmlFor="property4"
                                >
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
                              to={all_routes.flightList}
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
                            defaultValue="$1000 - $15000"
                          />
                          <p className="fs-12 mb-0">20 Offers Available</p>
                        </div>
                        <div className="dropdown-menu dropdown-md p-0">
                          <ul>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  $500 - $2000
                                </h6>
                                <p>Upto 65% offers</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  Upto 65% offers
                                </h6>
                                <p>Upto 40% offers</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  $5000 - $8000
                                </h6>
                                <p>Upto 35% offers</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  $9000 - $11000
                                </h6>
                                <p>Upto 20% offers</p>
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  $11000 - $15000
                                </h6>
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
                </form>
              </div>
              <div className="tab-pane fade" id="Cars">
                <form>
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                    <div className="d-flex align-items-center flex-wrap">
                      <div className="form-check d-flex align-items-center me-3 mb-2">
                        <input
                          className="form-check-input mt-0"
                          type="radio"
                          name="drop"
                          id="same-drop"
                          defaultValue="same-drop"
                          onChange={() => setCarRadio("same-drop")}
                          checked={carRadio === "same-drop" ? true : false}
                        />
                        <label
                          className="form-check-label fs-14 ms-2"
                          htmlFor="same-drop"
                        >
                          Same drop-off
                        </label>
                      </div>
                      <div className="form-check d-flex align-items-center me-3 mb-2">
                        <input
                          className="form-check-input mt-0"
                          type="radio"
                          name="drop"
                          id="different-drop"
                          defaultValue="different-drop"
                          onChange={() => setCarRadio("different-drop")}
                          checked={carRadio === "different-drop" ? true : false}
                        />
                        <label
                          className="form-check-label fs-14 ms-2"
                          htmlFor="different-drop"
                        >
                          Different Drop off
                        </label>
                      </div>
                      <div className="form-check d-flex align-items-center me-3 mb-2">
                        <input
                          className="form-check-input mt-0"
                          type="radio"
                          name="drop"
                          id="airport"
                          defaultValue="airport"
                          onChange={() => setCarRadio("airport")}
                          checked={carRadio === "airport" ? true : false}
                        />
                        <label
                          className="form-check-label fs-14 ms-2"
                          htmlFor="airport"
                        >
                          Airport
                        </label>
                      </div>
                      <div className="form-check d-flex align-items-center me-3 mb-2">
                        <input
                          className="form-check-input mt-0"
                          type="radio"
                          name="drop"
                          id="hourly-drop"
                          defaultValue="hourly-drop"
                          onChange={() => setCarRadio("hourly-drop")}
                          checked={carRadio === "hourly-drop" ? true : false}
                        />
                        <label
                          className="form-check-label fs-14 ms-2"
                          htmlFor="hourly-drop"
                        >
                          Hourly Package
                        </label>
                      </div>
                    </div>
                    <h6 className="fw-medium fs-16 mb-2">
                      Book Car for rental
                    </h6>
                  </div>
                  <div className="d-lg-flex">
                    <div className="d-flex  form-info">
                      <div
                        className="form-item dropdown from-location"
                        style={{
                          display: carRadio === "airport" ? "none" : "block",
                        }}
                      >
                        <div
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="menu"
                        >
                          <label className="form-label fs-14 text-default mb-1">
                            From
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="Newyork"
                          />
                          <p className="fs-12 mb-0">USA</p>
                        </div>
                        <div className="dropdown-menu dropdown-md p-0">
                          <div className="input-search p-3 border-bottom">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search for Cars"
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
                                <p>2000 Cars</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Japan</h6>
                                <p>3000 Cars</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Singapore</h6>
                                <p>8000 Cars</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Russia</h6>
                                <p>8000 Cars</p>
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Germany</h6>
                                <p>6000 Cars</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="form-item dropdown pickup-airport"
                        style={{
                          display: carRadio === "airport" ? "block" : "none",
                        }}
                      >
                        <div
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="menu"
                        >
                          <label className="form-label fs-14 text-default mb-1">
                            From
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="Newyork"
                          />
                          <p className="fs-12 mb-0">
                            Ken International Airport
                          </p>
                        </div>
                        <div className="dropdown-menu dropdown-md p-0">
                          <div className="input-search p-3 border-bottom">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search for Airport"
                              />
                              <span className="input-group-text px-2 border-start-0">
                                <i className="isax isax-search-normal" />
                              </span>
                            </div>
                          </div>
                          <ul>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  Hartsfield-Jackson Atlanta International
                                </h6>
                                <p>USA</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  Dallas/Fort Worth International
                                </h6>
                                <p>USA</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  London Heathrow
                                </h6>
                                <p>UK</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  Seoul Incheon
                                </h6>
                                <p>South Korea</p>
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  Singapore Changi International
                                </h6>
                                <p>Singapore</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="form-item dropdown to-location ps-2 ps-sm-3"
                        style={{
                          display: carRadio === "airport" ? "block" : "none",
                        }}
                      >
                        <div
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="menu"
                        >
                          <label className="form-label fs-14 text-default mb-1">
                            To
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="Newyork"
                          />
                          <p className="fs-12 mb-0">USA</p>
                          <span className="way-icon badge badge-primary rounded-pill translate-middle">
                            <i className="fa-solid fa-arrow-right-arrow-left" />
                          </span>
                        </div>
                        <div className="dropdown-menu dropdown-md p-0">
                          <div className="input-search p-3 border-bottom">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search for Cars"
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
                                <p>2000 Cars</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Japan</h6>
                                <p>3000 Cars</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Singapore</h6>
                                <p>8000 Cars</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Russia</h6>
                                <p>8000 Cars</p>
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Germany</h6>
                                <p>6000 Cars</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="form-item">
                        <label className="form-label fs-14 text-default mb-1">
                          Departure
                        </label>
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Monday</p>
                      </div>
                      <div
                        className="form-item return-drop"
                        style={{
                          display:
                            carRadio === "different-drop" ? "block" : "none",
                        }}
                      >
                        <label className="form-label fs-14 text-default mb-1">
                          Return
                        </label>
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Wednesday</p>
                      </div>
                      <div className="form-item">
                        <label className="form-label fs-14 text-default mb-1">
                          Pickup Time
                        </label>
                        <TimePicker
                          use12Hours
                          defaultValue={defaultTime}
                          format="h:mm A"
                          className="form-control timepicker"
                        />
                      </div>
                      <div
                        className="form-item dropoff-time"
                        style={{
                          display:
                            carRadio === "different-drop" ? "block" : "none",
                        }}
                      >
                        <label className="form-label fs-14 text-default mb-1">
                          Dropoff Time
                        </label>
                        <input
                          type="text"
                          className="form-control timepicker"
                          defaultValue="11:45 PM"
                        />
                      </div>
                      <div
                        className="form-item hourly-time"
                        style={{
                          display:
                            carRadio === "hourly-drop" ? "block" : "none",
                        }}
                      >
                        <label className="form-label fs-14 text-default mb-1">
                          Hours
                        </label>
                        <h5>02 Hrs 10 Kms</h5>
                      </div>
                    </div>

                    <Link
                      to={all_routes.carlist}
                      className="btn btn-primary search-btn rounded"
                    >
                      Search
                    </Link>
                  </div>
                </form>
              </div>
              <div className="tab-pane fade active show" id="Cruise">
                <form>
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                    <h6 className="fw-medium fs-16 mb-2">Search For Cruise</h6>
                  </div>
                  <div className="d-lg-flex">
                    <div className="d-flex  form-info">
                      <div className="form-item dropdown">
                        <div
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="menu"
                        >
                          <label className="form-label fs-14 text-default mb-1">
                            Destination
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="Newyork"
                          />
                          <p className="fs-12 mb-0">USA</p>
                        </div>
                        <div className="dropdown-menu dropdown-md p-0">
                          <div className="input-search p-3 border-bottom">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search Location"
                              />
                              <span className="input-group-text px-2 border-start-0">
                                <i className="isax isax-search-normal" />
                              </span>
                            </div>
                          </div>
                          <ul>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Newyork</h6>
                                <p>Ken International Airport</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Boston</h6>
                                <p>Boston Logan International Airport</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">
                                  Northern Virginia
                                </h6>
                                <p>Dulles International Airport</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Los Angeles</h6>
                                <p>Los Angeles International Airport</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Orlando</h6>
                                <p>Orlando International Airport</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="form-item">
                        <label className="form-label fs-14 text-default mb-1">
                          Start Date
                        </label>
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Monday</p>
                      </div>
                      <div className="form-item">
                        <label className="form-label fs-14 text-default mb-1">
                          End Date
                        </label>
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Monday</p>
                      </div>
                      <div className="form-item dropdown">
                        <div
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="menu"
                        >
                          <label className="form-label fs-14 text-default mb-1">
                            Travellers &amp; Cabin{" "}
                          </label>
                          <h5>
                            4 <span className="fw-normal fs-14">Persons</span>
                          </h5>
                          <p className="fs-12 mb-0">4 Adult, 2 Rooms</p>
                        </div>
                        <div className="dropdown-menu dropdown-menu-end dropdown-xl">
                          <h5 className="mb-3">Select Travelers &amp; Class</h5>
                          <div className="mb-3 border br-10 info-item pb-1">
                            <h6 className="fs-16 fw-medium mb-2">Travellers</h6>
                            <div className="row">
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label text-gray-9 mb-2">
                                    Adults{" "}
                                    <span className="text-default fw-normal">
                                      ( 12+ Yrs )
                                    </span>
                                  </label>
                                  <BannerCounter />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label text-gray-9 mb-2">
                                    Childrens{" "}
                                    <span className="text-default fw-normal">
                                      ( 2-12 Yrs )
                                    </span>
                                  </label>
                                  <BannerCounter />
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="mb-3">
                                  <label className="form-label text-gray-9 mb-2">
                                    Infants{" "}
                                    <span className="text-default fw-normal">
                                      ( 0-12 Yrs )
                                    </span>
                                  </label>
                                  <BannerCounter />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mb-3 border br-10 info-item pb-1">
                            <h6 className="fs-16 fw-medium mb-2">
                              Select Cabin
                            </h6>
                            <div className="d-flex align-items-center flex-wrap">
                              <div className="form-check me-3 mb-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="cabin"
                                  id="cabin1"
                                  defaultChecked
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cabin1"
                                >
                                  Solo cabins
                                </label>
                              </div>
                              <div className="form-check me-3 mb-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="cabin"
                                  id="cabin2"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cabin2"
                                >
                                  Balcony
                                </label>
                              </div>
                              <div className="form-check me-3 mb-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  defaultValue="Business"
                                  name="cabin"
                                  id="cabin3"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cabin3"
                                >
                                  Oceanview
                                </label>
                              </div>
                              <div className="form-check mb-3">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="cabin"
                                  id="cabin4"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="cabin4"
                                >
                                  Balcony rooms
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <Link to="#" className="btn btn-light btn-sm me-2">
                              Cancel
                            </Link>

                            <Link
                              to={all_routes.cruiseList}
                              className="btn btn-primary btn-sm"
                            >
                              Apply
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={all_routes.cruiseList}
                      className="btn btn-primary search-btn rounded"
                    >
                      Search
                    </Link>
                  </div>
                </form>
              </div>
              <div className="tab-pane fade" id="Tour">
                <form>
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                    <h6 className="fw-medium fs-16 mb-2">
                      Search holiday packages &amp; trips
                    </h6>
                  </div>
                  <div className="d-lg-flex">
                    <div className="d-flex  form-info">
                      <div className="form-item dropdown">
                        <div
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="menu"
                        >
                          <label className="form-label fs-14 text-default mb-1">
                            Where would like to go?
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue="Newyork"
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
                                <p>200 Places</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Japan</h6>
                                <p>300 Places</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Singapore</h6>
                                <p>80 Places</p>
                              </Link>
                            </li>
                            <li className="border-bottom">
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Russia</h6>
                                <p>500 Places</p>
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <h6 className="fs-16 fw-medium">Germany</h6>
                                <p>150 Places</p>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="form-item">
                        <label className="form-label fs-14 text-default mb-1">
                          Dates
                        </label>
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Monday</p>
                      </div>
                      <div className="form-item">
                        <label className="form-label fs-14 text-default mb-1">
                          Check Out
                        </label>
                        <DatePicker
                          className="form-control datetimepicker"
                          placeholder="dd/mm/yyyy"
                          defaultValue={defaultDate}
                          format="DD-MM-YYYY"
                        />
                        <p className="fs-12 mb-0">Wednesday</p>
                      </div>
                      <div className="form-item dropdown">
                        <div
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          role="menu"
                        >
                          <label className="form-label fs-14 text-default mb-1">
                            Travellers
                          </label>
                          <h5>
                            4 <span className="fw-normal fs-14">Persons</span>
                          </h5>
                          <p className="fs-12 mb-0">2 Adult</p>
                        </div>
                        <div className="dropdown-menu dropdown-menu-end dropdown-xl">
                          <h5 className="mb-3">Select Travelers</h5>
                          <div className="mb-3 border br-10 info-item pb-1">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                  <label className="form-label text-gray-9 mb-2">
                                    Adult
                                  </label>
                                  <BannerCounter />
                                </div>
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                  <label className="form-label text-gray-9 mb-2">
                                    Childrens{" "}
                                    <span className="text-default fw-normal">
                                      ( 12+ Yrs )
                                    </span>
                                  </label>
                                  <BannerCounter />
                                </div>
                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                  <label className="form-label text-gray-9 mb-2">
                                    Infants{" "}
                                    <span className="text-default fw-normal">
                                      ( 12+ Yrs )
                                    </span>
                                  </label>
                                  <BannerCounter />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <Link to="#" className="btn btn-light btn-sm me-2">
                              Cancel
                            </Link>
                            <Link
                              to={all_routes.tourList}
                              className="btn btn-primary btn-sm"
                            >
                              Apply
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      to={all_routes.tourList}
                      className="btn btn-primary search-btn rounded"
                    >
                      Search
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="mb-3 mt-2">
          <h5 className="mb-2">Choose type of Cruise you are interested</h5>
        </div>
        <div className="row">
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <div className="d-flex align-items-center hotel-type-item mb-3">
              <Link to={routes.cruiseGrid} className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/cruise/cruise-04.jpg"
                  className="rounded-circle"
                  alt="img"
                />
              </Link>
              <div className="ms-2">
                <h6 className="fs-16 fw-medium">
                  <Link to={routes.cruiseGrid}>Luxury Cruise</Link>
                </h6>
                <p className="fs-14">216 Cruises</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <div className="d-flex align-items-center hotel-type-item mb-3">
              <Link to={routes.cruiseGrid} className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/cruise/cruise-02.jpg"
                  className="rounded-circle"
                  alt="img"
                />
              </Link>
              <div className="ms-2">
                <h6 className="fs-16 fw-medium">
                  <Link to={routes.cruiseGrid}>Adventure Cruise</Link>
                </h6>
                <p className="fs-14">569 Cruises</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <div className="d-flex align-items-center hotel-type-item mb-3">
              <Link to={routes.cruiseGrid} className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/cruise/cruise-03.jpg"
                  className="rounded-circle"
                  alt="img"
                />
              </Link>
              <div className="ms-2">
                <h6 className="fs-16 fw-medium">
                  <Link to={routes.cruiseGrid}>River Cruise</Link>
                </h6>
                <p className="fs-14">129 Cruises</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <div className="d-flex align-items-center hotel-type-item mb-3">
              <Link to={routes.cruiseGrid} className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/cruise/cruise-04.jpg"
                  className="rounded-circle"
                  alt="img"
                />
              </Link>
              <div className="ms-2">
                <h6 className="fs-16 fw-medium">
                  <Link to={routes.cruiseGrid}>Family Cruise</Link>
                </h6>
                <p className="fs-14">150 Cruises</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <div className="d-flex align-items-center hotel-type-item mb-3">
              <Link to={routes.cruiseGrid} className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/cruise/cruise-05.jpg"
                  className="rounded-circle"
                  alt="img"
                />
              </Link>
              <div className="ms-2">
                <h6 className="fs-16 fw-medium">
                  <Link to={routes.cruiseGrid}>Sailing Cruises</Link>
                </h6>
                <p className="fs-14">200 Cruises</p>
              </div>
            </div>
          </div>
          <div className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
            <div className="d-flex align-items-center hotel-type-item mb-3">
              <Link to={routes.cruiseGrid} className="avatar avatar-lg">
                <ImageWithBasePath
                  src="assets/img/cruise/cruise-06.jpg"
                  className="rounded-circle"
                  alt="img"
                />
              </Link>
              <div className="ms-2">
                <h6 className="fs-16 fw-medium">
                  <Link to={routes.cruiseGrid}>World Cruises</Link>
                </h6>
                <p className="fs-14">320 Cruises</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightSearch;
