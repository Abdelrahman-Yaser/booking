"use client";
import React, { useState, useRef, useEffect } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { FaPlane, FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaHotel, FaCar, FaShip, FaUmbrellaBeach, FaCalendar, FaRoute, FaSuitcase, FaExchangeAlt, FaUser, FaUsers, FaChild, FaPlaneArrival, FaPlaneDeparture, FaTag, FaFire, FaClock } from "react-icons/fa";
import { GitCompareArrows } from "lucide-react";
import airportsData from "../../data/airports.json";

const CompleteSearchEngine = ({ isFlightListPage = false }) => {
  
  // Test component first
  return (
    <div style={{ padding: '20px', background: 'white', minHeight: '200px' }}>
      <h2>Search Engine Test</h2>
      <p>If you can see this, the component is loading correctly.</p>
      <button style={{ padding: '10px 20px', background: '#530a66', color: 'white', border: 'none', borderRadius: '5px' }}>
        Test Button
      </button>
    </div>
  );
};

export default CompleteSearchEngine;