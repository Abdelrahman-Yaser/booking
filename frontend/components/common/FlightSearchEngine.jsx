import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useFlightContext } from "./FlightContext";
import {
  FaPlane,
  FaCalendarAlt,
  FaLuggageCart,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { GitCompareArrows, XIcon } from "lucide-react";
import BannerCounter from "../home-Two/counter";
import { all_routes } from "../router/all_routes";
import HoteltSearch from "../hotel/searchOption";

// Debounce utility to limit API calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const defaultDate = dayjs().add(1, "day");
const defaultTime = dayjs("10:30 AM", "h:mm A");

const FlightSearch = () => {
  const {
    searchParams,
    setSearchParams,
    setFlights,
    setShowFlightDetails,
    setLoading,
  } = useFlightContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isFlightListPage = location.pathname === "/flight/flight-list";

  const [carRadio, setCarRadio] = useState("same-drop");
  const [trips, setTrips] = useState([
    {
      originSearchTerm: searchParams.origin
        ? `${searchParams.origin.name} (${searchParams.origin.code})`
        : "",
      destinationSearchTerm: searchParams.destination
        ? `${searchParams.destination.name} (${searchParams.destination.code})`
        : "",
      origin: searchParams.origin || null,
      destination: searchParams.destination || null,
      departureDate:
        searchParams.departureDate || defaultDate.format("YYYY-MM-DD"),
      originGroupedAirports: [], // Changed to store grouped data
      destinationGroupedAirports: [], // Changed to store grouped data
      prevOriginGroupedAirports: [],
      prevDestinationGroupedAirports: [],
      isOriginDropdownOpen: false,
      isDestinationDropdownOpen: false,
    },
  ]);
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [error, setError] = useState(null);
  const [showIframe, setShowIframe] = useState(false);
  const [showPricingCalendar, setShowPricingCalendar] = useState(false);
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
  const [includeCheckedBaggage, setIncludeCheckedBaggage] = useState(false);
  const [compareFlights, setCompareFlights] = useState(false);
  const [originalFlights, setOriginalFlights] = useState(null);

  const originInputRefs = useRef([]);
  const destinationInputRefs = useRef([]);

  useEffect(() => {
    originInputRefs.current = trips.map(
      (_, i) => originInputRefs.current[i] || React.createRef()
    );
    destinationInputRefs.current = trips.map(
      (_, i) => destinationInputRefs.current[i] || React.createRef()
    );
  }, [trips.length]);

  const API_BASE_URL = "https://api.flymefy.com";
  const COMPARISON_URL = "https://search.flymefy.com/flights/";

  // Fetch and group airports based on search term
  const fetchAirports = useCallback(async (query, setter, tripIndex, type) => {
    if (!query || query.length < 3) {
      setter([]);
      return;
    }
    setLoadingAirports(true);
    setError(null);

    // Get language and currency from localStorage or use defaults
    const storedLanguage = localStorage.getItem("preferredLanguage") || "ar";
    const storedCurrency = localStorage.getItem("preferredCurrency") || "TR";

    try {
      const response = await axios.get(
        `${API_BASE_URL}/search/airports?query=${query}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Accept-Language": storedLanguage, // Dynamic language from localStorage
            "X-Currency": storedCurrency, // Dynamic currency from localStorage
          },
        }
      );

      // Group airports by city and country using the cities object
      const cities = response.data.cities;
      const groupedAirports = Object.keys(cities).map((cityCode) => {
        const airports = cities[cityCode];
        const cityAirport = airports[0]; // Use the first airport to get city and country details
        return {
          city: cityAirport.state_name,
          country: cityAirport.country_name,
          cityCode: cityCode,
          airports: airports.map((airport) => ({
            code: airport.iata,
            name: airport.name,
            state_name: airport.state_name,
            state_code: airport.state_code,
            country_name: airport.country_name,
            iata: airport.iata,
          })),
        };
      });

      setter(groupedAirports);
      setTrips((prev) => {
        const updated = [...prev];
        updated[tripIndex][
          type === "origin"
            ? "originGroupedAirports"
            : "destinationGroupedAirports"
        ] = groupedAirports;
        updated[tripIndex][
          type === "origin"
            ? "prevOriginGroupedAirports"
            : "prevDestinationGroupedAirports"
        ] = groupedAirports;
        return updated;
      });
    } catch (err) {
      console.error(`Error fetching ${type} airports:`, err.message);
      setError("Failed to load airports. Please try again.");
      setter([]);
    } finally {
      setLoadingAirports(false);
    }
  }, []);

  const debouncedFetchAirports = useCallback(debounce(fetchAirports, 300), [
    fetchAirports,
  ]);

  const handleOriginInputClick = (index) => {
    const searchTerm = trips[index].originSearchTerm;
    const baseQuery = searchTerm.split(" (")[0].trim();
    const query = baseQuery.slice(0, 3);
    if (query.length >= 3) {
      debouncedFetchAirports(
        query,
        (groupedAirports) =>
          handleTripChange(index, "originGroupedAirports", groupedAirports),
        index,
        "origin"
      );
    } else {
      handleTripChange(index, "originGroupedAirports", []);
    }
    handleTripChange(index, "isOriginDropdownOpen", true);
  };

  const handleDestinationInputClick = (index) => {
    const searchTerm = trips[index].destinationSearchTerm;
    const baseQuery = searchTerm.split(" (")[0].trim();
    const query = baseQuery.slice(0, 3);
    if (query.length >= 3) {
      debouncedFetchAirports(
        query,
        (groupedAirports) =>
          handleTripChange(
            index,
            "destinationGroupedAirports",
            groupedAirports
          ),
        index,
        "destination"
      );
    } else {
      handleTripChange(index, "destinationGroupedAirports", []);
    }
    handleTripChange(index, "isDestinationDropdownOpen", true);
  };

  const handleOriginSearch = (index, e) => {
    const query = e.target.value.trim();
    handleTripChange(index, "originSearchTerm", query);
    handleTripChange(index, "isOriginDropdownOpen", true);
    if (query.length >= 3) {
      debouncedFetchAirports(
        query,
        (groupedAirports) =>
          handleTripChange(index, "originGroupedAirports", groupedAirports),
        index,
        "origin"
      );
    } else {
      handleTripChange(index, "originGroupedAirports", []);
    }
  };

  const handleDestinationSearch = (index, e) => {
    const query = e.target.value.trim();
    handleTripChange(index, "destinationSearchTerm", query);
    handleTripChange(index, "isDestinationDropdownOpen", true);
    if (query.length >= 3) {
      debouncedFetchAirports(
        query,
        (groupedAirports) =>
          handleTripChange(
            index,
            "destinationGroupedAirports",
            groupedAirports
          ),
        index,
        "destination"
      );
    } else {
      handleTripChange(index, "destinationGroupedAirports", []);
    }
  };

  const handleOriginSelect = (index, item, isCity = false) => {
    const selectedItem = isCity
      ? {
          code: item.cityCode,
          name: item.city,
          state_name: item.city,
          state_code: item.cityCode,
          country_name: item.country,
          iata: item.cityCode,
        }
      : item;

    handleTripChange(index, "origin", selectedItem);
    handleTripChange(
      index,
      "originSearchTerm",
      isCity ? `${item.city}, ${item.country}` : `${item.name} (${item.iata})`
    );
    handleTripChange(index, "originGroupedAirports", []);
    handleTripChange(index, "isOriginDropdownOpen", false);
    setTimeout(() => destinationInputRefs.current[index]?.current?.focus(), 0);
  };

  const handleDestinationSelect = (index, item, isCity = false) => {
    const selectedItem = isCity
      ? {
          code: item.cityCode,
          name: item.city,
          state_name: item.city,
          state_code: item.cityCode,
          country_name: item.country,
          iata: item.cityCode,
        }
      : item;

    if (trips[index].origin?.iata === selectedItem.iata) {
      alert("Origin and destination cannot be the same.");
      return;
    }

    handleTripChange(index, "destination", selectedItem);
    handleTripChange(
      index,
      "destinationSearchTerm",
      isCity ? `${item.city}, ${item.country}` : `${item.name} (${item.iata})`
    );
    handleTripChange(index, "destinationGroupedAirports", []);
    handleTripChange(index, "isDestinationDropdownOpen", false);
  };

  const handleTripChange = (index, field, value) => {
    const updatedTrips = [...trips];
    updatedTrips[index][field] = value;
    setTrips(updatedTrips);
    if (index === 0) {
      setSearchParams({
        ...searchParams,
        origin: updatedTrips[0].origin,
        destination: updatedTrips[0].destination,
        departureDate: updatedTrips[0].departureDate,
      });
    }
  };

  const handleAddTrip = () => {
    if (trips.length >= 6) return;
    setTrips([
      ...trips,
      {
        originSearchTerm: "",
        destinationSearchTerm: "",
        origin: null,
        destination: null,
        departureDate: defaultDate.format("YYYY-MM-DD"),
        originGroupedAirports: [],
        destinationGroupedAirports: [],
        prevOriginGroupedAirports: [],
        prevDestinationGroupedAirports: [],
        isOriginDropdownOpen: false,
        isDestinationDropdownOpen: false,
      },
    ]);
  };

  const handleRemoveTrip = (index) => {
    if (trips.length === 1) return;
    setTrips(trips.filter((_, i) => i !== index));
  };

  const handleSwitch = (index) => {
    const trip = trips[index];
    if (trip.origin || trip.destination) {
      const updatedTrips = [...trips];
      const tempOrigin = trip.origin;
      const tempDestination = trip.destination;
      updatedTrips[index].origin = tempDestination;
      updatedTrips[index].destination = tempOrigin;
      updatedTrips[index].originSearchTerm = tempDestination
        ? `${tempDestination.name} (${tempDestination.code})`
        : "";
      updatedTrips[index].destinationSearchTerm = tempOrigin
        ? `${tempOrigin.name} (${tempOrigin.code})`
        : "";
      setTrips(updatedTrips);
      if (index === 0) {
        setSearchParams({
          ...searchParams,
          origin: tempDestination,
          destination: tempOrigin,
        });
      }
    }
  };

  const generateComparisonUrl = () => {
    let url = COMPARISON_URL;
    trips.forEach((trip, index) => {
      if (!trip.origin || !trip.destination) return;
      const date = dayjs(trip.departureDate).format("DDMM");
      if (index === 0) {
        url += `${trip.origin.code}${date}${trip.destination.code}`;
      } else {
        const prevTrip = trips[index - 1];
        url +=
          prevTrip.destination.code === trip.origin.code
            ? `${date}${trip.destination.code}`
            : `-${trip.origin.code}${date}${trip.destination.code}`;
      }
    });
    url += `${searchParams.adults}${searchParams.children}${searchParams.infants}`;
    return url;
  };

  const handleCompareClick = () => {
    setCompareFlights(true);
    setShowIframe(true);
  };

  const applyFilters = (flightData) => {
    if (!flightData || typeof flightData !== "object") return flightData;

    let filteredFlights = { ...flightData };
    let entries = Object.entries(filteredFlights);

    if (includeCheckedBaggage) {
      entries = entries.filter(([_, flight]) => {
        if (!flight?.baggageMap?.ADT) return false;
        return flight.baggageMap.ADT.some((baggage) => {
          const amount = parseInt(
            baggage.baggageAmount?.replace("PC", "") || 0
          );
          return amount > 0;
        });
      });
    }

    return Object.fromEntries(entries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trips[0].origin || !trips[0].destination) {
      alert("Please select origin and destination airports.");
      return;
    }
    navigate("/flight/flight-list");
    setLoading(true);

    let searchAirLegs = trips.map((trip) => ({
      cabinClass: searchParams.cabinClass,
      departureDate: trip.departureDate,
      destination: trip.destination.code,
      origin: trip.origin.code,
      airline: "",
      nonstop: directFlightsOnly ? 1 : 0,
    }));

    if (searchParams.flightRadio === "roundtrip") {
      searchAirLegs.push({
        cabinClass: searchParams.cabinClass,
        departureDate: searchParams.returnDate,
        destination: trips[0].origin.code,
        origin: trips[0].destination.code,
        airline: "",
        nonstop: directFlightsOnly ? 1 : 0,
      });
    }

    const requestBody = {
      search: {
        adults: searchParams.adults,
        children: searchParams.children,
        infants: searchParams.infants,
        nonstop: directFlightsOnly ? 1 : 0,
        airline: "",
        solutions: 0,
        searchAirLegs,
        showPricingCalendar,
      },
    };

    try {
      console.log("Submitting flight search:", requestBody);
      const response = await axios.post(
        `${API_BASE_URL}/shopping`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      const rawData = response.data;
      setOriginalFlights(rawData);
      const filteredFlights = applyFilters(rawData);
      console.log("Filtered Flights:", filteredFlights);
      setFlights(filteredFlights);
      setShowFlightDetails(true);
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert("Failed to search flights. Please try again.");
    } finally {
      setLoading(false);
      setTrips((prev) =>
        prev.map((trip, index) => ({
          ...trip,
          isOriginDropdownOpen:
            index === 0 && trip.prevOriginGroupedAirports.length > 0,
          isDestinationDropdownOpen:
            index === 0 && trip.prevDestinationGroupedAirports.length > 0,
          originGroupedAirports:
            index === 0 && trip.prevOriginGroupedAirports.length > 0
              ? trip.prevOriginGroupedAirports
              : trip.originGroupedAirports,
          destinationGroupedAirports:
            index === 0 && trip.prevDestinationGroupedAirports.length > 0
              ? trip.prevDestinationGroupedAirports
              : trip.destinationGroupedAirports,
        }))
      );
    }
  };

  useEffect(() => {
    if (originalFlights) {
      const filteredFlights = applyFilters(originalFlights);
      setFlights(filteredFlights);
    }
  }, [includeCheckedBaggage, originalFlights]);

  return (
    <div className="mb-0">
      <div className="card-body">
        <div className="banner-form card mb-0">
          <div className="card-body">
            <div className="banner-form-tab">
              <ul className="nav">
                <li>
                  <Link
                    to="#"
                    className="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#flight"
                  >
                    <i className="fa-solid fa-plane-up me-2" />
                    Flights
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#Hotels"
                  >
                    <i className="fa-solid fa-hotel me-2" />
                    Hotels
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#Cars"
                  >
                    <i className="fa-solid fa-car me-2" />
                    Cars
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#Cruise"
                  >
                    <i className="fa-solid fa-ship me-2" />
                    Cruise
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#Tour"
                  >
                    <i className="fa-solid fa-camera me-2" />
                    Tour
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="tab-content">
                <div className="tab-pane fade active show" id="flight">
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
                                  onChange={() =>
                                    setSearchParams({
                                      ...searchParams,
                                      flightRadio: "oneway",
                                    })
                                  }
                                  checked={
                                    searchParams.flightRadio === "oneway"
                                  }
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
                                  onChange={() =>
                                    setSearchParams({
                                      ...searchParams,
                                      flightRadio: "roundtrip",
                                    })
                                  }
                                  checked={
                                    searchParams.flightRadio === "roundtrip"
                                  }
                                />
                                <label
                                  className="form-check-label fs-14 ms-2"
                                  htmlFor="roundtrip"
                                >
                                  Round Trip
                                </label>
                              </div>
                              <div className="form-check d-flex align-items-center me-3 mb-2">
                                <input
                                  className="form-check-input mt-0"
                                  type="radio"
                                  name="Radio"
                                  id="multitrip"
                                  onChange={() =>
                                    setSearchParams({
                                      ...searchParams,
                                      flightRadio: "multitrip",
                                    })
                                  }
                                  checked={
                                    searchParams.flightRadio === "multitrip"
                                  }
                                />
                                <label
                                  className="form-check-label fs-14 ms-2"
                                  htmlFor="multitrip"
                                >
                                  Multi Trip
                                </label>
                              </div>
                            </div>
                            <h6 className="fw-medium fs-16 mb-2">
                              Millions of cheap flights. One simple search
                            </h6>
                          </div>
                          <div className="d-flex align-items-center gap-3 mb-3 p-2 rounded">
                            <div className="form-check d-flex align-items-center gap-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="show-pricing-calendar"
                                checked={showPricingCalendar}
                                onChange={(e) =>
                                  setShowPricingCalendar(e.target.checked)
                                }
                                style={{ width: "20px", height: "20px" }}
                              />
                              <label
                                className="form-check-label fw-semibold"
                                htmlFor="show-pricing-calendar"
                                style={{ fontSize: "14px" }}
                              >
                                <FaCalendarAlt className="me-1" />
                                Show Pricing Calendar
                              </label>
                            </div>
                            <div className="form-check d-flex align-items-center gap-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="direct-flights-only"
                                checked={directFlightsOnly}
                                onChange={(e) =>
                                  setDirectFlightsOnly(e.target.checked)
                                }
                                style={{ width: "20px", height: "20px" }}
                              />
                              <label
                                className="form-check-label fw-semibold"
                                htmlFor="direct-flights-only"
                                style={{ fontSize: "14px" }}
                              >
                                <FaPlane className="me-1" />
                                Direct Flights Only
                              </label>
                            </div>
                            <div className="form-check d-flex align-items-center gap-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="include-checked-baggage"
                                checked={includeCheckedBaggage}
                                onChange={(e) =>
                                  setIncludeCheckedBaggage(e.target.checked)
                                }
                                style={{ width: "20px", height: "20px" }}
                              />
                              <label
                                className="form-check-label fw-semibold"
                                htmlFor="include-checked-baggage"
                                style={{ fontSize: "14px" }}
                              >
                                <FaLuggageCart className="me-1" />
                                Include Checked Baggage
                              </label>
                            </div>
                            <div className="flex-grow-1"></div>
                            {isFlightListPage && (
                              <div
                                className="btn btn-dark fw-semibold d-flex align-items-center gap-2"
                                onClick={handleCompareClick}
                              >
                                <GitCompareArrows className="me-1" />
                                Compare Flights
                              </div>
                            )}
                          </div>
                          <div
                            className="normal-trip"
                            style={{
                              display:
                                searchParams.flightRadio === "multitrip"
                                  ? "block"
                                  : "block",
                            }}
                          >
                            {trips.map((trip, index) => (
                              <div
                                key={index}
                                className="d-lg-flex mb-3 mt-3 position-relative"
                              >
                                <div className="d-flex form-info flex-grow-1">
                                  {/* From dropdown */}
                                  <div className="form-item dropdown position-relative">
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
                                        placeholder="Search Origin (e.g., Cairo)"
                                        value={trip.originSearchTerm}
                                        onChange={(e) =>
                                          handleOriginSearch(index, e)
                                        }
                                        onClick={() =>
                                          handleOriginInputClick(index)
                                        }
                                        ref={originInputRefs.current[index]}
                                      />
                                      <p className="fs-12 mb-0">
                                        {trip.origin
                                          ? `${trip.origin.state_name} (${trip.origin.iata})`
                                          : ""}
                                      </p>
                                    </div>
                                    <div
                                      className={`dropdown-menu dropdown-md p-0 ${
                                        trip.isOriginDropdownOpen ? "show" : ""
                                      }`}
                                    >
                                      {loadingAirports &&
                                        trip.originSearchTerm.length >= 3 && (
                                          <div className="p-3 text-muted">
                                            Loading...
                                          </div>
                                        )}
                                      {error &&
                                        trip.originSearchTerm.length >= 3 && (
                                          <div className="alert alert-danger m-3">
                                            <span>{error}</span>
                                            <button
                                              className="btn btn-sm btn-outline-danger ms-2"
                                              onClick={() =>
                                                fetchAirports(
                                                  trip.originSearchTerm,
                                                  (groupedAirports) =>
                                                    handleTripChange(
                                                      index,
                                                      "originGroupedAirports",
                                                      groupedAirports
                                                    ),
                                                  index,
                                                  "origin"
                                                )
                                              }
                                            >
                                              Retry
                                            </button>
                                          </div>
                                        )}
                                      {!loadingAirports && !error && (
                                        <ul
                                          className="dropdown-list"
                                          style={{
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            backgroundColor: "#fff",
                                          }}
                                        >
                                          {trip.originGroupedAirports.length >
                                          0 ? (
                                            trip.originGroupedAirports.map(
                                              (group, groupIndex) => (
                                                <li
                                                  key={group.cityCode}
                                                  className="border-bottom"
                                                >
                                                  {/* Parent (City) Entry */}
                                                  <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      handleOriginSelect(
                                                        index,
                                                        group,
                                                        true
                                                      );
                                                    }}
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent:
                                                        "space-between",
                                                      padding: "10px 15px",
                                                      flexDirection: "column",
                                                      alignItems: "flex-start",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      e.currentTarget.style.backgroundColor =
                                                        "#e6e6fa";
                                                      e.currentTarget.querySelector(
                                                        "svg"
                                                      ).style.color = "#6f42c1";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      e.currentTarget.style.backgroundColor =
                                                        "transparent";
                                                      e.currentTarget.querySelector(
                                                        "svg"
                                                      ).style.color = "#6c757d";
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <FaMapMarkerAlt
                                                        style={{
                                                          marginRight: "10px",
                                                          color: "#6c757d",
                                                        }}
                                                      />
                                                      <span>
                                                        {group.city},{" "}
                                                        {group.country}
                                                      </span>
                                                    </div>
                                                    <span
                                                      className=""
                                                      style={{
                                                        color: "#333",
                                                        fontSize: "12px",
                                                        padding: "5px 10px",
                                                        borderRadius: "1px",
                                                        marginTop: "5px",
                                                      }}
                                                    >
                                                      All Airports
                                                    </span>
                                                  </a>
                                                  {/* Child (Airport) Entries */}
                                                  {group.airports.map(
                                                    (airport) => (
                                                      <a
                                                        key={airport.iata}
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          handleOriginSelect(
                                                            index,
                                                            airport,
                                                            false
                                                          );
                                                        }}
                                                        style={{
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          padding: "10px 15px",
                                                          paddingLeft: "40px", // Indentation for child
                                                        }}
                                                        onMouseEnter={(e) => {
                                                          e.currentTarget.style.backgroundColor =
                                                            "#e6e6fa";
                                                          e.currentTarget.querySelector(
                                                            "svg"
                                                          ).style.color =
                                                            "#6f42c1";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                          e.currentTarget.style.backgroundColor =
                                                            "transparent";
                                                          e.currentTarget.querySelector(
                                                            "svg"
                                                          ).style.color =
                                                            "#6c757d";
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              color: "black",
                                                            }}
                                                          >
                                                            {group.city},{" "}
                                                            {group.country}
                                                          </span>
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "space-between",
                                                            width: "100%",
                                                          }}
                                                        >
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <FaPlane
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                                color:
                                                                  "#6c757d",
                                                              }}
                                                            />
                                                            <span
                                                              style={{
                                                                color: "#333",
                                                              }}
                                                            >
                                                              {airport.name}
                                                            </span>
                                                          </div>
                                                          <span
                                                            className=""
                                                            style={{
                                                              backgroundColor:
                                                                "#758692",
                                                              color: "white",
                                                              fontSize: "12px",
                                                              fontWeight:
                                                                "bold",
                                                              padding:
                                                                "5px 10px",
                                                              borderRadius:
                                                                "5px",
                                                            }}
                                                          >
                                                            {airport.iata}
                                                          </span>
                                                        </div>
                                                      </a>
                                                    )
                                                  )}
                                                </li>
                                              )
                                            )
                                          ) : trip.originSearchTerm.length >=
                                              3 && !trip.origin ? (
                                            <li className="p-3 text-muted">
                                              No airports found
                                            </li>
                                          ) : trip.originSearchTerm.length <
                                              3 && !trip.origin ? (
                                            <li className="p-3 text-muted">
                                              Type at least 3 letters to search
                                            </li>
                                          ) : null}
                                        </ul>
                                      )}
                                    </div>
                                  </div>
                                  {/* To dropdown */}
                                  <div className="form-item dropdown ps-2 ps-sm-3 position-relative">
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
                                        placeholder="Search Destination (e.g., Cairo)"
                                        value={trip.destinationSearchTerm}
                                        onChange={(e) =>
                                          handleDestinationSearch(index, e)
                                        }
                                        onClick={() =>
                                          handleDestinationInputClick(index)
                                        }
                                        ref={
                                          destinationInputRefs.current[index]
                                        }
                                      />
                                      <p className="fs-12 mb-0">
                                        {trip.destination
                                          ? `${trip.destination.state_name} (${trip.destination.iata})`
                                          : ""}
                                      </p>
                                      <span
                                        className="way-icon badge badge-primary rounded-pill translate-middle"
                                        onClick={() => handleSwitch(index)}
                                        title="Switch Origin and Destination"
                                      >
                                        <i className="fa-solid fa-arrow-right-arrow-left" />
                                      </span>
                                    </div>
                                    <div
                                      className={`dropdown-menu dropdown-md p-0 ${
                                        trip.isDestinationDropdownOpen
                                          ? "show"
                                          : ""
                                      }`}
                                    >
                                      {loadingAirports &&
                                        trip.destinationSearchTerm.length >=
                                          3 && (
                                          <div className="p-3 text-muted">
                                            Loading...
                                          </div>
                                        )}
                                      {error &&
                                        trip.destinationSearchTerm.length >=
                                          3 && (
                                          <div className="alert alert-danger m-3">
                                            <span>{error}</span>
                                            <button
                                              className="btn btn-sm btn-outline-danger ms-2"
                                              onClick={() =>
                                                fetchAirports(
                                                  trip.destinationSearchTerm,
                                                  (groupedAirports) =>
                                                    handleTripChange(
                                                      index,
                                                      "destinationGroupedAirports",
                                                      groupedAirports
                                                    ),
                                                  index,
                                                  "destination"
                                                )
                                              }
                                            >
                                              Retry
                                            </button>
                                          </div>
                                        )}
                                      {!loadingAirports && !error && (
                                        <ul
                                          className="dropdown-list"
                                          style={{
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            backgroundColor: "#fff",
                                          }}
                                        >
                                          {trip.destinationGroupedAirports
                                            .length > 0 ? (
                                            trip.destinationGroupedAirports.map(
                                              (group, groupIndex) => (
                                                <li
                                                  key={group.cityCode}
                                                  className="border-bottom"
                                                >
                                                  {/* Parent (City) Entry */}
                                                  <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      handleDestinationSelect(
                                                        index,
                                                        group,
                                                        true
                                                      );
                                                    }}
                                                    style={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent:
                                                        "space-between",
                                                      padding: "10px 15px",
                                                      flexDirection: "column",
                                                      alignItems: "flex-start",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                      e.currentTarget.style.backgroundColor =
                                                        "#e6e6fa";
                                                      e.currentTarget.querySelector(
                                                        "svg"
                                                      ).style.color = "#6f42c1";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                      e.currentTarget.style.backgroundColor =
                                                        "transparent";
                                                      e.currentTarget.querySelector(
                                                        "svg"
                                                      ).style.color = "#6c757d";
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                      }}
                                                    >
                                                      <FaMapMarkerAlt
                                                        style={{
                                                          marginRight: "10px",
                                                          color: "#6c757d",
                                                        }}
                                                      />
                                                      <span>
                                                        {group.city},{" "}
                                                        {group.country}
                                                      </span>
                                                    </div>
                                                    <span
                                                      className=""
                                                      style={{
                                                        color: "#333",
                                                        fontSize: "12px",
                                                        padding: "5px 10px",
                                                        borderRadius: "10px",
                                                        marginTop: "5px",
                                                      }}
                                                    >
                                                      All Airports
                                                    </span>
                                                  </a>
                                                  {/* Child (Airport) Entries */}
                                                  {group.airports.map(
                                                    (airport) => (
                                                      <a
                                                        key={airport.iata}
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          handleDestinationSelect(
                                                            index,
                                                            airport,
                                                            false
                                                          );
                                                        }}
                                                        style={{
                                                          display: "flex",
                                                          flexDirection:
                                                            "column",
                                                          padding: "10px 15px",
                                                          paddingLeft: "40px", // Indentation for child
                                                        }}
                                                        onMouseEnter={(e) => {
                                                          e.currentTarget.style.backgroundColor =
                                                            "#e6e6fa";
                                                          e.currentTarget.querySelector(
                                                            "svg"
                                                          ).style.color =
                                                            "#6f42c1";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                          e.currentTarget.style.backgroundColor =
                                                            "transparent";
                                                          e.currentTarget.querySelector(
                                                            "svg"
                                                          ).style.color =
                                                            "#6c757d";
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                          }}
                                                        >
                                                          <span
                                                            style={{
                                                              color: "black",
                                                            }}
                                                          >
                                                            {group.city},{" "}
                                                            {group.country}
                                                          </span>
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "space-between",
                                                            width: "100%",
                                                          }}
                                                        >
                                                          <div
                                                            style={{
                                                              display: "flex",
                                                              alignItems:
                                                                "center",
                                                            }}
                                                          >
                                                            <FaPlane
                                                              style={{
                                                                marginRight:
                                                                  "10px",
                                                                color:
                                                                  "#6c757d",
                                                              }}
                                                            />
                                                            <span
                                                              style={{
                                                                color: "#333",
                                                              }}
                                                            >
                                                              {airport.name}
                                                            </span>
                                                          </div>
                                                          <span
                                                            className=""
                                                            style={{
                                                              backgroundColor:
                                                                "#758692",
                                                              color: "white",
                                                              fontSize: "12px",
                                                              fontWeight:
                                                                "bold",
                                                              padding:
                                                                "5px 10px",
                                                              borderRadius:
                                                                "5px",
                                                            }}
                                                          >
                                                            {airport.iata}
                                                          </span>
                                                        </div>
                                                      </a>
                                                    )
                                                  )}
                                                </li>
                                              )
                                            )
                                          ) : trip.destinationSearchTerm
                                              .length >= 3 &&
                                            !trip.destination ? (
                                            <li className="p-3 text-muted">
                                              No airports found
                                            </li>
                                          ) : trip.destinationSearchTerm
                                              .length < 3 &&
                                            !trip.destination ? (
                                            <li className="p-3 text-muted">
                                              Type at least 3 letters to search
                                            </li>
                                          ) : null}
                                        </ul>
                                      )}
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
                                      defaultValue={dayjs(trip.departureDate)}
                                      format="DD-MM-YYYY"
                                      onChange={(date) =>
                                        handleTripChange(
                                          index,
                                          "departureDate",
                                          date
                                            ? date.format("YYYY-MM-DD")
                                            : defaultDate.format("YYYY-MM-DD")
                                        )
                                      }
                                      disabledDate={(current) =>
                                        current &&
                                        current < dayjs().startOf("day")
                                      }
                                    />
                                    <p className="fs-12 mb-0">
                                      {trip.departureDate
                                        ? dayjs(trip.departureDate).format(
                                            "dddd"
                                          )
                                        : ""}
                                    </p>
                                  </div>
                                  {/* Return Date for Roundtrip */}
                                  <div
                                    className="form-item round-drip"
                                    style={{
                                      display:
                                        searchParams.flightRadio === "roundtrip"
                                          ? "block"
                                          : "none",
                                      marginLeft: "15px",
                                    }}
                                  >
                                    <label className="form-label fs-14 text-default mb-1">
                                      Return
                                    </label>
                                    <DatePicker
                                      className="form-control datetimepicker"
                                      placeholder="dd/mm/yyyy"
                                      defaultValue={dayjs(
                                        searchParams.returnDate
                                      )}
                                      format="DD-MM-YYYY"
                                      onChange={(date) =>
                                        setSearchParams({
                                          ...searchParams,
                                          returnDate: date
                                            ? date.format("YYYY-MM-DD")
                                            : defaultDate.format("YYYY-MM-DD"),
                                        })
                                      }
                                      disabledDate={(current) =>
                                        current &&
                                        current < dayjs().startOf("day")
                                      }
                                    />
                                    <p className="fs-12 mb-0">
                                      {searchParams.returnDate
                                        ? dayjs(searchParams.returnDate).format(
                                            "dddd"
                                          )
                                        : ""}
                                    </p>
                                  </div>
                                  {/* Traveler Info */}
                                  {index === 0 && (
                                    <>
                                      <div className="form-item dropdown ms-3">
                                        <div
                                          data-bs-toggle="dropdown"
                                          data-bs-auto-close="outside"
                                          role="menu"
                                        >
                                          <label className="form-label fs-14 text-default mb-1">
                                            Travellers and cabin class
                                          </label>
                                          <h5>
                                            {searchParams.adults +
                                              searchParams.children +
                                              searchParams.infants}{" "}
                                            <span className="fw-normal fs-14">
                                              Persons
                                            </span>
                                          </h5>
                                          <p className="fs-12 mb-0">
                                            {searchParams.adults} Adult,{" "}
                                            {searchParams.cabinClass}
                                          </p>
                                        </div>
                                        <div className="dropdown-menu dropdown-menu-end dropdown-xl">
                                          <h5 className="mb-3">
                                            Select Travelers & Class
                                          </h5>
                                          <div className="border br-10 info-item pb-1">
                                            <h6 className="fs-16 fw-medium mb-2">
                                              Travellers
                                            </h6>
                                            <div className="row">
                                              <div className="col-md-4">
                                                <label className="form-label text-gray-9">
                                                  Adults{" "}
                                                  <span className="text-default fw-normal">
                                                    (12+ Yrs)
                                                  </span>
                                                </label>
                                                <div className="d-flex align-items-center">
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                      setSearchParams({
                                                        ...searchParams,
                                                        adults: Math.max(
                                                          1,
                                                          searchParams.adults -
                                                            1
                                                        ),
                                                      })
                                                    }
                                                  >
                                                    -
                                                  </button>
                                                  <span className="mx-3">
                                                    {searchParams.adults}
                                                  </span>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                      setSearchParams({
                                                        ...searchParams,
                                                        adults:
                                                          searchParams.adults +
                                                          1,
                                                      })
                                                    }
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              </div>
                                              <div className="col-md-4">
                                                <label className="form-label text-gray-9">
                                                  Children{" "}
                                                  <span className="text-default fw-normal">
                                                    (2-12 Yrs)
                                                  </span>
                                                </label>
                                                <div className="d-flex align-items-center">
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                      setSearchParams({
                                                        ...searchParams,
                                                        children: Math.max(
                                                          0,
                                                          searchParams.children -
                                                            1
                                                        ),
                                                      })
                                                    }
                                                  >
                                                    -
                                                  </button>
                                                  <span className="mx-3">
                                                    {searchParams.children}
                                                  </span>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                      setSearchParams({
                                                        ...searchParams,
                                                        children:
                                                          searchParams.children +
                                                          1,
                                                      })
                                                    }
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              </div>
                                              <div className="col-md-4">
                                                <label className="form-label text-gray-9">
                                                  Infants{" "}
                                                  <span className="text-default fw-normal">
                                                    (0-2 Yrs)
                                                  </span>
                                                </label>
                                                <div className="d-flex align-items-center">
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                      setSearchParams({
                                                        ...searchParams,
                                                        infants: Math.max(
                                                          0,
                                                          searchParams.infants -
                                                            1
                                                        ),
                                                      })
                                                    }
                                                  >
                                                    -
                                                  </button>
                                                  <span className="mx-3">
                                                    {searchParams.infants}
                                                  </span>
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                      setSearchParams({
                                                        ...searchParams,
                                                        infants:
                                                          searchParams.infants +
                                                          1,
                                                      })
                                                    }
                                                  >
                                                    +
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="border br-10 info-item pb-1 mt-3">
                                            <h6 className="fs-16 fw-medium mb-2">
                                              Cabin Class
                                            </h6>
                                            <div className="d-flex align-items-center flex-wrap">
                                              {[
                                                "Economy",
                                                "Premium Economy",
                                                "Business",
                                                "First Class",
                                              ].map((classType) => (
                                                <div
                                                  className="form-check me-3 mb-3"
                                                  key={classType}
                                                >
                                                  <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    value={classType}
                                                    name="cabin-class"
                                                    id={classType
                                                      .toLowerCase()
                                                      .replace(" ", "-")}
                                                    checked={
                                                      searchParams.cabinClass ===
                                                      classType
                                                    }
                                                    onChange={() =>
                                                      setSearchParams({
                                                        ...searchParams,
                                                        cabinClass: classType,
                                                      })
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label"
                                                    htmlFor={classType
                                                      .toLowerCase()
                                                      .replace(" ", "-")}
                                                  >
                                                    {classType}
                                                  </label>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="d-flex justify-content-end mt-3">
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
                                      <div className="d-flex justify-content-end">
                                        <button
                                          type="submit"
                                          className="btn btn-primary search-btn rounded d-flex align-items-center justify-content-center gap-2"
                                        >
                                          <FaSearch />
                                          Get the Cheapest Tickets
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                                {index > 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 mt-3 me-3"
                                    onClick={() => handleRemoveTrip(index)}
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            {searchParams.flightRadio === "multitrip" && (
                              <button
                                type="button"
                                className="btn btn-outline-primary mb-3 mt-3"
                                onClick={handleAddTrip}
                                disabled={trips.length >= 6}
                              >
                                Add Another Trip (Max 6)
                              </button>
                            )}
                          </div>
                          {showIframe && (
                            <div
                              style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                zIndex: 9999,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div
                                style={{
                                  width: "95%",
                                  maxWidth: "1200px",
                                  height: "90%",
                                  background: "white",
                                  borderRadius: "12px",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                <button
                                  onClick={() => {
                                    setShowIframe(false);
                                    setCompareFlights(false);
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "30px",
                                    fontSize: "26px",
                                    fontWeight: "bold",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "orange",
                                    backgroundColor: "transparent",
                                    zIndex: 1000,
                                  }}
                                >
                                  <XIcon size={30} />
                                </button>
                                <iframe
                                  src={generateComparisonUrl()}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    overflow: "auto",
                                  }}
                                  title="Flight Comparison"
                                />
                              </div>
                            </div>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade " id="Hotels">
                  <HoteltSearch />
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
                            checked={
                              carRadio === "different-drop" ? true : false
                            }
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
                <div className="tab-pane fade" id="Cruise">
                  <form>
                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                      <h6 className="fw-medium fs-16 mb-2">
                        Search For Cruise
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
                                  <h6 className="fs-16 fw-medium">
                                    Los Angeles
                                  </h6>
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
                              <Link
                                to="#"
                                className="btn btn-light btn-sm me-2"
                              >
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
                              <Link
                                to="#"
                                className="btn btn-light btn-sm me-2"
                              >
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
      </div>
    </div>
  );
};

export default FlightSearch;
