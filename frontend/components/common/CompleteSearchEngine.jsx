"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { FaPlane, FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaHotel, FaCar, FaShip, FaUmbrellaBeach, FaCalendar, FaRoute, FaSuitcase, FaExchangeAlt, FaUser, FaUsers, FaChild, FaPlaneArrival, FaPlaneDeparture, FaTag, FaFire, FaClock, FaStar, FaBed, FaUtensils, FaHome, FaBuilding, FaWarehouse, FaCoffee, FaGlassCheers, FaSignInAlt, FaSignOutAlt, FaTaxi, FaBus, FaTrash } from "react-icons/fa";
import { GitCompareArrows } from "lucide-react";
import airportsData from "../../data/airports.json";

const CompleteSearchEngine = ({ isFlightListPage = false, pageType = "general" }) => {
  
  // Add custom styles to match original design + isolated search button
  const customStyles = `
    /* CSS معزول لزر البحث للطيران */
    .isolated-flight-search-btn {
      background: linear-gradient(135deg, #530aa6 0%, #7c3aed 100%) !important;
      border: none !important;
      border-radius: 0 12px 12px 0 !important;
      padding: 0 30px !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      height: 80px !important;
      min-width: 180px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      line-height: 1 !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      margin-left: 15px !important;
      white-space: nowrap !important;
      transition: all 0.3s ease !important;
      color: white !important;
      box-shadow: 0 4px 15px rgba(83, 10, 166, 0.3) !important;
      position: relative !important;
      overflow: hidden !important;
      cursor: pointer !important;
    }
    
    .isolated-flight-search-btn::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: -100% !important;
      width: 100% !important;
      height: 100% !important;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
      transition: left 0.6s !important;
    }
    
    .isolated-flight-search-btn:hover::before {
      left: 100% !important;
    }
    
    .isolated-flight-search-btn:hover {
      background: linear-gradient(135deg, #ff5100 0%, #ff7a00 100%) !important;
      transform: translateX(3px) translateY(-2px) !important;
      box-shadow: 0 8px 25px rgba(255, 81, 0, 0.4) !important;
      color: white !important;
    }
    
    .isolated-flight-search-btn:active {
      transform: translateX(1px) translateY(-1px) !important;
      box-shadow: 0 4px 15px rgba(255, 81, 0, 0.3) !important;
    }
    
    .isolated-flight-search-btn svg {
      margin-right: 8px !important;
      font-size: 18px !important;
      transition: transform 0.3s ease !important;
    }
    
    .isolated-flight-search-btn:hover svg {
      transform: scale(1.1) rotate(10deg) !important;
    }
    .search-btn {
      background: rgb(83, 10, 166) !important;
      border: none !important;
      border-radius: 0 12px 12px 0 !important;
      padding: 0 30px !important;
      font-weight: 600 !important;
      font-size: 16px !important;
      height: 80px !important;
      min-width: 150px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      line-height: 1 !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      margin-left: 15px !important;
      white-space: nowrap !important;
      transition: all 0.3s ease !important;
    }
    
    .search-btn:hover {
      background: rgb(255, 81, 0) !important;
      transform: translateX(2px) !important;
      box-shadow: 0 4px 15px rgba(255, 81, 0, 0.3) !important;
    }
    
    .form-info {
      gap: 0;
      flex: 1;
    }
    
    .form-item {
border-right: 1px solid rgba(224, 224, 224, 0.5);
      padding: 15px 20px;
background: transparent;
      min-height: 80px;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
transition: all 0.3s ease;
position: relative;
z-index: 10;
    }
    
    .form-item:first-child {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    
    .form-item:last-child {
      border-right: none;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    .form-item:hover {
      background: rgba(83, 10, 166, 0.02);
    }
    
    .form-control {
      border: none;
      background: transparent;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      padding: 0;
      box-shadow: none;
    }
    
    .form-control:focus {
      border: none;
      box-shadow: none;
      background: transparent;
    }
    
    .form-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    .fs-12 {
      font-size: 11px;
      color: #999;
      margin-top: 2px;
    }
    
    .banner-form {
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      border-radius: 12px;
      border: none;
      background: #fff;
      padding: 25px;
      margin: 20px 0;
      position: relative;
      z-index: 2;
    }
    
    .nav-tabs {
      border-bottom: 1px solid #e0e0e0;
      justify-content: center;
      margin-bottom: 0;
      padding: 0;
      display: flex;
      background: #f8f9fa;
      border-radius: 20px 20px 0 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: fit-content;
      margin: 0 auto;
    }

    .nav-item {
      margin: 0;
      flex: 1;
      max-width: 140px;
      min-width: 100px;
    }

    .nav-item:not(:last-child) .nav-link {
      border-right: 1px solid #e0e0e0;
    }

    .nav-item:first-child .nav-link {
      border-radius: 20px 0 0 0;
    }

    .nav-item:last-child .nav-link {
      border-radius: 0 20px 0 0;
    }

    .nav-link {
      color: #666;
      font-weight: 500;
      padding: 10px 20px;
      font-size: 13px;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #e0e0e0;
      margin-right: 0;
      background: #f8f9fa;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
    }
    
    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.5s;
    }
    
    .nav-link:hover::before {
      left: 100%;
    }
    
    .nav-link:hover:not(.active) {
      color: rgb(83, 10, 166);
      background: rgba(83, 10, 166, 0.05);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(83, 10, 166, 0.1);
    }
    
    .nav-link:hover:not(.active) svg {
      transform: scale(1.1) rotate(5deg);
      color: rgb(83, 10, 166);
    }
    
    .nav-link.active {
      background: rgb(83, 10, 166) !important;
      color: white !important;
      border-color: rgb(83, 10, 166) !important;
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(83, 10, 166, 0.3);
      font-weight: 600;
      z-index: 10;
      position: relative;
      border-bottom: none !important;
      margin-bottom: 0;
      padding-bottom: 15px;
    }

    .nav-link.active::before {
      display: none;
    }

    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 5px;
      background: rgb(83, 10, 166);
      z-index: 1;
    }

    .nav-link.active svg {
      color: white !important;
      transform: scale(1.1);
    }

    .nav-item:first-child .nav-link.active {
      border-radius: 20px 0 0 0;
    }

    .nav-item:last-child .nav-link.active {
      border-radius: 0 20px 0 0;
    }

    .d-lg-flex {
      overflow: visible;
      margin-bottom: 25px;
      display: flex;
      align-items: stretch;
      height: 80px;
      transition: all 0.3s ease;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      position: relative;
      isolation: isolate;
    }
    
    .d-lg-flex:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.12);
      border-color: rgba(83, 10, 166, 0.3);
    }
    
    .ant-picker {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      padding: 0 !important;
      font-size: 16px !important;
      font-weight: 600 !important;
    }
    
    .ant-picker-dropdown {
      z-index: 9999 !important;
      position: absolute !important;
    }
    
    /* إجبار التاريخ للظهور للأسفل دائماً */
    .ant-picker-dropdown-placement-topLeft,
    .ant-picker-dropdown-placement-topRight,
    .ant-picker-dropdown-placement-bottomLeft,
    .ant-picker-dropdown-placement-bottomRight {
      position: absolute !important;
      transform: translateY(0) !important;
    }
    
    /* إجبار كل DatePicker للظهور للأسفل */
    .ant-picker {
      position: relative !important;
    }
    
    .ant-picker-dropdown {
      top: calc(100% + 5px) !important;
      bottom: auto !important;
      left: 0 !important;
      position: absolute !important;
      transform: none !important;
    }
    
    /* Force travelers dropdown to appear below */
    .travelers-dropdown {
      top: 100% !important;
      bottom: auto !important;
    }
    
    /* تصغير وتجميل التقويم */
    .ant-picker-panel-container {
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.15) !important;
      border-radius: 12px !important;
      border: 1px solid rgba(83, 10, 166, 0.2) !important;
      transform: scale(0.85) !important;
      transform-origin: top left !important;
    }
    
    .ant-picker-panel {
      background: linear-gradient(135deg, #fff 0%, #f8f6ff 100%) !important;
      border-radius: 12px !important;
    }
    
    .ant-picker-header {
      background: rgb(83, 10, 166) !important;
      color: white !important;
      border-radius: 12px 12px 0 0 !important;
      padding: 10px 15px !important;
      border: none !important;
    }
    
    .ant-picker-header-view {
      color: white !important;
      font-weight: 600 !important;
    }
    
    .ant-picker-prev-icon,
    .ant-picker-next-icon,
    .ant-picker-super-prev-icon,
    .ant-picker-super-next-icon {
      color: white !important;
    }
    
    .ant-picker-content {
      padding: 10px !important;
    }
    
    .ant-picker-cell-inner {
      border-radius: 8px !important;
      transition: all 0.3s ease !important;
    }
    
    .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
      background: rgb(83, 10, 166) !important;
      color: white !important;
    }
    
    .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner {
      border: 2px solid rgb(255, 81, 0) !important;
      color: rgb(255, 81, 0) !important;
      font-weight: 600 !important;
    }
    
    .travelers-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #fff 0%, #f8f6ff 100%);
      border: 1px solid rgba(83, 10, 166, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.15);
      z-index: 999999 !important;
      width: 100%;
      max-width: 320px;
      padding: 15px;
      margin-top: 5px;
    }
    
    .travelers-dropdown.show {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    .travelers-dropdown.hide {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
    
    /* Ensure travelers dropdown appears above all elements */
    .form-item:has(.travelers-dropdown) {
      z-index: 999998 !important;
      position: relative !important;
    }
    
    /* Multi-trip container styling */
    .multi-trip-container {
      position: relative !important;
      z-index: 2 !important;
      isolation: isolate !important;
      margin-top: 15px !important;
    }
    
    .multi-trip-container .form-item {
      position: relative !important;
      z-index: 3 !important;
    }
    
    .multi-trip-container .suggestions-dropdown {
      z-index: 999999 !important;
      position: absolute !important;
    }
    
    .multi-trip-container .travelers-dropdown {
      z-index: 999999 !important;
      position: absolute !important;
    }
    
    /* Ensure proper layering hierarchy */
    .banner-form {
      position: relative !important;
      z-index: 1 !important;
    }
    
    /* Main trip container */
    .d-lg-flex:not(.multi-trip-container .d-lg-flex) {
      z-index: 5 !important;
      position: relative !important;
    }
    
    /* Prevent overlapping between different trip containers */
    .multi-trip-container + .multi-trip-container {
      margin-top: 20px !important;
      clear: both !important;
    }
    
    .travelers-dropdown * {
      pointer-events: auto !important;
    }
    
    /* Prevent text mixing and overlapping */
    .travelers-dropdown {
      isolation: isolate !important;
      contain: layout style paint !important;
      z-index: 999999 !important;
      position: absolute !important;
    }
    
    /* Force all hotel section dropdowns to highest z-index */
    .hotel-search .suggestions-dropdown,
    .hotel-search .hotel-guests-dropdown,
    .hotel-search .price-dropdown,
    .hotel-search .time-picker-dropdown,
    .hotel-search .citizenship-dropdown,
    .suggestions-dropdown,
    .hotel-guests-dropdown,
    .price-dropdown,
    .duration-dropdown,
    .citizenship-dropdown,
    .time-picker-dropdown {
      z-index: 99999 !important;
      position: absolute !important;
    }
    
    /* Ensure hotel search container has proper layering */
    .hotel-search {
      position: relative;
      z-index: 5;
    }
    
    /* Hotel form items need higher z-index than filters */
    .hotel-search .form-item {
      position: relative;
      z-index: 15;
    }
    
    /* Ensure proper stacking context */
    .form-item {
      contain: layout !important;
    }
    
    .counter-btn {
      width: 26px;
      height: 26px;
      border: 1px solid rgba(83, 10, 166, 0.3);
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 12px;
      color: rgb(83, 10, 166);
    }
    
    .counter-btn:hover {
      background: rgb(83, 10, 166);
      border-color: rgb(83, 10, 166);
      color: white;
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(83, 10, 166, 0.3);
    }
    
    .counter-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .hotel-guests-dropdown .fw-bold {
      font-size: 13px;
      font-weight: 600;
    }

    .hotel-guests-dropdown .text-muted {
      font-size: 11px;
    }

    .hotel-guests-dropdown .d-flex {
      margin-bottom: 12px;
    }

    .hotel-guests-dropdown .traveler-counter {
      margin-bottom: 10px;
    }

    .travelers-dropdown .fw-bold {
      font-size: 13px;
      font-weight: 600;
    }

    .travelers-dropdown .text-muted {
      font-size: 11px;
    }

    .travelers-dropdown .d-flex {
      margin-bottom: 12px;
    }

    .travelers-dropdown .traveler-counter {
      margin-bottom: 10px;
    }
    
    .swap-btn {
      background: #fff;
      border: 2px solid #e0e0e0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 14px;
      color: rgb(83, 10, 166);
      margin: auto;
      transform: translateY(-50%) rotate(0deg) scale(1);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .swap-btn:hover {
      background: rgb(83, 10, 166);
      color: white;
      transform: translateY(-50%) rotate(180deg) scale(1.1);
      box-shadow: 0 4px 12px rgba(83, 10, 166, 0.3);
      border-color: rgb(83, 10, 166);
    }
    
    .swap-btn:active {
      transform: translateY(-50%) rotate(180deg) scale(0.95);
    }
    
    .trip-type-selector {
      margin-bottom: 20px;
      margin-top: 15px;
    }
    
    .trip-type-selector .btn-group {
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      margin: 8px 0;
    }
    
    .trip-type-selector .btn {
      border: none;
      padding: 8px 16px;
      font-weight: 500;
      font-size: 13px;
      background: #f8f9fa;
      color: #666;
      transition: all 0.3s ease;
      min-width: auto;
      margin: 2px 0;
    }
    
    .trip-type-selector .btn-check:checked + .btn {
      background: rgb(83, 10, 166);
      color: white;
    }
    
    .cabin-class-container {
      margin-top: 15px;
    }

    .cabin-class-title {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .cabin-options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .cabin-option {
      padding: 10px 8px;
      border: 1px solid rgba(83, 10, 166, 0.2);
      border-radius: 8px;
      background: linear-gradient(135deg, #fff 0%, #faf9ff 100%);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      font-size: 11px;
      font-weight: 500;
      color: #666;
      position: relative;
      overflow: hidden;
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cabin-option::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(83, 10, 166, 0.1), transparent);
      transition: left 0.5s;
    }

    .cabin-option:hover::before {
      left: 100%;
    }
    
    .cabin-option:hover {
      border-color: rgb(83, 10, 166);
      background: rgba(83, 10, 166, 0.05);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(83, 10, 166, 0.15);
      color: rgb(83, 10, 166);
    }
    
    .cabin-option.selected {
      background: linear-gradient(135deg, rgb(83, 10, 166) 0%, rgb(103, 30, 186) 100%);
      color: white;
      border-color: rgb(83, 10, 166);
      font-weight: 600;
      box-shadow: 0 3px 12px rgba(83, 10, 166, 0.3);
      transform: translateY(-1px);
    }

    .cabin-option.selected::before {
      display: none;
    }

    .flight-filters {
      display: flex;
      gap: 20px;
      margin: 15px 0;
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      user-select: none;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .filter-checkbox input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: rgb(83, 10, 166);
      cursor: pointer;
      margin-right: 5px;
    }

    .filter-checkbox:hover {
      color: rgb(83, 10, 166);
      background-color: rgba(83, 10, 166, 0.05);
    }

    .filter-checkbox svg {
      color: rgb(83, 10, 166);
      font-size: 14px;
    }

    .filter-text {
      font-weight: 500;
    }

    .nav-link svg {
      font-size: 14px;
      margin-right: 6px;
      flex-shrink: 0;
    }

    .nav-link:hover svg {
      transform: scale(1.1) rotate(5deg);
      color: rgb(83, 10, 166);
    }

    .nav-item:first-child .nav-link.active::after {
      border-radius: 0 0 0 20px;
    }

    .nav-item:last-child .nav-link.active::after {
      border-radius: 0 0 20px 0;
    }

    .tab-content {
      margin-top: 25px;
    }

        .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: linear-gradient(135deg, #fff 0%, #f8f6ff 100%);
      border: 1px solid rgba(83, 10, 166, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.15);
      z-index: 99999 !important;
      max-height: 350px;
      overflow-y: auto;
      margin-top: 5px;
      scrollbar-width: thin;
      scrollbar-color: rgba(83, 10, 166, 0.3) transparent;
      min-width: 280px;
      width: max-content;
      max-width: 500px;
    }

    .suggestions-dropdown::-webkit-scrollbar {
      width: 6px;
    }

    .suggestions-dropdown::-webkit-scrollbar-track {
      background: transparent;
    }

    .suggestions-dropdown::-webkit-scrollbar-thumb {
      background: rgba(83, 10, 166, 0.3);
      border-radius: 3px;
    }

    .suggestions-dropdown::-webkit-scrollbar-thumb:hover {
      background: rgba(83, 10, 166, 0.5);
    }

    .suggestion-item {
      padding: 14px 16px;
      cursor: pointer;
      border-bottom: 1px solid rgba(83, 10, 166, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      white-space: nowrap;
    }

    .suggestion-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(83, 10, 166, 0.1), transparent);
      transition: left 0.5s;
    }

    .suggestion-item:hover::before {
      left: 100%;
    }
    
    .suggestion-item:hover {
      background: rgba(83, 10, 166, 0.08);
      transform: translateX(3px);
      border-left: 3px solid rgb(83, 10, 166);
      padding-left: 13px;
    }
    
    .suggestion-item:last-child {
      border-bottom: none;
    }

    .suggestion-item.city-item {
      background: rgba(83, 10, 166, 0.05);
      border-left: 3px solid rgb(255, 81, 0);
    }

    .suggestion-item.city-item:hover {
      background: rgba(255, 81, 0, 0.1);
      border-left-color: rgb(255, 81, 0);
    }
    
    .airport-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .airport-main-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-direction: row-reverse;
    }

    .airport-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin: 0;
    }
    
    .airport-code {
      background: rgba(83, 10, 166, 0.15);
      color: rgb(83, 10, 166);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      border: 1px solid rgba(83, 10, 166, 0.3);
    }

    .airport-icon {
      color: rgb(83, 10, 166);
      font-size: 14px;
    }
    
    .airport-location {
      font-size: 10px;
      color: #666;
      font-weight: 400;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 2px;
    }

    .city-info {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .city-name {
      font-size: 15px;
      font-weight: 600;
      color: #333;
    }

    .city-airports-count {
      font-size: 11px;
      color: #666;
      background: rgba(255, 81, 0, 0.1);
      padding: 1px 6px;
      border-radius: 8px;
    }
    
    .popular-section {
      padding: 12px 16px;
      background: linear-gradient(135deg, rgb(83, 10, 166) 0%, rgb(103, 30, 186) 100%);
      color: white;
      font-weight: 600;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid rgba(83, 10, 166, 0.2);
    }

    .popular-section .fire-icon {
      color: #ff5100;
      font-size: 14px;
      animation: flicker 1.5s infinite alternate;
    }

    @keyframes flicker {
      0% { opacity: 1; }
      100% { opacity: 0.7; }
    }
    

    
    .citizenship-item {
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .citizenship-item .citizenship-flag {
      font-size: 16px;
      min-width: 20px;
    }

    .citizenship-item .citizenship-name {
      flex: 1;
      font-weight: 500;
    }

    .citizenship-item .citizenship-currency {
      font-size: 10px;
      color: #666;
      font-weight: normal;
    }
    
    .citizenship-item:hover {
      background: rgba(83, 10, 166, 0.05);
    }
    
    .citizenship-item:last-child {
      border-bottom: none;
    }
    
    .citizenship-item.selected {
      background: rgba(83, 10, 166, 0.1);
      color: rgb(83, 10, 166);
      font-weight: 600;
    }
    
    .price-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #fff 0%, #f8f6ff 100%);
      border: 1px solid rgba(83, 10, 166, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.15);
      z-index: 99999 !important;
      margin-top: 5px;
      overflow: hidden;
    }
    
    .price-item {
      padding: 10px 14px;
      cursor: pointer;
      border-bottom: 1px solid rgba(83, 10, 166, 0.1);
      transition: all 0.3s ease;
      font-size: 13px;
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }

    .price-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(83, 10, 166, 0.1), transparent);
      transition: left 0.5s;
    }

    .price-item:hover::before {
      left: 100%;
    }
    
    .price-item:hover {
      background: rgba(83, 10, 166, 0.08);
      color: rgb(83, 10, 166);
      transform: translateX(3px);
      border-left: 3px solid rgb(83, 10, 166);
      padding-left: 11px;
    }
    
    .price-item:last-child {
      border-bottom: none;
    }
    
    .price-item.selected {
      background: linear-gradient(135deg, rgb(83, 10, 166) 0%, rgb(103, 30, 186) 100%);
      color: white;
      font-weight: 600;
      border-left: 3px solid rgb(255, 81, 0);
      padding-left: 11px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    }

    .price-item.selected::before {
      display: none;
    }

    .hotel-guests-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #fff 0%, #f8f6ff 100%);
      border: 1px solid rgba(83, 10, 166, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.15);
      z-index: 99999 !important;
      padding: 15px;
      margin-top: 5px;
      width: 100%;
      max-width: 280px;
    }

    .hotel-filters {
      display: flex;
      gap: 20px;
      margin: 15px 0;
      flex-wrap: nowrap;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .hotel-filters .filter-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      user-select: none;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .hotel-filters .filter-checkbox:hover {
      color: rgb(83, 10, 166);
      background-color: rgba(83, 10, 166, 0.05);
    }

    .hotel-filters .filter-checkbox input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: rgb(83, 10, 166);
      cursor: pointer;
      margin-right: 5px;
    }

    .hotel-filters .filter-checkbox svg {
      color: rgb(83, 10, 166);
      font-size: 14px;
    }

    .time-filter-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 6px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      background: #fff;
      transition: all 0.3s ease;
    }

    .time-filter-label {
      font-size: 10px;
      font-weight: 500;
      color: #666;
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .time-filter-label svg {
      color: rgb(83, 10, 166);
      font-size: 10px;
    }

    .time-filter-input {
      padding: 2px 4px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 9px;
      background: #fff;
      color: #333;
      width: 60px;
      text-align: center;
      cursor: pointer;
    }

    .time-filter-input:focus {
      border-color: rgb(83, 10, 166);
      outline: none;
      box-shadow: 0 0 0 1px rgba(83, 10, 166, 0.1);
    }

    .time-filter-group {
      position: relative;
    }

    .time-picker-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 99999 !important;
      margin-top: 3px;
      min-width: 120px;
      width: 120px;
    }

    .time-picker-header {
      padding: 6px 8px;
      background: rgb(83, 10, 166);
      color: white;
      font-weight: 600;
      font-size: 10px;
      border-radius: 6px 6px 0 0;
      text-align: center;
    }

    .time-options {
      padding: 4px;
      max-height: 140px;
      overflow-y: auto;
    }

    .time-option {
      padding: 4px 6px;
      cursor: pointer;
      border-radius: 3px;
      transition: all 0.2s ease;
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      margin: 1px 0;
    }

    .time-option:hover {
      background: rgba(83, 10, 166, 0.1);
      color: rgb(83, 10, 166);
    }

    .time-option.selected {
      background: rgb(83, 10, 166);
      color: white;
      font-weight: 600;
    }





    .meal-explanation-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(83, 10, 166, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
      backdrop-filter: blur(5px);
    }

    .meal-explanation-content {
      background: linear-gradient(135deg, #fff 0%, #f8f6ff 100%);
      border-radius: 16px;
      padding: 30px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      position: relative;
      border: 2px solid rgba(83, 10, 166, 0.1);
      box-shadow: 0 20px 40px rgba(83, 10, 166, 0.2);
    }

    .meal-explanation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    .meal-explanation-title {
      font-size: 24px;
      font-weight: 700;
      color: rgb(83, 10, 166);
      margin: 0;
    }

    .meal-explanation-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 5px;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .meal-explanation-close:hover {
      background: #f0f0f0;
      color: #333;
    }

    .meal-plan-grid {
      display: grid;
      gap: 15px;
    }

    .meal-plan-card {
      border: 1px solid rgba(83, 10, 166, 0.2);
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, #fff 0%, #faf9ff 100%);
    }

    .meal-plan-card:hover {
      border-color: rgb(83, 10, 166);
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.15);
      transform: translateY(-2px);
    }

    .meal-plan-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .meal-plan-card-icon {
      font-size: 24px;
    }

    .meal-plan-card-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .meal-plan-card-description {
      color: #666;
      line-height: 1.4;
      margin: 0;
    }



    .hotel-advanced-filters {
      display: flex;
      gap: 5px;
      margin: 10px 0;
      padding: 15px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      flex-wrap: nowrap;
      align-items: flex-start;
      position: relative;
      z-index: 1;
    }



    .filter-group {
      flex: 1.3;
      min-width: 0;
    }

    .citizenship-group {
      flex: 1;
      min-width: 0;
    }



    .filter-group-label {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      font-size: 12px;
    }

    .citizenship-selector {
      position: relative;
    }

    .citizenship-dropdown {
      position: absolute;
      bottom: 100%;
      left: 0;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      max-height: 200px;
      overflow-y: auto;
      min-width: 200px;
      width: 100%;
      margin-bottom: 5px;
    }

    .citizenship-display {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px 6px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      cursor: pointer;
      background: #fff;
      transition: all 0.3s ease;
      font-size: 10px;
    }

    .citizenship-display:hover {
      border-color: rgb(83, 10, 166);
      background: rgba(83, 10, 166, 0.05);
    }

    .citizenship-flag {
      font-size: 14px;
    }

    .citizenship-name {
      font-weight: 500;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .citizenship-currency {
      font-size: 8px;
      color: #666;
    }

    .star-rating-options {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }

    .star-rating-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 6px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.3s ease;
      background: #fff;
      user-select: none;
    }

    .star-rating-option:hover {
      border-color: rgb(83, 10, 166);
      background: rgba(83, 10, 166, 0.05);
    }

    .star-rating-option input[type="radio"] {
      display: none;
    }

    .star-rating-option input[type="radio"]:checked + .star-display {
      color: white;
      font-weight: 600;
    }

    .star-rating-option:has(input[type="radio"]:checked) {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .star-rating-option.selected {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .star-rating-option.selected .star-display {
      color: white;
      font-weight: 600;
    }

    .star-rating-option.selected .star-icon {
      color: white !important;
    }

    .star-display {
      display: flex;
      gap: 1px;
    }

    .star-icon {
      font-size: 10px;
      color: #ffa500;
    }

    .star-rating-option:has(input[type="radio"]:checked) .star-icon {
      color: white !important;
    }



    .meal-plan-options {
      display: flex;
      gap: 3px;
      flex-wrap: wrap;
    }

    .meal-plan-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 6px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.3s ease;
      background: #fff;
      user-select: none;
    }

    .meal-plan-option:hover {
      border-color: rgb(83, 10, 166);
      background: rgba(83, 10, 166, 0.05);
    }

    .meal-plan-option input[type="radio"] {
      display: none;
    }

    .meal-plan-option input[type="radio"]:checked + .meal-plan-display {
      color: white;
      font-weight: 600;
    }

    .meal-plan-option:has(input[type="radio"]:checked) {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .meal-plan-display {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .meal-icon {
      font-size: 10px;
    }

    .meal-plan-option:has(input[type="radio"]:checked) .meal-icon {
      color: white !important;
    }

    .meal-plan-option.selected {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .meal-plan-option.selected .meal-plan-display {
      color: white;
      font-weight: 600;
    }

    .meal-plan-option.selected .meal-icon {
      color: white !important;
    }

    .meal-text {
      font-size: 9px;
      font-weight: 500;
    }

    .meal-plan-option {
      position: relative;
    }

    .meal-tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgb(83, 10, 166);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      white-space: nowrap;
      z-index: 1000;
      margin-bottom: 5px;
      box-shadow: 0 4px 12px rgba(83, 10, 166, 0.3);
    }

    .meal-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 5px solid transparent;
      border-top-color: rgb(83, 10, 166);
    }



    .property-type-options {
      display: flex;
      gap: 3px;
      flex-wrap: wrap;
    }

    .property-type-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 6px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.3s ease;
      background: #fff;
      user-select: none;
    }

    .property-type-option:hover {
      border-color: rgb(83, 10, 166);
      background: rgba(83, 10, 166, 0.05);
    }

    .property-type-option input[type="radio"] {
      display: none;
    }

    .property-type-option input[type="radio"]:checked + .property-type-display {
      color: white;
      font-weight: 600;
    }

    .property-type-option:has(input[type="radio"]:checked) {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .property-type-display {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .property-icon {
      font-size: 10px;
    }

    .property-type-option:has(input[type="radio"]:checked) .property-icon {
      color: white !important;
    }

    .property-type-option.selected {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .property-type-option.selected .property-type-display {
      color: white;
      font-weight: 600;
    }

    .property-type-option.selected .property-icon {
      color: white !important;
    }

    .property-text {
      font-size: 9px;
      font-weight: 500;
    }
    
    /* Transfer Vehicle Filter Styles */
    .transfer-vehicle-options {
      display: flex;
      gap: 3px;
      flex-wrap: wrap;
    }

    .transfer-vehicle-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 6px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      transition: all 0.3s ease;
      background: #fff;
      user-select: none;
    }

    .transfer-vehicle-option:hover {
      border-color: rgb(83, 10, 166);
      background: rgba(83, 10, 166, 0.05);
    }

    .transfer-vehicle-option input[type="radio"] {
      display: none;
    }

    .transfer-vehicle-option input[type="radio"]:checked + .transfer-vehicle-display {
      color: white;
      font-weight: 600;
    }

    .transfer-vehicle-option:has(input[type="radio"]:checked) {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .transfer-vehicle-display {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .transfer-vehicle-icon {
      font-size: 12px;
    }

    .transfer-vehicle-option:has(input[type="radio"]:checked) .transfer-vehicle-icon {
      color: white !important;
    }

    .transfer-vehicle-option.selected {
      background: rgb(83, 10, 166) !important;
      border-color: rgb(83, 10, 166) !important;
    }

    .transfer-vehicle-option.selected .transfer-vehicle-display {
      color: white;
      font-weight: 600;
    }

    .transfer-vehicle-option.selected .transfer-vehicle-icon {
      color: white !important;
    }

    .transfer-vehicle-option:has(input[type="radio"]:checked) .transfer-vehicle-icon {
      color: white !important;
    }

    .transfer-vehicle-text {
      font-size: 9px;
      font-weight: 500;
    }
    
    .transfer-filters {
      display: flex;
      gap: 5px;
      margin: 10px 0;
      padding: 15px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      flex-wrap: nowrap;
      align-items: flex-start;
      position: relative;
      z-index: 100;
    }
    
    .duration-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #fff 0%, #f8f6ff 100%);
      border: 1px solid rgba(83, 10, 166, 0.2);
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(83, 10, 166, 0.15);
      z-index: 1000;
      margin-top: 5px;
      overflow: hidden;
    }
    
    .duration-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid rgba(83, 10, 166, 0.1);
      transition: all 0.3s ease;
      font-size: 14px;
      font-weight: 500;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .duration-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(83, 10, 166, 0.1), transparent);
      transition: left 0.5s;
    }

    .duration-item:hover::before {
      left: 100%;
    }
    
    .duration-item:hover {
      background: rgba(83, 10, 166, 0.08);
      color: rgb(83, 10, 166);
      transform: translateX(3px);
      border-left: 3px solid rgb(83, 10, 166);
      padding-left: 13px;
    }
    
    .duration-item:last-child {
      border-bottom: none;
    }
    
    .duration-item.selected {
      background: linear-gradient(135deg, rgb(83, 10, 166) 0%, rgb(103, 30, 186) 100%);
      color: white;
      font-weight: 600;
      border-left: 3px solid rgb(255, 81, 0);
      padding-left: 13px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
    }

    .duration-item.selected::before {
      display: none;
    }

    .duration-icon {
      color: rgb(83, 10, 166);
      font-size: 14px;
    }

    .duration-item.selected .duration-icon {
      color: white;
    }

    /* Isolated Trip Type Buttons CSS - Smart Connected Border */
.isolated-trip-type-btn {
  display: inline-block !important;
  padding: 7px 13px !important;
  margin: 0 !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  line-height: 1.3 !important;
  text-align: center !important;
  text-decoration: none !important;
  vertical-align: middle !important;
  cursor: pointer !important;
  user-select: none !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: #530aa6 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  min-width: 55px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Smart border connections - remove duplicate borders */
.isolated-trip-type-btn + .isolated-trip-type-btn {
  border-left: none !important;
}

/* First button - rounded left corners */
.isolated-trip-type-btn:first-child {
  border-radius: 6px 0 0 6px !important;
}

/* Last button - rounded right corners */
.isolated-trip-type-btn:last-child {
  border-radius: 0 6px 6px 0 !important;
}

    /* Hover state with smart border */
.isolated-trip-type-btn:hover {
  background: linear-gradient(135deg, #530aa6 0%, #7c3aed 100%) !important;
  color: white !important;
  border-color: #530aa6 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 15px rgba(83, 10, 166, 0.25) !important;
  z-index: 10 !important;
}

/* Smart hover border connections */
.isolated-trip-type-btn:hover + .isolated-trip-type-btn {
  border-left: 1px solid #530aa6 !important;
}

.isolated-trip-type-btn:hover {
  border-right: 1px solid #530aa6 !important;
}

.isolated-trip-type-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(83, 10, 166, 0.2) !important;
}

    /* Active/Checked state with smart border */
input[type="radio"]:checked + .isolated-trip-type-btn {
  background: linear-gradient(135deg, #530aa6 0%, #7c3aed 100%) !important;
  color: white !important;
  border-color: #530aa6 !important;
  box-shadow: 0 3px 10px rgba(83, 10, 166, 0.3) !important;
  z-index: 5 !important;
}

/* Smart checked border connections */
input[type="radio"]:checked + .isolated-trip-type-btn + input + .isolated-trip-type-btn {
  border-left: 1px solid #530aa6 !important;
}

/* Checked button hover state with smart border */
input[type="radio"]:checked + .isolated-trip-type-btn:hover {
  background: linear-gradient(135deg, #ff5100 0%, #ff7a00 100%) !important;
  border-color: #ff5100 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 5px 20px rgba(255, 81, 0, 0.4) !important;
  z-index: 15 !important;
}

    /* Focus state with smart border */
.isolated-trip-type-btn:focus {
  outline: none !important;
  border-color: #530aa6 !important;
  box-shadow: 0 0 0 3px rgba(83, 10, 166, 0.15) !important;
  z-index: 8 !important;
}

/* Smart border transitions for seamless connections */
.isolated-trip-type-btn {
  border-color: #d1d5db !important;
}

.isolated-trip-type-btn:hover,
.isolated-trip-type-btn:focus,
input[type="radio"]:checked + .isolated-trip-type-btn {
  border-color: #530aa6 !important;
}

input[type="radio"]:checked + .isolated-trip-type-btn:hover {
  border-color: #ff5100 !important;
}

/* Isolated Add Flight Button CSS */
.isolated-add-flight-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 10px 20px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
  text-decoration: none !important;
  cursor: pointer !important;
  user-select: none !important;
  border: none !important;
  border-radius: 8px !important;
  background: linear-gradient(135deg, #ff5100 0%, #ff7a00 100%) !important;
  color: white !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative !important;
  overflow: hidden !important;
  z-index: 1 !important;
}

/* Add shimmer effect */
.isolated-add-flight-btn::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
  transition: left 0.5s !important;
}

.isolated-add-flight-btn:hover::before {
  left: 100% !important;
}

.isolated-add-flight-btn:hover {
  background: linear-gradient(135deg, #530aa6 0%, #7c3aed 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 25px rgba(83, 10, 166, 0.3) !important;
}

.isolated-add-flight-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 4px 15px rgba(83, 10, 166, 0.2) !important;
}

.isolated-add-flight-btn svg {
  margin-right: 8px !important;
  transition: transform 0.3s ease !important;
}

.isolated-add-flight-btn:hover svg {
  transform: translateX(2px) !important;
}

/* Simple Remove Flight Button CSS */
.isolated-remove-flight-btn {
  background: #dc3545 !important;
  color: white !important;
  border: none !important;
  border-radius: 0 12px 12px 0 !important;
  padding: 0 20px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  height: 80px !important;
  min-width: 100px !important;
  margin-left: 15px !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.isolated-remove-flight-btn:hover {
  background: #c82333 !important;
  color: white !important;
}

/* Isolated Car Type Buttons CSS - Smart Connected Border */
.isolated-car-type-btn {
  display: inline-block !important;
  padding: 7px 13px !important;
  margin: 0 !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  line-height: 1.3 !important;
  text-align: center !important;
  text-decoration: none !important;
  vertical-align: middle !important;
  cursor: pointer !important;
  user-select: none !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: #530aa6 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  min-width: 55px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Smart border connections - remove duplicate borders */
.isolated-car-type-btn + .isolated-car-type-btn {
  border-left: none !important;
}

/* First button - rounded left corners */
.isolated-car-type-btn:first-child {
  border-radius: 6px 0 0 6px !important;
}

/* Last button - rounded right corners */
.isolated-car-type-btn:last-child {
  border-radius: 0 6px 6px 0 !important;
}

/* Hover state with smart border */
.isolated-car-type-btn:hover {
  background: linear-gradient(135deg, #530aa6 0%, #7c3aed 100%) !important;
  color: white !important;
  border-color: #530aa6 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 15px rgba(83, 10, 166, 0.25) !important;
  z-index: 10 !important;
}

/* Smart hover border connections */
.isolated-car-type-btn:hover + .isolated-car-type-btn {
  border-left: 1px solid #530aa6 !important;
}

.isolated-car-type-btn:hover {
  border-right: 1px solid #530aa6 !important;
}

.isolated-car-type-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(83, 10, 166, 0.2) !important;
}

/* Active/Checked state with smart border */
input[type="radio"]:checked + .isolated-car-type-btn {
  background: linear-gradient(135deg, #530aa6 0%, #7c3aed 100%) !important;
  color: white !important;
  border-color: #530aa6 !important;
  box-shadow: 0 3px 10px rgba(83, 10, 166, 0.3) !important;
  z-index: 5 !important;
}

/* Smart checked border connections */
input[type="radio"]:checked + .isolated-car-type-btn + input + .isolated-car-type-btn {
  border-left: 1px solid #530aa6 !important;
}

/* Checked button hover state with smart border */
input[type="radio"]:checked + .isolated-car-type-btn:hover {
  background: linear-gradient(135deg, #ff5100 0%, #ff7a00 100%) !important;
  border-color: #ff5100 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 5px 20px rgba(255, 81, 0, 0.4) !important;
  z-index: 15 !important;
}

/* Focus state with smart border */
.isolated-car-type-btn:focus {
  outline: none !important;
  border-color: #530aa6 !important;
  box-shadow: 0 0 0 3px rgba(83, 10, 166, 0.15) !important;
  z-index: 8 !important;
}

/* Smart border transitions for seamless connections */
.isolated-car-type-btn {
  border-color: #d1d5db !important;
}

.isolated-car-type-btn:hover,
.isolated-car-type-btn:focus,
input[type="radio"]:checked + .isolated-car-type-btn {
  border-color: #530aa6 !important;
}

input[type="radio"]:checked + .isolated-car-type-btn:hover {
  border-color: #ff5100 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .isolated-trip-type-btn {
    padding: 6px 10px !important;
    font-size: 11px !important;
    min-width: 45px !important;
  }
}

/* Isolated Search Buttons - Unified Design */
.isolated-flight-search-btn,
.isolated-hotel-search-btn,
.isolated-car-search-btn,
.isolated-cruise-search-btn,
.isolated-tour-search-btn {
  background: linear-gradient(135deg, #530aa6 0%, #7c3aed 100%) !important;
  border: none !important;
  color: white !important;
  padding: 12px 24px !important;
  border-radius: 0 8px 8px 0 !important;
  font-weight: 600 !important;
  font-size: 16px !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 15px rgba(83, 10, 166, 0.3) !important;
  position: relative !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 180px !important;
  text-decoration: none !important;
}

.isolated-flight-search-btn::before,
.isolated-hotel-search-btn::before,
.isolated-car-search-btn::before,
.isolated-cruise-search-btn::before,
.isolated-tour-search-btn::before {
  content: '' !important;
  position: absolute !important;
  top: 0 !important;
  left: -100% !important;
  width: 100% !important;
  height: 100% !important;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent) !important;
  transition: left 0.5s ease !important;
}

.isolated-flight-search-btn:hover::before,
.isolated-hotel-search-btn:hover::before,
.isolated-car-search-btn:hover::before,
.isolated-cruise-search-btn:hover::before,
.isolated-tour-search-btn:hover::before {
  left: 100% !important;
}

.isolated-flight-search-btn:hover,
.isolated-hotel-search-btn:hover,
.isolated-car-search-btn:hover,
.isolated-cruise-search-btn:hover,
.isolated-tour-search-btn:hover {
  background: linear-gradient(135deg, #ff5100 0%, #ff7a00 100%) !important;
  box-shadow: 0 6px 20px rgba(255, 81, 0, 0.4) !important;
  transform: translateY(-2px) !important;
}

.isolated-flight-search-btn:active,
.isolated-hotel-search-btn:active,
.isolated-car-search-btn:active,
.isolated-cruise-search-btn:active,
.isolated-tour-search-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 10px rgba(83, 10, 166, 0.3) !important;
}

/* Icon animations for each service */
.isolated-hotel-search-btn:hover svg {
  transform: rotate(-5deg) !important;
  transition: transform 0.3s ease !important;
}

.isolated-car-search-btn:hover svg {
  transform: translateX(3px) !important;
  transition: transform 0.3s ease !important;
}

.isolated-cruise-search-btn:hover svg {
  transform: rotate(10deg) !important;
  transition: transform 0.3s ease !important;
}

.isolated-tour-search-btn:hover svg {
  transform: rotate(-10deg) !important;
  transition: transform 0.3s ease !important;
}
  `;

  // Router and navigation
  const router = useRouter();
  const pathname = usePathname();
  
  // Page type to tab mapping
  const pageTypeToTab = {
    "flights": "flights",
    "hotels": "hotels", 
    "cars": "cars",
    "tours": "tours",
    "cruises": "cruises",
    "activities": "tours", // Activities use tours search engine
    "general": "flights"
  };
  
  // Tab to route mapping
  const tabToRoute = {
    "flights": "/flights",
    "hotels": "/hotels",
    "cars": "/cars", 
    "tours": "/tours",
    "cruises": "/cruises"
  };
  
  // State management
  const [activeTab, setActiveTab] = useState(pageTypeToTab[pageType] || "flights");
  const [tripType, setTripType] = useState("roundtrip");
  const [carPickupType, setCarPickupType] = useState("same");
  
  // إصلاح عالمي لموضع DatePicker
  const getDatePickerContainer = (trigger) => {
    return trigger.parentNode;
  };
  
  // Transfer service states
  const [selectedTransferVehicle, setSelectedTransferVehicle] = useState([]);

  // Airport search states
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [popularAirports, setPopularAirports] = useState([]);

  // Popular airports tracking
  const [airportSearchCounts, setAirportSearchCounts] = useState({
    'RUH': 15, 'JED': 12, 'DXB': 18, 'DOH': 10, 'KWI': 8, 
    'BAH': 6, 'MCT': 7, 'CAI': 9, 'AMM': 5, 'BEY': 4
  });

  // Hotel additional states
  const [showHotelGuestsDropdown, setShowHotelGuestsDropdown] = useState(false);
  const [showHotelSuggestions, setShowHotelSuggestions] = useState(false);
  const [hotelSuggestions, setHotelSuggestions] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  
  // Hotel filter states
  const [hotelStarRating, setHotelStarRating] = useState([]);
  const [hotelType, setHotelType] = useState([]);
  const [hotelAmenities, setHotelAmenities] = useState([]);
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [bestDealsOnly, setBestDealsOnly] = useState(false);
  
  // Advanced Meal Filter States
  const [selectedMealPlan, setSelectedMealPlan] = useState([]);
  const [showMealExplanationModal, setShowMealExplanationModal] = useState(false);
  const [hoveredMealPlan, setHoveredMealPlan] = useState(null);

  // Time picker states
  const [showEarlyCheckinPicker, setShowEarlyCheckinPicker] = useState(false);
  const [showLateCheckoutPicker, setShowLateCheckoutPicker] = useState(false);
  const [earlyCheckinTime, setEarlyCheckinTime] = useState("08:00");
  const [lateCheckoutTime, setLateCheckoutTime] = useState("23:00");

  // Citizenship dropdown states
  const [selectedCitizenship, setSelectedCitizenship] = useState("Saudi Arabia");
  const [showCitizenshipDropdown, setShowCitizenshipDropdown] = useState(false);

  // Additional refs for outside click detection
  const fromSuggestionsRef = useRef(null);
  const toSuggestionsRef = useRef(null);
  const hotelGuestsDropdownRef = useRef(null);
  const hotelSuggestionsRef = useRef(null);
  const priceDropdownRef = useRef(null);
  const citizenshipDropdownRef = useRef(null);
  const earlyCheckinPickerRef = useRef(null);
  const lateCheckoutPickerRef = useRef(null);
  
  // Car refs
  const carPickupSuggestionsRef = useRef(null);
  const carDropoffSuggestionsRef = useRef(null);
  
  // Cruise refs
  const cruiseDestinationSuggestionsRef = useRef(null);
  const cruiseGuestsDropdownRef = useRef(null);
  
  // Tour refs
  const tourDestinationSuggestionsRef = useRef(null);
  const tourGuestsDropdownRef = useRef(null);


  // Citizenship options with flags - ALL WORLD COUNTRIES
  const citizenshipOptions = [
    // Arab Countries
    { name: "Saudi Arabia", flag: "🇸🇦", currency: "SAR" },
    { name: "United Arab Emirates", flag: "🇦🇪", currency: "AED" },
    { name: "Qatar", flag: "🇶🇦", currency: "QAR" },
    { name: "Kuwait", flag: "🇰🇼", currency: "KWD" },
    { name: "Bahrain", flag: "🇧🇭", currency: "BHD" },
    { name: "Oman", flag: "🇴🇲", currency: "OMR" },
    { name: "Jordan", flag: "🇯🇴", currency: "JOD" },
    { name: "Lebanon", flag: "🇱🇧", currency: "LBP" },
    { name: "Egypt", flag: "🇪🇬", currency: "EGP" },
    { name: "Morocco", flag: "🇲🇦", currency: "MAD" },
    { name: "Tunisia", flag: "🇹🇳", currency: "TND" },
    { name: "Algeria", flag: "🇩🇿", currency: "DZD" },
    { name: "Iraq", flag: "🇮🇶", currency: "IQD" },
    { name: "Syria", flag: "🇸🇾", currency: "SYP" },
    { name: "Yemen", flag: "🇾🇪", currency: "YER" },
    { name: "Palestine", flag: "🇵🇸", currency: "USD" },
    { name: "Libya", flag: "🇱🇾", currency: "LYD" },
    { name: "Sudan", flag: "🇸🇩", currency: "SDG" },
    
    // Major World Countries
    { name: "United States", flag: "🇺🇸", currency: "USD" },
    { name: "United Kingdom", flag: "🇬🇧", currency: "GBP" },
    { name: "Germany", flag: "🇩🇪", currency: "EUR" },
    { name: "France", flag: "🇫🇷", currency: "EUR" },
    { name: "Italy", flag: "🇮🇹", currency: "EUR" },
    { name: "Spain", flag: "🇪🇸", currency: "EUR" },
    { name: "Netherlands", flag: "🇳🇱", currency: "EUR" },
    { name: "Belgium", flag: "🇧🇪", currency: "EUR" },
    { name: "Switzerland", flag: "🇨🇭", currency: "CHF" },
    { name: "Austria", flag: "🇦🇹", currency: "EUR" },
    { name: "Sweden", flag: "🇸🇪", currency: "SEK" },
    { name: "Norway", flag: "🇳🇴", currency: "NOK" },
    { name: "Denmark", flag: "🇩🇰", currency: "DKK" },
    { name: "Finland", flag: "🇫🇮", currency: "EUR" },
    { name: "Iceland", flag: "🇮🇸", currency: "ISK" },
    { name: "Ireland", flag: "🇮🇪", currency: "EUR" },
    { name: "Portugal", flag: "🇵🇹", currency: "EUR" },
    { name: "Greece", flag: "🇬🇷", currency: "EUR" },
    { name: "Turkey", flag: "🇹🇷", currency: "TRY" },
    { name: "Russia", flag: "🇷🇺", currency: "RUB" },
    { name: "Poland", flag: "🇵🇱", currency: "PLN" },
    { name: "Czech Republic", flag: "🇨🇿", currency: "CZK" },
    { name: "Hungary", flag: "🇭🇺", currency: "HUF" },
    { name: "Romania", flag: "🇷🇴", currency: "RON" },
    { name: "Bulgaria", flag: "🇧🇬", currency: "BGN" },
    { name: "Croatia", flag: "🇭🇷", currency: "EUR" },
    { name: "Serbia", flag: "🇷🇸", currency: "RSD" },
    { name: "Ukraine", flag: "🇺🇦", currency: "UAH" },
    { name: "Belarus", flag: "🇧🇾", currency: "BYN" },
    
    // Asian Countries
    { name: "China", flag: "🇨🇳", currency: "CNY" },
    { name: "Japan", flag: "🇯🇵", currency: "JPY" },
    { name: "South Korea", flag: "🇰🇷", currency: "KRW" },
    { name: "India", flag: "🇮🇳", currency: "INR" },
    { name: "Pakistan", flag: "🇵🇰", currency: "PKR" },
    { name: "Bangladesh", flag: "🇧🇩", currency: "BDT" },
    { name: "Sri Lanka", flag: "🇱🇰", currency: "LKR" },
    { name: "Nepal", flag: "🇳🇵", currency: "NPR" },
    { name: "Bhutan", flag: "🇧🇹", currency: "BTN" },
    { name: "Maldives", flag: "🇲🇻", currency: "MVR" },
    { name: "Thailand", flag: "🇹🇭", currency: "THB" },
    { name: "Vietnam", flag: "🇻🇳", currency: "VND" },
    { name: "Singapore", flag: "🇸🇬", currency: "SGD" },
    { name: "Malaysia", flag: "🇲🇾", currency: "MYR" },
    { name: "Indonesia", flag: "🇮🇩", currency: "IDR" },
    { name: "Philippines", flag: "🇵🇭", currency: "PHP" },
    { name: "Cambodia", flag: "🇰🇭", currency: "KHR" },
    { name: "Laos", flag: "🇱🇦", currency: "LAK" },
    { name: "Myanmar", flag: "🇲🇲", currency: "MMK" },
    { name: "Brunei", flag: "🇧🇳", currency: "BND" },
    { name: "Mongolia", flag: "🇲🇳", currency: "MNT" },
    { name: "Kazakhstan", flag: "🇰🇿", currency: "KZT" },
    { name: "Uzbekistan", flag: "🇺🇿", currency: "UZS" },
    { name: "Kyrgyzstan", flag: "🇰🇬", currency: "KGS" },
    { name: "Tajikistan", flag: "🇹🇯", currency: "TJS" },
    { name: "Turkmenistan", flag: "🇹🇲", currency: "TMT" },
    { name: "Afghanistan", flag: "🇦🇫", currency: "AFN" },
    { name: "Iran", flag: "🇮🇷", currency: "IRR" },
    { name: "Israel", flag: "🇮🇱", currency: "ILS" },
    { name: "Armenia", flag: "🇦🇲", currency: "AMD" },
    { name: "Azerbaijan", flag: "🇦🇿", currency: "AZN" },
    { name: "Georgia", flag: "🇬🇪", currency: "GEL" },
    
    // African Countries
    { name: "South Africa", flag: "🇿🇦", currency: "ZAR" },
    { name: "Nigeria", flag: "🇳🇬", currency: "NGN" },
    { name: "Kenya", flag: "🇰🇪", currency: "KES" },
    { name: "Ethiopia", flag: "🇪🇹", currency: "ETB" },
    { name: "Ghana", flag: "🇬🇭", currency: "GHS" },
    { name: "Tanzania", flag: "🇹🇿", currency: "TZS" },
    { name: "Uganda", flag: "🇺🇬", currency: "UGX" },
    { name: "Rwanda", flag: "🇷🇼", currency: "RWF" },
    { name: "Botswana", flag: "🇧🇼", currency: "BWP" },
    { name: "Namibia", flag: "🇳🇦", currency: "NAD" },
    { name: "Zimbabwe", flag: "🇿🇼", currency: "ZWL" },
    { name: "Zambia", flag: "🇿🇲", currency: "ZMW" },
    { name: "Malawi", flag: "🇲🇼", currency: "MWK" },
    { name: "Mozambique", flag: "🇲🇿", currency: "MZN" },
    { name: "Madagascar", flag: "🇲🇬", currency: "MGA" },
    { name: "Mauritius", flag: "🇲🇺", currency: "MUR" },
    { name: "Seychelles", flag: "🇸🇨", currency: "SCR" },
    { name: "Angola", flag: "🇦🇴", currency: "AOA" },
    { name: "Cameroon", flag: "🇨🇲", currency: "XAF" },
    { name: "Ivory Coast", flag: "🇨🇮", currency: "XOF" },
    { name: "Senegal", flag: "🇸🇳", currency: "XOF" },
    { name: "Mali", flag: "🇲🇱", currency: "XOF" },
    { name: "Burkina Faso", flag: "🇧🇫", currency: "XOF" },
    { name: "Niger", flag: "🇳🇪", currency: "XOF" },
    { name: "Chad", flag: "🇹🇩", currency: "XAF" },
    { name: "Central African Republic", flag: "🇨🇫", currency: "XAF" },
    { name: "Democratic Republic of Congo", flag: "🇨🇩", currency: "CDF" },
    { name: "Republic of Congo", flag: "🇨🇬", currency: "XAF" },
    { name: "Gabon", flag: "🇬🇦", currency: "XAF" },
    { name: "Equatorial Guinea", flag: "🇬🇶", currency: "XAF" },
    { name: "Liberia", flag: "🇱🇷", currency: "LRD" },
    { name: "Sierra Leone", flag: "🇸🇱", currency: "SLL" },
    { name: "Guinea", flag: "🇬🇳", currency: "GNF" },
    { name: "Guinea-Bissau", flag: "🇬🇼", currency: "XOF" },
    { name: "Gambia", flag: "🇬🇲", currency: "GMD" },
    { name: "Cape Verde", flag: "🇨🇻", currency: "CVE" },
    { name: "Benin", flag: "🇧🇯", currency: "XOF" },
    { name: "Togo", flag: "🇹🇬", currency: "XOF" },
    { name: "Burundi", flag: "🇧🇮", currency: "BIF" },
    { name: "Djibouti", flag: "🇩🇯", currency: "DJF" },
    { name: "Eritrea", flag: "🇪🇷", currency: "ERN" },
    { name: "Somalia", flag: "🇸🇴", currency: "SOS" },
    { name: "Comoros", flag: "🇰🇲", currency: "KMF" },
    { name: "Lesotho", flag: "🇱🇸", currency: "LSL" },
    { name: "Eswatini", flag: "🇸🇿", currency: "SZL" },
    
    // American Countries
    { name: "Canada", flag: "🇨🇦", currency: "CAD" },
    { name: "Mexico", flag: "🇲🇽", currency: "MXN" },
    { name: "Brazil", flag: "🇧🇷", currency: "BRL" },
    { name: "Argentina", flag: "🇦🇷", currency: "ARS" },
    { name: "Chile", flag: "🇨🇱", currency: "CLP" },
    { name: "Colombia", flag: "🇨🇴", currency: "COP" },
    { name: "Peru", flag: "🇵🇪", currency: "PEN" },
    { name: "Venezuela", flag: "🇻🇪", currency: "VES" },
    { name: "Ecuador", flag: "🇪🇨", currency: "USD" },
    { name: "Bolivia", flag: "🇧🇴", currency: "BOB" },
    { name: "Paraguay", flag: "🇵🇾", currency: "PYG" },
    { name: "Uruguay", flag: "🇺🇾", currency: "UYU" },
    { name: "Guyana", flag: "🇬🇾", currency: "GYD" },
    { name: "Suriname", flag: "🇸🇷", currency: "SRD" },
    { name: "Guatemala", flag: "🇬🇹", currency: "GTQ" },
    { name: "Belize", flag: "🇧🇿", currency: "BZD" },
    { name: "El Salvador", flag: "🇸🇻", currency: "USD" },
    { name: "Honduras", flag: "🇭🇳", currency: "HNL" },
    { name: "Nicaragua", flag: "🇳🇮", currency: "NIO" },
    { name: "Costa Rica", flag: "🇨🇷", currency: "CRC" },
    { name: "Panama", flag: "🇵🇦", currency: "PAB" },
    { name: "Cuba", flag: "🇨🇺", currency: "CUP" },
    { name: "Jamaica", flag: "🇯🇲", currency: "JMD" },
    { name: "Haiti", flag: "🇭🇹", currency: "HTG" },
    { name: "Dominican Republic", flag: "🇩🇴", currency: "DOP" },
    { name: "Trinidad and Tobago", flag: "🇹🇹", currency: "TTD" },
    { name: "Barbados", flag: "🇧🇧", currency: "BBD" },
    { name: "Bahamas", flag: "🇧🇸", currency: "BSD" },
    
    // Oceania Countries
    { name: "Australia", flag: "🇦🇺", currency: "AUD" },
    { name: "New Zealand", flag: "🇳🇿", currency: "NZD" },
    { name: "Fiji", flag: "🇫🇯", currency: "FJD" },
    { name: "Papua New Guinea", flag: "🇵🇬", currency: "PGK" },
    { name: "Solomon Islands", flag: "🇸🇧", currency: "SBD" },
    { name: "Vanuatu", flag: "🇻🇺", currency: "VUV" },
    { name: "Samoa", flag: "🇼🇸", currency: "WST" },
    { name: "Tonga", flag: "🇹🇴", currency: "TOP" },
    { name: "Kiribati", flag: "🇰🇮", currency: "AUD" },
    { name: "Tuvalu", flag: "🇹🇻", currency: "AUD" },
    { name: "Nauru", flag: "🇳🇷", currency: "AUD" },
    { name: "Palau", flag: "🇵🇼", currency: "USD" },
    { name: "Marshall Islands", flag: "🇲🇭", currency: "USD" },
    { name: "Micronesia", flag: "🇫🇲", currency: "USD" }
  ];

  // Price ranges for hotels
  const priceRanges = [
    { label: "Budget ($50 - $100)", value: "50-100", min: 50, max: 100 },
    { label: "Mid-range ($100 - $250)", value: "100-250", min: 100, max: 250 },
    { label: "Luxury ($250 - $500)", value: "250-500", min: 250, max: 500 },
    { label: "Ultra Luxury ($500+)", value: "500+", min: 500, max: 10000 }
  ];

  // Meal plan options for hotels
  const mealPlanOptions = [
    { 
      value: "room-only", 
      label: "Room Only", 
      description: "Accommodation only - no meals included",
      icon: "🏨"
    },
    { 
      value: "breakfast", 
      label: "Breakfast Included", 
      description: "Daily breakfast included in your stay",
      icon: "🥐"
    },
    { 
      value: "half-board", 
      label: "Half Board (HB)", 
      description: "Breakfast and dinner included daily",
      icon: "🍽️"
    },
    { 
      value: "full-board", 
      label: "Full Board (FB)", 
      description: "All three meals included: breakfast, lunch, and dinner",
      icon: "🍴"
    },
    { 
      value: "all-inclusive", 
      label: "All Inclusive", 
      description: "All meals, snacks, and beverages included throughout your stay",
      icon: "🍹"
    },
    { 
      value: "ultra-all-inclusive", 
      label: "Ultra All Inclusive", 
      description: "Premium all-inclusive with top-shelf drinks, specialty restaurants, and exclusive amenities",
      icon: "🥂"
    }
  ];

  // Get selected citizenship object
  const selectedCitizenshipObj = citizenshipOptions.find(c => c.name === selectedCitizenship) || citizenshipOptions[0];
  
  // Flight search states
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showMultiTripTravelersDropdown, setShowMultiTripTravelersDropdown] = useState({});
  const [travelers, setTravelers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "Economy"
  });

  // Multi Trip states
  const [multiTrips, setMultiTrips] = useState([
    { 
      id: 1, 
      from: "", 
      to: "", 
      date: "",
      showFromSuggestions: false,
      showToSuggestions: false,
      fromSuggestions: [],
      toSuggestions: []
    }
  ]);

  // Flight filters states
  const [showPricingCalendar, setShowPricingCalendar] = useState(false);
  const [directFlightsOnly, setDirectFlightsOnly] = useState(false);
  const [includeCheckedBaggage, setIncludeCheckedBaggage] = useState(false);

  // Hotel search states
  const [hotelLocation, setHotelLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotelGuests, setHotelGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1
  });

  // Car search states
  const [carPickupLocation, setCarPickupLocation] = useState("");
  const [carDropoffLocation, setCarDropoffLocation] = useState("");
  const [carPickupDate, setCarPickupDate] = useState("");
  const [carDropoffDate, setCarDropoffDate] = useState("");
  const [carPickupTime, setCarPickupTime] = useState("10:00");
  const [carDropoffTime, setCarDropoffTime] = useState("10:00");
  const [showCarPickupSuggestions, setShowCarPickupSuggestions] = useState(false);
  const [showCarDropoffSuggestions, setShowCarDropoffSuggestions] = useState(false);
  const [carPickupSuggestions, setCarPickupSuggestions] = useState([]);
  const [carDropoffSuggestions, setCarDropoffSuggestions] = useState([]);

  // Cruise search states
  const [cruiseDestination, setCruiseDestination] = useState("");
  const [cruiseDepartureDate, setCruiseDepartureDate] = useState("");
  const [cruiseDuration, setCruiseDuration] = useState("");
  const [cruiseGuests, setCruiseGuests] = useState({
    adults: 2,
    children: 0
  });
  const [showCruiseDestinationSuggestions, setShowCruiseDestinationSuggestions] = useState(false);
  const [cruiseDestinationSuggestions, setCruiseDestinationSuggestions] = useState([]);
  const [showCruiseGuestsDropdown, setShowCruiseGuestsDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  // Tour search states
  const [tourDestination, setTourDestination] = useState("");
  const [tourDepartureDate, setTourDepartureDate] = useState("");
  const [tourDuration, setTourDuration] = useState("");
  const [tourGuests, setTourGuests] = useState({
    adults: 2,
    children: 0
  });
  const [showTourDestinationSuggestions, setShowTourDestinationSuggestions] = useState(false);
  const [tourDestinationSuggestions, setTourDestinationSuggestions] = useState([]);
  const [showTourGuestsDropdown, setShowTourGuestsDropdown] = useState(false);
  const [showTourDurationDropdown, setShowTourDurationDropdown] = useState(false);

  // Refs for outside click detection
  const travelersDropdownRef = useRef(null);

  // Close all dropdowns function
  const closeAllDropdowns = () => {
    // Flight dropdowns
    setShowTravelersDropdown(false);
    setShowMultiTripTravelersDropdown({});
    setShowFromSuggestions(false);
    setShowToSuggestions(false);
    
    // Hotel dropdowns
    setShowHotelSuggestions(false);
    setShowHotelGuestsDropdown(false);
    setShowPriceDropdown(false);
    setShowEarlyCheckinPicker(false);
    setShowLateCheckoutPicker(false);
    
    // Car dropdowns
    setShowCarPickupSuggestions(false);
    setShowCarDropoffSuggestions(false);
    
    // Cruise dropdowns
    setShowCruiseDestinationSuggestions(false);
    setShowCruiseGuestsDropdown(false);
    
    // Tour dropdowns  
    setShowTourDestinationSuggestions(false);
    setShowTourGuestsDropdown(false);
    
    // Other dropdowns
    setShowCitizenshipDropdown(false);
    setShowDurationDropdown(false);
    setShowTourDurationDropdown(false);
    
    // Multi-trip specific
    setMultiTrips(multiTrips.map(trip => ({
      ...trip,
      showFromSuggestions: false,
      showToSuggestions: false
    })));
  };

  // Initialize popular airports on component mount
  useEffect(() => {
    updatePopularAirports();
  }, [airportSearchCounts]);

  // Sync activeTab with pageType changes
  useEffect(() => {
    const newTab = pageTypeToTab[pageType] || "flights";
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [pageType]);

  // Handle outside clicks and mouse leave
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Main travelers dropdown
      if (travelersDropdownRef.current && !travelersDropdownRef.current.contains(event.target)) {
        setShowTravelersDropdown(false);
      }
      
      // Main suggestions dropdowns
      if (fromSuggestionsRef.current && !fromSuggestionsRef.current.contains(event.target)) {
        setShowFromSuggestions(false);
      }
      if (toSuggestionsRef.current && !toSuggestionsRef.current.contains(event.target)) {
        setShowToSuggestions(false);
      }
      
      // Multi-trip dropdowns - close if click is outside any multi-trip container
      if (!event.target.closest('.multi-trip-container') && !event.target.closest('.form-item')) {
        setMultiTrips(multiTrips.map(trip => ({
          ...trip,
          showFromSuggestions: false,
          showToSuggestions: false
        })));
        setShowMultiTripTravelersDropdown({});
      }
      
      // Other dropdowns
      if (hotelGuestsDropdownRef.current && !hotelGuestsDropdownRef.current.contains(event.target)) {
        setShowHotelGuestsDropdown(false);
      }
      if (hotelSuggestionsRef.current && !hotelSuggestionsRef.current.contains(event.target)) {
        setShowHotelSuggestions(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target)) {
        setShowPriceDropdown(false);
      }
      if (citizenshipDropdownRef.current && !citizenshipDropdownRef.current.contains(event.target)) {
        setShowCitizenshipDropdown(false);
      }
      if (earlyCheckinPickerRef.current && !earlyCheckinPickerRef.current.contains(event.target)) {
        setShowEarlyCheckinPicker(false);
      }
      if (lateCheckoutPickerRef.current && !lateCheckoutPickerRef.current.contains(event.target)) {
        setShowLateCheckoutPicker(false);
      }

      // Car dropdowns
      if (carPickupSuggestionsRef.current && !carPickupSuggestionsRef.current.contains(event.target)) {
        setShowCarPickupSuggestions(false);
      }
      if (carDropoffSuggestionsRef.current && !carDropoffSuggestionsRef.current.contains(event.target)) {
        setShowCarDropoffSuggestions(false);
      }
      
      // Cruise dropdowns
      if (cruiseDestinationSuggestionsRef.current && !cruiseDestinationSuggestionsRef.current.contains(event.target)) {
        setShowCruiseDestinationSuggestions(false);
      }
      if (cruiseGuestsDropdownRef.current && !cruiseGuestsDropdownRef.current.contains(event.target)) {
        setShowCruiseGuestsDropdown(false);
      }
      
      // Tour dropdowns
      if (tourDestinationSuggestionsRef.current && !tourDestinationSuggestionsRef.current.contains(event.target)) {
        setShowTourDestinationSuggestions(false);
      }
      if (tourGuestsDropdownRef.current && !tourGuestsDropdownRef.current.contains(event.target)) {
        setShowTourGuestsDropdown(false);
      }
      
      // Duration dropdowns
      setShowDurationDropdown(false);
      setShowTourDurationDropdown(false);
    };

    const handleMouseLeave = (event) => {
      // Check if mouse left any dropdown or form item
      const target = event.target;
      if (target.closest('.suggestions-dropdown') || 
          target.closest('.travelers-dropdown') ||
          target.closest('.hotel-guests-dropdown') ||
          target.closest('.price-dropdown') ||
          target.closest('.time-picker-dropdown') ||
          target.closest('.citizenship-dropdown') ||
          target.closest('.form-item') ||
          target.closest('.hotel-search')) {
        // Add a small delay to prevent immediate closing when moving between elements
        setTimeout(() => {
          if (!document.querySelector('.suggestions-dropdown:hover') && 
              !document.querySelector('.travelers-dropdown:hover') &&
              !document.querySelector('.hotel-guests-dropdown:hover') &&
              !document.querySelector('.price-dropdown:hover') &&
              !document.querySelector('.time-picker-dropdown:hover') &&
              !document.querySelector('.citizenship-dropdown:hover') &&
              !document.querySelector('.form-item:hover') &&
              !document.querySelector('.hotel-search:hover')) {
            closeAllDropdowns();
          }
        }, 100);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    // Add universal mouse leave listener to document body
    const handleDocumentMouseLeave = () => {
      setTimeout(() => {
        // Close all dropdowns if mouse is not over any search element
        if (!document.querySelector('.suggestions-dropdown:hover') && 
            !document.querySelector('.travelers-dropdown:hover') &&
            !document.querySelector('.hotel-guests-dropdown:hover') &&
            !document.querySelector('.price-dropdown:hover') &&
            !document.querySelector('.time-picker-dropdown:hover') &&
            !document.querySelector('.citizenship-dropdown:hover') &&
            !document.querySelector('.form-item:hover') &&
            !document.querySelector('.banner-form:hover') &&
            !document.querySelector('.hotel-search:hover') &&
            !document.querySelector('.car-search:hover') &&
            !document.querySelector('.cruise-search:hover') &&
            !document.querySelector('.tour-search:hover')) {
          closeAllDropdowns();
        }
      }, 150);
    };
    
    // Add auto-close functionality when user moves cursor away from search area
    const handleBodyMouseMove = (event) => {
      const searchElements = document.querySelectorAll(
        '.banner-form, .hotel-search, .car-search, .cruise-search, .tour-search, ' +
        '.suggestions-dropdown, .travelers-dropdown, .hotel-guests-dropdown, ' +
        '.price-dropdown, .time-picker-dropdown, .citizenship-dropdown'
      );
      
      let isOverSearchElement = false;
      searchElements.forEach(element => {
        if (element && element.contains(event.target)) {
          isOverSearchElement = true;
        }
      });
      
      // If cursor is not over any search element, start a timer to close dropdowns
      if (!isOverSearchElement) {
        setTimeout(() => {
          const hoveredElements = document.querySelectorAll(':hover');
          const hasHoveredSearch = Array.from(hoveredElements).some(el => 
            el.closest('.banner-form') || 
            el.closest('.hotel-search') ||
            el.closest('.car-search') ||
            el.closest('.cruise-search') ||
            el.closest('.tour-search') ||
            el.classList.contains('suggestions-dropdown') ||
            el.classList.contains('travelers-dropdown') ||
            el.classList.contains('hotel-guests-dropdown') ||
            el.classList.contains('price-dropdown') ||
            el.classList.contains('time-picker-dropdown') ||
            el.classList.contains('citizenship-dropdown')
          );
          
          if (!hasHoveredSearch) {
            closeAllDropdowns();
          }
        }, 100);
      }
    };
    
    // Add mouse leave listeners to all major containers
    const searchContainers = document.querySelectorAll('.banner-form, .hotel-search, .car-search, .cruise-search, .tour-search');
    searchContainers.forEach(container => {
      if (container) {
        container.addEventListener('mouseleave', handleDocumentMouseLeave);
      }
    });
    
    // Add body mouse move listener for auto-close
    document.body.addEventListener('mousemove', handleBodyMouseMove);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.removeEventListener('mousemove', handleBodyMouseMove);
      searchContainers.forEach(container => {
        if (container) {
          container.removeEventListener('mouseleave', handleDocumentMouseLeave);
        }
      });
    };
  }, [multiTrips]);



  // Airport search functions
  const searchAirports = (query) => {
    if (!query || query.length < 2) return [];

    const searchTerm = query.toLowerCase();
    const airports = airportsData.airports.filter(airport =>
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.nameAr.includes(searchTerm) ||
      airport.city.toLowerCase().includes(searchTerm) ||
      airport.cityAr.includes(searchTerm) ||
      airport.country.toLowerCase().includes(searchTerm) ||
      airport.countryAr.includes(searchTerm) ||
      airport.iata.toLowerCase().includes(searchTerm)
    ).slice(0, 6); // Limit to 6 airports

    // Group airports by city and add city options
    const cityGroups = {};
    airports.forEach(airport => {
      const cityKey = `${airport.city}-${airport.country}`;
      if (!cityGroups[cityKey]) {
        cityGroups[cityKey] = {
          type: 'city',
          city: airport.city,
          cityAr: airport.cityAr,
          country: airport.country,
          countryAr: airport.countryAr,
          airports: []
        };
      }
      cityGroups[cityKey].airports.push(airport);
    });

    // Convert to array and add individual airports
    const results = [];
    Object.values(cityGroups).forEach(cityGroup => {
      if (cityGroup.airports.length > 1) {
        results.push(cityGroup);
      }
      results.push(...cityGroup.airports.map(airport => ({ ...airport, type: 'airport' })));
    });

    return results.slice(0, 8);
  };

  // Handle from location input
  const handleFromLocationChange = (e) => {
    const value = e.target.value;
    setFromLocation(value);
    if (value.length >= 2) {
      const suggestions = searchAirports(value);
      setFromSuggestions(suggestions);
      setShowFromSuggestions(true);
    } else {
      setShowFromSuggestions(false);
    }
  };

  // Handle to location input
  const handleToLocationChange = (e) => {
    const value = e.target.value;
    setToLocation(value);
    if (value.length >= 2) {
      const suggestions = searchAirports(value);
      setToSuggestions(suggestions);
      setShowToSuggestions(true);
    } else {
      setShowToSuggestions(false);
    }
  };

  // Track airport search popularity
  const trackAirportSearch = (airport) => {
    const key = airport.iata || `${airport.city}-${airport.country}`;
    setAirportSearchCounts(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
    
    // Update popular airports list
    updatePopularAirports();
  };

  // Update popular airports based on search counts
  const updatePopularAirports = () => {
    const sortedAirports = Object.entries(airportSearchCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([key]) => {
        // Find airport by key
        return airportsData.airports.find(airport => 
          airport.iata === key || `${airport.city}-${airport.country}` === key
        );
      })
      .filter(Boolean);
    
    setPopularAirports(sortedAirports);
  };

  // Handle airport selection
  const handleAirportSelect = (airport, type) => {
    const displayText = airport.type === 'city' 
      ? `${airport.city}, ${airport.country}`
      : `${airport.city} (${airport.iata})`;
    
    if (type === 'from') {
      setFromLocation(displayText);
      setShowFromSuggestions(false);
    } else {
      setToLocation(displayText);
      setShowToSuggestions(false);
    }
    
    // Track airport popularity
    trackAirportSearch(airport);
  };

  // Render flag function
  const renderFlag = (countryName) => {
    const country = citizenshipOptions.find(c => c.name === countryName);
    return country ? country.flag : '🌍';
  };

  // Search cities from airports data
  const searchCities = (query) => {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    const cities = [];
    const citySet = new Set();
    
    // Extract unique cities from airports data
    airportsData.airports.forEach(airport => {
      const cityKey = `${airport.city}-${airport.country}`;
      if (!citySet.has(cityKey) && 
          (airport.city.toLowerCase().includes(searchTerm) ||
           airport.cityAr.includes(searchTerm) ||
           airport.country.toLowerCase().includes(searchTerm) ||
           airport.countryAr.includes(searchTerm))) {
        citySet.add(cityKey);
        cities.push({
          name: airport.city,
          nameAr: airport.cityAr,
          country: airport.country,
          countryAr: airport.countryAr,
          type: 'city'
        });
      }
    });
    
    return cities.slice(0, 6);
  };

  // Mock hotel data - will be replaced with API call later
  const searchHotels = (query) => {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    // Mock hotel data - this will be replaced with actual API call
    const mockHotels = [
      { name: "Burj Al Arab Jumeirah", city: "Dubai", country: "UAE", type: "hotel", rating: 5 },
      { name: "Atlantis The Palm", city: "Dubai", country: "UAE", type: "hotel", rating: 5 },
      { name: "Emirates Palace", city: "Abu Dhabi", country: "UAE", type: "hotel", rating: 5 },
      { name: "Four Seasons Hotel Riyadh", city: "Riyadh", country: "Saudi Arabia", type: "hotel", rating: 5 },
      { name: "The Ritz-Carlton Riyadh", city: "Riyadh", country: "Saudi Arabia", type: "hotel", rating: 5 },
      { name: "Waldorf Astoria Jeddah", city: "Jeddah", country: "Saudi Arabia", type: "hotel", rating: 5 },
      { name: "InterContinental Doha", city: "Doha", country: "Qatar", type: "hotel", rating: 5 },
      { name: "The St. Regis Doha", city: "Doha", country: "Qatar", type: "hotel", rating: 5 },
      { name: "JW Marriott Kuwait City", city: "Kuwait City", country: "Kuwait", type: "hotel", rating: 5 },
      { name: "The Westin Kuwait", city: "Kuwait City", country: "Kuwait", type: "hotel", rating: 5 }
    ];
    
    return mockHotels.filter(hotel => 
      hotel.name.toLowerCase().includes(searchTerm) ||
      hotel.city.toLowerCase().includes(searchTerm) ||
      hotel.country.toLowerCase().includes(searchTerm)
    ).slice(0, 4);
  };

  // Handle hotel location search
  const handleHotelLocationChange = (e) => {
    const value = e.target.value;
    setHotelLocation(value);
    if (value.length >= 2) {
      const cities = searchCities(value);
      const hotels = searchHotels(value);
      
      // Combine cities and hotels
      const combinedSuggestions = [...cities, ...hotels];
      setHotelSuggestions(combinedSuggestions);
      setShowHotelSuggestions(true);
    } else {
      setShowHotelSuggestions(false);
    }
  };

  // Handle hotel suggestion select
  const handleHotelSuggestionSelect = (suggestion) => {
    const displayText = suggestion.type === 'city' 
      ? `${suggestion.name}, ${suggestion.country}`
      : suggestion.name;
    setHotelLocation(displayText);
    setShowHotelSuggestions(false);
  };

  // Car search functions
  const searchCitiesAndAirports = (query) => {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    const airports = airportsData.airports.filter(airport =>
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.nameAr.includes(searchTerm) ||
      airport.city.toLowerCase().includes(searchTerm) ||
      airport.cityAr.includes(searchTerm) ||
      airport.country.toLowerCase().includes(searchTerm) ||
      airport.countryAr.includes(searchTerm) ||
      airport.iata.toLowerCase().includes(searchTerm)
    ).slice(0, 6);

    // Group airports by city and add city options
    const cityGroups = {};
    airports.forEach(airport => {
      const cityKey = `${airport.city}-${airport.country}`;
      if (!cityGroups[cityKey]) {
        cityGroups[cityKey] = {
          type: 'city',
          city: airport.city,
          cityAr: airport.cityAr,
          country: airport.country,
          countryAr: airport.countryAr,
          airports: []
        };
      }
      cityGroups[cityKey].airports.push(airport);
    });

    const results = [];
    Object.values(cityGroups).forEach(cityGroup => {
      if (cityGroup.airports.length > 1) {
        results.push(cityGroup);
      }
      results.push(...cityGroup.airports.map(airport => ({ ...airport, type: 'airport' })));
    });

    return results.slice(0, 8);
  };

  const handleCarPickupLocationChange = (e) => {
    const value = e.target.value;
    setCarPickupLocation(value);
    if (value.length >= 2) {
      const suggestions = searchCitiesAndAirports(value);
      setCarPickupSuggestions(suggestions);
      setShowCarPickupSuggestions(true);
    } else {
      setShowCarPickupSuggestions(false);
    }
  };

  const handleCarDropoffLocationChange = (e) => {
    const value = e.target.value;
    setCarDropoffLocation(value);
    if (value.length >= 2) {
      const suggestions = searchCitiesAndAirports(value);
      setCarDropoffSuggestions(suggestions);
      setShowCarDropoffSuggestions(true);
    } else {
      setShowCarDropoffSuggestions(false);
    }
  };

  const handleCarLocationSelect = (location, type) => {
    const displayText = location.type === 'city' 
      ? `${location.city}, ${location.country}`
      : `${location.city} (${location.iata})`;
    
    if (type === 'pickup') {
      setCarPickupLocation(displayText);
      setShowCarPickupSuggestions(false);
    } else {
      setCarDropoffLocation(displayText);
      setShowCarDropoffSuggestions(false);
    }
    
    trackAirportSearch(location);
  };

  // Cruise search functions
  const searchCountriesAndCities = (query) => {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    const countriesSet = new Set();
    const citiesSet = new Set();
    const countries = [];
    const cities = [];
    
    airportsData.airports.forEach(airport => {
      const countryKey = airport.country;
      const cityKey = `${airport.city}-${airport.country}`;
      
      if (airport.country.toLowerCase().includes(searchTerm) ||
          airport.countryAr.includes(searchTerm)) {
        if (!countriesSet.has(countryKey)) {
          countriesSet.add(countryKey);
          countries.push({
            name: airport.country,
            nameAr: airport.countryAr,
            type: 'country'
          });
        }
      }
      
      if (airport.city.toLowerCase().includes(searchTerm) ||
          airport.cityAr.includes(searchTerm)) {
        if (!citiesSet.has(cityKey)) {
          citiesSet.add(cityKey);
          cities.push({
            name: airport.city,
            nameAr: airport.cityAr,
            country: airport.country,
            countryAr: airport.countryAr,
            type: 'city'
          });
        }
      }
    });
    
    return [...countries.slice(0, 3), ...cities.slice(0, 5)];
  };

  const handleCruiseDestinationChange = (e) => {
    const value = e.target.value;
    setCruiseDestination(value);
    if (value.length >= 2) {
      const suggestions = searchCountriesAndCities(value);
      setCruiseDestinationSuggestions(suggestions);
      setShowCruiseDestinationSuggestions(true);
    } else {
      setShowCruiseDestinationSuggestions(false);
    }
  };

  const handleCruiseDestinationSelect = (destination) => {
    const displayText = destination.type === 'country' 
      ? destination.name
      : `${destination.name}, ${destination.country}`;
    setCruiseDestination(displayText);
    setShowCruiseDestinationSuggestions(false);
  };

  // Tour search functions
  const handleTourDestinationChange = (e) => {
    const value = e.target.value;
    setTourDestination(value);
    if (value.length >= 2) {
      const suggestions = searchCountriesAndCities(value);
      setTourDestinationSuggestions(suggestions);
      setShowTourDestinationSuggestions(true);
    } else {
      setShowTourDestinationSuggestions(false);
    }
  };

  const handleTourDestinationSelect = (destination) => {
    const displayText = destination.type === 'country' 
      ? destination.name
      : `${destination.name}, ${destination.country}`;
    setTourDestination(displayText);
    setShowTourDestinationSuggestions(false);
  };

  // Cruise and Tour guests handlers
  const handleCruiseGuestsChange = (type, operation) => {
    setCruiseGuests(prev => ({
      ...prev,
      [type]: operation === 'increment' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const handleTourGuestsChange = (type, operation) => {
    setTourGuests(prev => ({
      ...prev,
      [type]: operation === 'increment' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  // Handle price range selection
  const handlePriceRangeSelect = (range) => {
    setSelectedPriceRange(range.value);
    setShowPriceDropdown(false);
  };

  // Handle citizenship selection
  const handleCitizenshipSelect = (citizenship) => {
    setSelectedCitizenship(citizenship.name);
    setShowCitizenshipDropdown(false);
  };

  // Handle citizenship dropdown positioning
  const handleCitizenshipDropdownToggle = () => {
    setShowCitizenshipDropdown(!showCitizenshipDropdown);
  };

  // Handle multiple selection for filters
  const handleStarRatingToggle = (rating) => {
    setHotelStarRating(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleMealPlanToggle = (mealPlan) => {
    setSelectedMealPlan(prev => 
      prev.includes(mealPlan) 
        ? prev.filter(m => m !== mealPlan)
        : [...prev, mealPlan]
    );
  };

  const handlePropertyTypeToggle = (propertyType) => {
    setHotelType(prev => 
      prev.includes(propertyType) 
        ? prev.filter(t => t !== propertyType)
        : [...prev, propertyType]
    );
  };

  const handleTransferVehicleToggle = (vehicleType) => {
    setSelectedTransferVehicle(prev => 
      prev.includes(vehicleType) 
        ? prev.filter(v => v !== vehicleType)
        : [...prev, vehicleType]
    );
  };





  // Handle hotel guests change
  const handleHotelGuestsChange = (type, operation) => {
    setHotelGuests(prev => ({
      ...prev,
      [type]: operation === 'increment' ? prev[type] + 1 : Math.max(type === 'rooms' ? 1 : 0, prev[type] - 1)
    }));
  };

  // Handlers
  const handleTravelersChange = (type, operation) => {
    setTravelers(prev => ({
      ...prev,
      [type]: operation === 'increment' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const handleCabinClassChange = (cabinClass) => {
    setTravelers(prev => ({ ...prev, cabinClass }));
  };

  // Multi Trip handlers
  const addMultiTrip = () => {
    const newTrip = {
      id: Date.now(),
      from: "",
      to: "",
      date: "",
      showFromSuggestions: false,
      showToSuggestions: false,
      fromSuggestions: [],
      toSuggestions: []
    };
    setMultiTrips([...multiTrips, newTrip]);
  };

  const removeMultiTrip = (tripId) => {
    if (multiTrips.length > 1) {
      setMultiTrips(multiTrips.filter(trip => trip.id !== tripId));
    }
  };

  const updateMultiTrip = (tripId, field, value) => {
    setMultiTrips(multiTrips.map(trip => 
      trip.id === tripId ? { ...trip, [field]: value } : trip
    ));
  };

  // Multi Trip airport search handlers
  const handleMultiTripFromChange = (tripId, value) => {
    setMultiTrips(multiTrips.map(trip => {
      if (trip.id === tripId) {
        const suggestions = value.length >= 2 ? searchAirports(value) : [];
        return {
          ...trip,
          from: value,
          fromSuggestions: suggestions,
          showFromSuggestions: suggestions.length > 0 || (value.length < 2 && popularAirports.length > 0)
        };
      }
      return trip;
    }));
  };

  const handleMultiTripToChange = (tripId, value) => {
    setMultiTrips(multiTrips.map(trip => {
      if (trip.id === tripId) {
        const suggestions = value.length >= 2 ? searchAirports(value) : [];
        return {
          ...trip,
          to: value,
          toSuggestions: suggestions,
          showToSuggestions: suggestions.length > 0 || (value.length < 2 && popularAirports.length > 0)
        };
      }
      return trip;
    }));
  };

  const handleMultiTripAirportSelect = (tripId, airport, type) => {
    const displayText = airport.type === 'city' 
      ? `${airport.city}, ${airport.country}`
      : `${airport.city} (${airport.iata})`;
    
    setMultiTrips(multiTrips.map(trip => {
      if (trip.id === tripId) {
        if (type === 'from') {
          return { ...trip, from: displayText, showFromSuggestions: false };
        } else {
          return { ...trip, to: displayText, showToSuggestions: false };
        }
      }
      return trip;
    }));
    
    trackAirportSearch(airport);
  };

  const swapMultiTripLocations = (tripId) => {
    setMultiTrips(multiTrips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          from: trip.to,
          to: trip.from
        };
      }
      return trip;
    }));
  };

  // Multi Trip travelers dropdown handlers
  const toggleMultiTripTravelersDropdown = (tripId) => {
    setShowMultiTripTravelersDropdown(prev => ({
      ...prev,
      [tripId]: !prev[tripId]
    }));
    // Close main travelers dropdown if open
    setShowTravelersDropdown(false);
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSearch = () => {
    if (pageType === "hotels") {
      router.push("/hotel-list-v1");
    } else if (pageType === "flights") {
      router.push("/flight-list-v1");
    } else if (pageType === "cars") {
      router.push("/car/car-list-v1");
    } else if (pageType === "cruises") {
      router.push("/cruise-list-v1");
    } else if (pageType === "tours") {
      router.push("/tour-list-v1");
    } else if (pageType === "activities") {
      router.push("/activity-list-v1");
    } else {
      // Default fallback
      router.push("/hotel-list-v1");
    }
  };

  const renderFlightSearch = () => (
    <div className="flight-search">
      <div className="trip-type-selector mb-4">
        <div className="btn-group" role="group">
          <input type="radio" className="btn-check" name="tripType" id="oneway" value="oneway" 
                 checked={tripType === 'oneway'} onChange={(e) => setTripType(e.target.value)} />
          <label className="isolated-trip-type-btn" htmlFor="oneway">One Way</label>
          
          <input type="radio" className="btn-check" name="tripType" id="roundtrip" value="roundtrip" 
                 checked={tripType === 'roundtrip'} onChange={(e) => setTripType(e.target.value)} />
          <label className="isolated-trip-type-btn" htmlFor="roundtrip">Round Trip</label>
          
          <input type="radio" className="btn-check" name="tripType" id="multitrip" value="multitrip" 
                 checked={tripType === 'multitrip'} onChange={(e) => setTripType(e.target.value)} />
          <label className="isolated-trip-type-btn" htmlFor="multitrip">Multi Trip</label>
        </div>
      </div>

      {/* Flight Filters */}
      <div className="flight-filters">
        <label className="filter-checkbox">
          <input 
            type="checkbox" 
            checked={showPricingCalendar}
            onChange={(e) => setShowPricingCalendar(e.target.checked)}
          />
          <FaCalendar className="me-1" />
          <span className="filter-text">Show Pricing Calendar</span>
        </label>
        
        <label className="filter-checkbox">
          <input 
            type="checkbox" 
            checked={directFlightsOnly}
            onChange={(e) => setDirectFlightsOnly(e.target.checked)}
          />
          <FaRoute className="me-1" />
          <span className="filter-text">Direct Flights Only</span>
        </label>
        
        <label className="filter-checkbox">
          <input 
            type="checkbox" 
            checked={includeCheckedBaggage}
            onChange={(e) => setIncludeCheckedBaggage(e.target.checked)}
          />
          <FaSuitcase className="me-1" />
          <span className="filter-text">Include Checked Baggage</span>
        </label>
      </div>

      <div className="d-lg-flex">
        <div className="d-flex form-info">
          <div className="form-item position-relative" ref={fromSuggestionsRef}>
            <label className="form-label">
              <FaPlane className="me-2" />
              From
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="City or Airport"
              value={fromLocation}
              onChange={handleFromLocationChange}
              onFocus={() => {
                if (fromLocation.length >= 2) {
                  setShowFromSuggestions(true);
                } else if (popularAirports.length > 0) {
                  setFromSuggestions(popularAirports);
                  setShowFromSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowFromSuggestions(false);
                }, 150);
              }}
            />
            <div className="fs-12">Departure location</div>
            
                        {showFromSuggestions && (fromSuggestions.length > 0 || popularAirports.length > 0) && (
              <div className="suggestions-dropdown">
                {fromSuggestions.length === 0 && popularAirports.length > 0 && (
                  <>
                    <div className="popular-section">
                      <FaFire className="fire-icon" /> Popular Destinations
                    </div>
                    {popularAirports.map((airport, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleAirportSelect(airport, 'from')}
                      >
                        <div className="airport-location">
                          {airport.city}, {airport.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">{airport.iata}</div>
                            <div className="airport-name">{airport.name}</div>
                            <FaPlaneDeparture className="airport-icon" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {fromSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${item.type === 'city' ? 'city-item' : ''}`}
                    onClick={() => handleAirportSelect(item, 'from')}
                  >
                    {item.type === 'city' ? (
                      <>
                        <div className="airport-header">
                          <div className="city-info">
                            <FaMapMarkerAlt className="airport-icon" style={{color: '#ff5100'}} />
                            <div className="city-name">{item.city}</div>
                            <div className="city-airports-count">{item.airports.length} airports</div>
                          </div>
                        </div>
                        <div className="airport-location">
                          All airports in {item.country}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="airport-location">
                          {item.city}, {item.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">{item.iata}</div>
                            <div className="airport-name">{item.name}</div>
                            <FaPlaneDeparture className="airport-icon" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-item position-relative" ref={toSuggestionsRef}>
            <button 
              type="button" 
              className="swap-btn position-absolute"
              onClick={swapLocations}
              style={{ 
                top: '50%', 
                left: '-25px', 
                zIndex: 10
              }}
            >
              <GitCompareArrows size={20} />
            </button>
            <label className="form-label">
              <FaPlane className="me-2" />
              To
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="City or Airport"
              value={toLocation}
              onChange={handleToLocationChange}
              onFocus={() => {
                if (toLocation.length >= 2) {
                  setShowToSuggestions(true);
                } else if (popularAirports.length > 0) {
                  setToSuggestions(popularAirports);
                  setShowToSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowToSuggestions(false);
                }, 150);
              }}
            />
            <div className="fs-12">Arrival location</div>
            
                        {showToSuggestions && (toSuggestions.length > 0 || popularAirports.length > 0) && (
              <div className="suggestions-dropdown">
                {toSuggestions.length === 0 && popularAirports.length > 0 && (
                  <>
                    <div className="popular-section">
                      <FaFire className="fire-icon" /> Popular Destinations
                    </div>
                    {popularAirports.map((airport, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleAirportSelect(airport, 'to')}
                      >
                        <div className="airport-location">
                          {airport.city}, {airport.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">{airport.iata}</div>
                            <div className="airport-name">{airport.name}</div>
                            <FaPlaneArrival className="airport-icon" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {toSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${item.type === 'city' ? 'city-item' : ''}`}
                    onClick={() => handleAirportSelect(item, 'to')}
                  >
                    {item.type === 'city' ? (
                      <>
                        <div className="airport-header">
                          <div className="city-info">
                            <FaMapMarkerAlt className="airport-icon" style={{color: '#ff5100'}} />
                            <div className="city-name">{item.city}</div>
                            <div className="city-airports-count">{item.airports.length} airports</div>
                          </div>
                        </div>
                        <div className="airport-location">
                          All airports in {item.country}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="airport-location">
                          {item.city}, {item.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">{item.iata}</div>
                            <div className="airport-name">{item.name}</div>
                            <FaPlaneArrival className="airport-icon" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-item">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              Departure
            </label>
            <DatePicker
              className="form-control"
              placeholder="Select Date"
              value={departDate ? dayjs(departDate) : null}
              onChange={(date) => setDepartDate(date ? date.format('YYYY-MM-DD') : '')}
              format="MMM DD, YYYY"
              suffixIcon={null}
              placement="bottomLeft"
              getPopupContainer={getDatePickerContainer}
            />
            <div className="fs-12">Departure date</div>
          </div>

          {tripType === 'roundtrip' && (
            <div className="form-item">
              <label className="form-label">
                <FaCalendarAlt className="me-2" />
                Return
              </label>
              <DatePicker
                className="form-control"
                placeholder="Select Date"
                value={returnDate ? dayjs(returnDate) : null}
                onChange={(date) => setReturnDate(date ? date.format('YYYY-MM-DD') : '')}
                format="MMM DD, YYYY"
                suffixIcon={null}
                placement="bottomLeft"
                getPopupContainer={getDatePickerContainer}
              />
              <div className="fs-12">Return date</div>
            </div>
          )}

          <div className="form-item position-relative" ref={travelersDropdownRef}>
            <label className="form-label">
              <FaMapMarkerAlt className="me-2" />
              Travelers
            </label>
            <div 
              className="form-control d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer', lineHeight: '1.1' }}
              onClick={() => {
                setShowTravelersDropdown(!showTravelersDropdown);
                // Close all multi-trip travelers dropdowns
                setShowMultiTripTravelersDropdown({});
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                {travelers.adults + travelers.children + travelers.infants} Travelers, {travelers.cabinClass}
              </span>
              <i className={`fas fa-chevron-${showTravelersDropdown ? 'up' : 'down'}`}></i>
            </div>
            <div className="fs-12">Passengers & class</div>
            
            {showTravelersDropdown && (
              <div className={`travelers-dropdown ${showTravelersDropdown ? 'show' : 'hide'}`}>
                <div className="traveler-counter mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Adults</div>
                      <small className="text-muted">Ages 13 or above</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTravelersChange('adults', 'decrement')}
                        disabled={travelers.adults <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{travelers.adults}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTravelersChange('adults', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Children</div>
                      <small className="text-muted">Ages 2-12</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTravelersChange('children', 'decrement')}
                        disabled={travelers.children <= 0}
                      >
                        -
                      </button>
                      <span className="fw-bold">{travelers.children}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTravelersChange('children', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div className="fw-bold">Infants</div>
                      <small className="text-muted">Under 2</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTravelersChange('infants', 'decrement')}
                        disabled={travelers.infants <= 0}
                      >
                        -
                      </button>
                      <span className="fw-bold">{travelers.infants}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTravelersChange('infants', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="cabin-class-container">
                  <div className="cabin-class-title">
                    <FaPlane style={{ fontSize: '12px', color: 'rgb(83, 10, 166)' }} />
                    Cabin Class
                  </div>
                  <div className="cabin-options-grid">
                    {[
                      { key: 'Economy', label: 'Economy' },
                      { key: 'Premium Economy', label: 'Premium' },
                      { key: 'Business', label: 'Business' },
                      { key: 'First Class', label: 'First Class' }
                    ].map(cabin => (
                      <div 
                        key={cabin.key}
                        className={`cabin-option ${travelers.cabinClass === cabin.key ? 'selected' : ''}`}
                        onClick={() => handleCabinClassChange(cabin.key)}
                      >
                        {cabin.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          type="button" 
          className="isolated-flight-search-btn"
          onClick={handleSearch}
        >
          <FaTag />
          Go to Cheapest Tickets
        </button>
      </div>

      {/* Multi Trip Additional Flights - Only show for Multi Trip */}
      {tripType === 'multitrip' && multiTrips.slice(1).map((trip, index) => (
        <div key={trip.id} className="multi-trip-container">
          <div className="d-lg-flex">
            <div className="d-flex form-info">
              <div className="form-item position-relative">
                <label className="form-label">
                  <FaPlane className="me-2" />
                  From
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City or Airport"
                  value={trip.from}
                  onChange={(e) => handleMultiTripFromChange(trip.id, e.target.value)}
                  onFocus={() => {
                    if (trip.from.length >= 2) {
                      const suggestions = searchAirports(trip.from);
                      setMultiTrips(multiTrips.map(t => 
                        t.id === trip.id ? { ...t, fromSuggestions: suggestions, showFromSuggestions: true } : t
                      ));
                    } else if (popularAirports.length > 0) {
                      setMultiTrips(multiTrips.map(t => 
                        t.id === trip.id ? { ...t, fromSuggestions: popularAirports, showFromSuggestions: true } : t
                      ));
                    }
                  }}
                  onBlur={() => {
                    // Close dropdown after a small delay to allow for clicks
                    setTimeout(() => {
                      setMultiTrips(multiTrips.map(t => 
                        t.id === trip.id ? { ...t, showFromSuggestions: false } : t
                      ));
                    }, 150);
                  }}
                />
                <div className="fs-12">Departure location</div>
                
                {trip.showFromSuggestions && (trip.fromSuggestions.length > 0 || popularAirports.length > 0) && (
                  <div className="suggestions-dropdown">
                    {trip.fromSuggestions.length === 0 && popularAirports.length > 0 && (
                      <>
                        <div className="popular-section">
                          <FaFire className="fire-icon" /> Popular Destinations
                        </div>
                        {popularAirports.map((airport, idx) => (
                          <div
                            key={idx}
                            className="suggestion-item"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleMultiTripAirportSelect(trip.id, airport, 'from');
                            }}
                          >
                            <div className="airport-location">
                              {airport.city}, {airport.country}
                            </div>
                            <div className="airport-header">
                              <div className="airport-main-info">
                                <div className="airport-code">{airport.iata}</div>
                                <div className="airport-name">{airport.name}</div>
                                <FaPlaneDeparture className="airport-icon" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {trip.fromSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className={`suggestion-item ${item.type === 'city' ? 'city-item' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleMultiTripAirportSelect(trip.id, item, 'from');
                        }}
                      >
                        {item.type === 'city' ? (
                          <>
                            <div className="airport-header">
                              <div className="city-info">
                                <FaMapMarkerAlt className="airport-icon" style={{color: '#ff5100'}} />
                                <div className="city-name">{item.city}</div>
                                <div className="city-airports-count">{item.airports.length} airports</div>
                              </div>
                            </div>
                            <div className="airport-location">
                              All airports in {item.country}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="airport-location">
                              {item.city}, {item.country}
                            </div>
                            <div className="airport-header">
                              <div className="airport-main-info">
                                <div className="airport-code">{item.iata}</div>
                                <div className="airport-name">{item.name}</div>
                                <FaPlaneDeparture className="airport-icon" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-item position-relative">
                <button 
                  type="button" 
                  className="swap-btn position-absolute"
                  onClick={() => swapMultiTripLocations(trip.id)}
                  style={{ 
                    top: '50%', 
                    left: '-25px', 
                    zIndex: 10
                  }}
                >
                  <GitCompareArrows size={20} />
                </button>
                <label className="form-label">
                  <FaPlane className="me-2" />
                  To
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City or Airport"
                  value={trip.to}
                  onChange={(e) => handleMultiTripToChange(trip.id, e.target.value)}
                  onFocus={() => {
                    if (trip.to.length >= 2) {
                      const suggestions = searchAirports(trip.to);
                      setMultiTrips(multiTrips.map(t => 
                        t.id === trip.id ? { ...t, toSuggestions: suggestions, showToSuggestions: true } : t
                      ));
                    } else if (popularAirports.length > 0) {
                      setMultiTrips(multiTrips.map(t => 
                        t.id === trip.id ? { ...t, toSuggestions: popularAirports, showToSuggestions: true } : t
                      ));
                    }
                  }}
                  onBlur={() => {
                    // Close dropdown after a small delay to allow for clicks
                    setTimeout(() => {
                      setMultiTrips(multiTrips.map(t => 
                        t.id === trip.id ? { ...t, showToSuggestions: false } : t
                      ));
                    }, 150);
                  }}
                />
                <div className="fs-12">Arrival location</div>
                
                {trip.showToSuggestions && (trip.toSuggestions.length > 0 || popularAirports.length > 0) && (
                  <div className="suggestions-dropdown">
                    {trip.toSuggestions.length === 0 && popularAirports.length > 0 && (
                      <>
                        <div className="popular-section">
                          <FaFire className="fire-icon" /> Popular Destinations
                        </div>
                        {popularAirports.map((airport, idx) => (
                          <div
                            key={idx}
                            className="suggestion-item"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleMultiTripAirportSelect(trip.id, airport, 'to');
                            }}
                          >
                            <div className="airport-location">
                              {airport.city}, {airport.country}
                            </div>
                            <div className="airport-header">
                              <div className="airport-main-info">
                                <div className="airport-code">{airport.iata}</div>
                                <div className="airport-name">{airport.name}</div>
                                <FaPlaneArrival className="airport-icon" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {trip.toSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className={`suggestion-item ${item.type === 'city' ? 'city-item' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleMultiTripAirportSelect(trip.id, item, 'to');
                        }}
                      >
                        {item.type === 'city' ? (
                          <>
                            <div className="airport-header">
                              <div className="city-info">
                                <FaMapMarkerAlt className="airport-icon" style={{color: '#ff5100'}} />
                                <div className="city-name">{item.city}</div>
                                <div className="city-airports-count">{item.airports.length} airports</div>
                              </div>
                            </div>
                            <div className="airport-location">
                              All airports in {item.country}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="airport-location">
                              {item.city}, {item.country}
                            </div>
                            <div className="airport-header">
                              <div className="airport-main-info">
                                <div className="airport-code">{item.iata}</div>
                                <div className="airport-name">{item.name}</div>
                                <FaPlaneArrival className="airport-icon" />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-item">
                <label className="form-label">
                  <FaCalendarAlt className="me-2" />
                  Departure
                </label>
                <DatePicker
                  className="form-control"
                  placeholder="Select Date"
                  value={trip.date ? dayjs(trip.date) : null}
                  onChange={(date) => updateMultiTrip(trip.id, 'date', date ? date.format('YYYY-MM-DD') : '')}
                  format="MMM DD, YYYY"
                  suffixIcon={null}
                  placement="bottomLeft"
                  getPopupContainer={getDatePickerContainer}
                />
                <div className="fs-12">Departure date</div>
              </div>

              <div className="form-item position-relative">
                <label className="form-label">
                  <FaMapMarkerAlt className="me-2" />
                  Travelers
                </label>
                <div 
                  className="form-control d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer', lineHeight: '1.1' }}
                  onClick={() => toggleMultiTripTravelersDropdown(trip.id)}
                >
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>
                    {travelers.adults + travelers.children + travelers.infants} Travelers, {travelers.cabinClass}
                  </span>
                  <i className={`fas fa-chevron-${showMultiTripTravelersDropdown[trip.id] ? 'up' : 'down'}`}></i>
                </div>
                <div className="fs-12">Passengers & class</div>
                
                {showMultiTripTravelersDropdown[trip.id] && (
                  <div className={`travelers-dropdown ${showMultiTripTravelersDropdown[trip.id] ? 'show' : 'hide'}`}>
                    <div className="traveler-counter mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="fw-bold">Adults</div>
                          <small className="text-muted">Ages 13 or above</small>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <button 
                            className="counter-btn" 
                            onClick={() => handleTravelersChange('adults', 'decrement')}
                            disabled={travelers.adults <= 1}
                          >
                            -
                          </button>
                          <span className="fw-bold">{travelers.adults}</span>
                          <button 
                            className="counter-btn" 
                            onClick={() => handleTravelersChange('adults', 'increment')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div className="fw-bold">Children</div>
                          <small className="text-muted">Ages 2-12</small>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <button 
                            className="counter-btn" 
                            onClick={() => handleTravelersChange('children', 'decrement')}
                            disabled={travelers.children <= 0}
                          >
                            -
                          </button>
                          <span className="fw-bold">{travelers.children}</span>
                          <button 
                            className="counter-btn" 
                            onClick={() => handleTravelersChange('children', 'increment')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <div className="fw-bold">Infants</div>
                          <small className="text-muted">Under 2</small>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <button 
                            className="counter-btn" 
                            onClick={() => handleTravelersChange('infants', 'decrement')}
                            disabled={travelers.infants <= 0}
                          >
                            -
                          </button>
                          <span className="fw-bold">{travelers.infants}</span>
                          <button 
                            className="counter-btn" 
                            onClick={() => handleTravelersChange('infants', 'increment')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cabin-class-container">
                      <div className="cabin-class-title">
                        <FaPlane style={{ fontSize: '12px', color: 'rgb(83, 10, 166)' }} />
                        Cabin Class
                      </div>
                      <div className="cabin-options-grid">
                        {[
                          { key: 'Economy', label: 'Economy' },
                          { key: 'Premium Economy', label: 'Premium' },
                          { key: 'Business', label: 'Business' },
                          { key: 'First Class', label: 'First Class' }
                        ].map(cabin => (
                          <div 
                            key={cabin.key}
                            className={`cabin-option ${travelers.cabinClass === cabin.key ? 'selected' : ''}`}
                            onClick={() => handleCabinClassChange(cabin.key)}
                          >
                            {cabin.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="button" 
              className="isolated-remove-flight-btn"
              onClick={() => removeMultiTrip(trip.id)}
            >
              <FaTrash className="me-2" />
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add Trip Button - Only show for Multi Trip */}
      {tripType === 'multitrip' && (
        <div className="text-end mt-3">
          <button 
            type="button" 
            className="isolated-add-flight-btn"
            onClick={addMultiTrip}
          >
            <FaPlane className="me-2" />
            Add Another Flight
          </button>
        </div>
      )}
    </div>
  );

  const renderHotelSearch = () => (
    <div className="hotel-search">
      {/* Hotel Filters */}
      <div className="hotel-filters">
        <label className="filter-checkbox">
          <input 
            type="checkbox" 
            checked={bestDealsOnly}
            onChange={(e) => setBestDealsOnly(e.target.checked)}
          />
          <FaFire className="me-1" />
          <span className="filter-text">Best Deals Only</span>
        </label>
        
        <label className="filter-checkbox">
          <input 
            type="checkbox" 
            checked={freeCancellation}
            onChange={(e) => setFreeCancellation(e.target.checked)}
          />
          <FaTag className="me-1" />
          <span className="filter-text">Free Cancellation</span>
        </label>

        <label className="filter-checkbox">
          <input 
            type="checkbox" 
            checked={breakfastIncluded}
            onChange={(e) => setBreakfastIncluded(e.target.checked)}
          />
          <FaClock className="me-1" />
          <span className="filter-text">Breakfast Included</span>
        </label>

        {/* Spacer to push time filters to the right */}
        <div style={{ flex: 1 }}></div>

        {/* Early Check-in & Late Check-out - Moved here */}
        <div className="time-filter-group" ref={earlyCheckinPickerRef}>
          <label className="time-filter-label">
            <FaSignInAlt className="me-1" />
            Early Check-in
          </label>
          <input 
            type="text" 
            className="time-filter-input"
            value={earlyCheckinTime}
            onClick={() => setShowEarlyCheckinPicker(!showEarlyCheckinPicker)}
            readOnly
            placeholder="Select time"
          />
          {showEarlyCheckinPicker && (
            <div className="time-picker-dropdown">
              <div className="time-picker-header">Select Early Check-in Time</div>
              <div className="time-options">
                {['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'].map(time => (
                  <div 
                    key={time}
                    className={`time-option ${earlyCheckinTime === time ? 'selected' : ''}`}
                    onClick={() => {
                      setEarlyCheckinTime(time);
                      setShowEarlyCheckinPicker(false);
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="time-filter-group" ref={lateCheckoutPickerRef}>
          <label className="time-filter-label">
            <FaSignOutAlt className="me-1" />
            Late Check-out
          </label>
          <input 
            type="text" 
            className="time-filter-input"
            value={lateCheckoutTime}
            onClick={() => setShowLateCheckoutPicker(!showLateCheckoutPicker)}
            readOnly
            placeholder="Select time"
          />
          {showLateCheckoutPicker && (
            <div className="time-picker-dropdown">
              <div className="time-picker-header">Select Late Check-out Time</div>
              <div className="time-options">
                {['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map(time => (
                  <div 
                    key={time}
                    className={`time-option ${lateCheckoutTime === time ? 'selected' : ''}`}
                    onClick={() => {
                      setLateCheckoutTime(time);
                      setShowLateCheckoutPicker(false);
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="d-lg-flex">
        <div className="d-flex form-info">
          <div className="form-item position-relative" ref={hotelSuggestionsRef}>
            <label className="form-label">
              <FaHotel className="me-2" />
              City or Property
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter city or hotel name"
              value={hotelLocation}
              onChange={handleHotelLocationChange}
              onBlur={() => {
                setTimeout(() => {
                  setShowHotelSuggestions(false);
                }, 150);
              }}
            />
            <div className="fs-12">Where do you want to stay?</div>
            
            {showHotelSuggestions && hotelSuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {hotelSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${suggestion.type === 'city' ? 'city-item' : ''}`}
                    onClick={() => handleHotelSuggestionSelect(suggestion)}
                  >
                    {suggestion.type === 'city' ? (
                      <>
                        <div className="airport-location">
                          {suggestion.name}, {suggestion.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">CITY</div>
                            <div className="airport-name">{suggestion.name}</div>
                            <FaMapMarkerAlt className="airport-icon" style={{color: '#ff5100'}} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="airport-location">
                          {suggestion.city}, {suggestion.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">{suggestion.rating}★</div>
                            <div className="airport-name">{suggestion.name}</div>
                            <FaHotel className="airport-icon" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-item">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              Check-in
            </label>
            <DatePicker
              className="form-control"
              placeholder="Select Date"
              value={checkInDate ? dayjs(checkInDate) : null}
              onChange={(date) => setCheckInDate(date ? date.format('YYYY-MM-DD') : '')}
              format="MMM DD, YYYY"
              suffixIcon={null}
              placement="bottomLeft"
              getPopupContainer={getDatePickerContainer}
            />
            <div className="fs-12">When do you want to check in?</div>
          </div>

          <div className="form-item">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              Check-out
            </label>
            <DatePicker
              className="form-control"
              placeholder="Select Date"
              value={checkOutDate ? dayjs(checkOutDate) : null}
              onChange={(date) => setCheckOutDate(date ? date.format('YYYY-MM-DD') : '')}
              format="MMM DD, YYYY"
              suffixIcon={null}
              placement="bottomLeft"
              getPopupContainer={getDatePickerContainer}
            />
            <div className="fs-12">When do you want to check out?</div>
          </div>

          <div className="form-item position-relative" ref={priceDropdownRef}>
            <label className="form-label">
              <FaTag className="me-2" />
              Price Range
            </label>
            <div 
              className="form-control d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowPriceDropdown(!showPriceDropdown)}
            >
              <span>
                {selectedPriceRange ? priceRanges.find(r => r.value === selectedPriceRange)?.label : 'Select Price Range'}
              </span>
              <i className={`fas fa-chevron-${showPriceDropdown ? 'up' : 'down'}`}></i>
            </div>
            <div className="fs-12">Choose your budget</div>
            
            {showPriceDropdown && (
              <div className="price-dropdown">
                {priceRanges.map((range, index) => (
                  <div
                    key={index}
                    className={`price-item ${selectedPriceRange === range.value ? 'selected' : ''}`}
                    onClick={() => handlePriceRangeSelect(range)}
                  >
                    {range.label}
                  </div>
                ))}
              </div>
            )}
          </div>




          <div className="form-item position-relative" ref={hotelGuestsDropdownRef}>
            <label className="form-label">
              <FaUsers className="me-2" />
              Guests & Rooms
            </label>
            <div 
              className="form-control d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer', lineHeight: '1.1' }}
              onClick={() => setShowHotelGuestsDropdown(!showHotelGuestsDropdown)}
            >
              <span style={{ fontSize: '13px', fontWeight: '500' }}>
                {hotelGuests.adults} Adults, {hotelGuests.children} Children, {hotelGuests.rooms} Room{hotelGuests.rooms > 1 ? 's' : ''}
              </span>
              <i className={`fas fa-chevron-${showHotelGuestsDropdown ? 'up' : 'down'}`}></i>
            </div>
            <div className="fs-12">Add guests and rooms</div>
            
            {showHotelGuestsDropdown && (
              <div className="hotel-guests-dropdown">
                <div className="traveler-counter mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Adults</div>
                      <small className="text-muted">Ages 13 or above</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleHotelGuestsChange('adults', 'decrement')}
                        disabled={hotelGuests.adults <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{hotelGuests.adults}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleHotelGuestsChange('adults', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Children</div>
                      <small className="text-muted">Ages 2-12</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleHotelGuestsChange('children', 'decrement')}
                        disabled={hotelGuests.children <= 0}
                      >
                        -
                      </button>
                      <span className="fw-bold">{hotelGuests.children}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleHotelGuestsChange('children', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Rooms</div>
                      <small className="text-muted">Number of rooms</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleHotelGuestsChange('rooms', 'decrement')}
                        disabled={hotelGuests.rooms <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{hotelGuests.rooms}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleHotelGuestsChange('rooms', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          type="button" 
          className="isolated-hotel-search-btn"
          onClick={handleSearch}
        >
          <FaHotel className="me-2" />
          Search Hotels
        </button>
      </div>

      {/* Hotel Advanced Filters - Like Original Design */}
      <div className="hotel-advanced-filters">
        {/* Citizenship */}
        <div className="filter-group citizenship-group">
          <label className="filter-group-label">
            <FaUser className="me-1" />
            Citizenship
          </label>
          <div className="citizenship-selector" ref={citizenshipDropdownRef}>
            <div 
              className="citizenship-display"
              onClick={handleCitizenshipDropdownToggle}
            >
              <span className="citizenship-flag">{selectedCitizenshipObj.flag}</span>
              <span className="citizenship-name">{selectedCitizenship}</span>
              <span className="citizenship-currency">({selectedCitizenshipObj.currency})</span>
              <i className={`fas fa-chevron-${showCitizenshipDropdown ? 'up' : 'down'}`}></i>
            </div>
            {showCitizenshipDropdown && (
              <div className="citizenship-dropdown">
                {citizenshipOptions.map((citizenship, index) => (
                  <div
                    key={index}
                    className={`citizenship-item ${selectedCitizenship === citizenship.name ? 'selected' : ''}`}
                    onClick={() => handleCitizenshipSelect(citizenship)}
                  >
                    <span className="citizenship-flag">{citizenship.flag}</span>
                    <span className="citizenship-name">{citizenship.name}</span>
                    <span className="citizenship-currency">({citizenship.currency})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Star Rating */}
        <div className="filter-group">
          <label className="filter-group-label">
            <FaStar className="me-1" />
            Rating
          </label>
          <div className="star-rating-options">
            <div 
              className={`star-rating-option ${hotelStarRating.includes("1") ? 'selected' : ''}`}
              onClick={() => handleStarRatingToggle("1")}
            >
              <span className="star-display">
                <FaStar className="star-icon" />
              </span>
            </div>
            <div 
              className={`star-rating-option ${hotelStarRating.includes("2") ? 'selected' : ''}`}
              onClick={() => handleStarRatingToggle("2")}
            >
              <span className="star-display">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
              </span>
            </div>
            <div 
              className={`star-rating-option ${hotelStarRating.includes("3") ? 'selected' : ''}`}
              onClick={() => handleStarRatingToggle("3")}
            >
              <span className="star-display">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
              </span>
            </div>
            <div 
              className={`star-rating-option ${hotelStarRating.includes("4") ? 'selected' : ''}`}
              onClick={() => handleStarRatingToggle("4")}
            >
              <span className="star-display">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
              </span>
            </div>
            <div 
              className={`star-rating-option ${hotelStarRating.includes("5") ? 'selected' : ''}`}
              onClick={() => handleStarRatingToggle("5")}
            >
              <span className="star-display">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
              </span>
            </div>

          </div>
        </div>

        {/* Meal Plan */}
        <div className="filter-group">
          <label 
            className="filter-group-label"
            onClick={() => setShowMealExplanationModal(true)}
            style={{ cursor: 'pointer' }}
            title="Click to learn about meal plans"
          >
            Meals
          </label>
          <div className="meal-plan-options">
            <div 
              className={`meal-plan-option ${selectedMealPlan.includes('room-only') ? 'selected' : ''}`}
              onMouseEnter={() => setHoveredMealPlan('room-only')}
              onMouseLeave={() => setHoveredMealPlan(null)}
              onClick={() => handleMealPlanToggle('room-only')}
            >
              <span className="meal-plan-display">
                <FaBed className="meal-icon" />
                <span className="meal-text">RO</span>
              </span>
              {hoveredMealPlan === 'room-only' && (
                <div className="meal-tooltip">
                  Room Only - Accommodation only, no meals included
                </div>
              )}
            </div>
            <div 
              className={`meal-plan-option ${selectedMealPlan.includes('breakfast') ? 'selected' : ''}`}
              onMouseEnter={() => setHoveredMealPlan('breakfast')}
              onMouseLeave={() => setHoveredMealPlan(null)}
              onClick={() => handleMealPlanToggle('breakfast')}
            >
              <span className="meal-plan-display">
                <FaCoffee className="meal-icon" />
                <span className="meal-text">BB</span>
              </span>
              {hoveredMealPlan === 'breakfast' && (
                <div className="meal-tooltip">
                  Bed & Breakfast - Daily breakfast included
                </div>
              )}
            </div>
            <div 
              className={`meal-plan-option ${selectedMealPlan.includes('half-board') ? 'selected' : ''}`}
              onMouseEnter={() => setHoveredMealPlan('half-board')}
              onMouseLeave={() => setHoveredMealPlan(null)}
              onClick={() => handleMealPlanToggle('half-board')}
            >
              <span className="meal-plan-display">
                <FaUtensils className="meal-icon" />
                <span className="meal-text">HB</span>
              </span>
              {hoveredMealPlan === 'half-board' && (
                <div className="meal-tooltip">
                  Half Board - Breakfast and dinner included
                </div>
              )}
            </div>
            <div 
              className={`meal-plan-option ${selectedMealPlan.includes('full-board') ? 'selected' : ''}`}
              onMouseEnter={() => setHoveredMealPlan('full-board')}
              onMouseLeave={() => setHoveredMealPlan(null)}
              onClick={() => handleMealPlanToggle('full-board')}
            >
              <span className="meal-plan-display">
                <FaUtensils className="meal-icon" />
                <span className="meal-text">FB</span>
              </span>
              {hoveredMealPlan === 'full-board' && (
                <div className="meal-tooltip">
                  Full Board - All three meals included daily
                </div>
              )}
            </div>
            <div 
              className={`meal-plan-option ${selectedMealPlan.includes('all-inclusive') ? 'selected' : ''}`}
              onMouseEnter={() => setHoveredMealPlan('all-inclusive')}
              onMouseLeave={() => setHoveredMealPlan(null)}
              onClick={() => handleMealPlanToggle('all-inclusive')}
            >
              <span className="meal-plan-display">
                <FaGlassCheers className="meal-icon" />
                <span className="meal-text">AI</span>
              </span>
              {hoveredMealPlan === 'all-inclusive' && (
                <div className="meal-tooltip">
                  All Inclusive - All meals, snacks & beverages included
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Property Type */}
        <div className="filter-group">
          <label className="filter-group-label">
            <FaBuilding className="me-1" />
            Property
          </label>
          <div className="property-type-options">
            <div 
              className={`property-type-option ${hotelType.includes("Hotel") ? 'selected' : ''}`}
              onClick={() => handlePropertyTypeToggle("Hotel")}
            >
              <span className="property-type-display">
                <FaBuilding className="property-icon" />
                <span className="property-text">Hotel</span>
              </span>
            </div>
            <div 
              className={`property-type-option ${hotelType.includes("Resort") ? 'selected' : ''}`}
              onClick={() => handlePropertyTypeToggle("Resort")}
            >
              <span className="property-type-display">
                <FaUmbrellaBeach className="property-icon" />
                <span className="property-text">Resort</span>
              </span>
            </div>
            <div 
              className={`property-type-option ${hotelType.includes("Apartment") ? 'selected' : ''}`}
              onClick={() => handlePropertyTypeToggle("Apartment")}
            >
              <span className="property-type-display">
                <FaHome className="property-icon" />
                <span className="property-text">Apt</span>
              </span>
            </div>
            <div 
              className={`property-type-option ${hotelType.includes("Villa") ? 'selected' : ''}`}
              onClick={() => handlePropertyTypeToggle("Villa")}
            >
              <span className="property-type-display">
                <FaHome className="property-icon" />
                <span className="property-text">Villa</span>
              </span>
            </div>
            <div 
              className={`property-type-option ${hotelType.includes("Hostel") ? 'selected' : ''}`}
              onClick={() => handlePropertyTypeToggle("Hostel")}
            >
              <span className="property-type-display">
                <FaWarehouse className="property-icon" />
                <span className="property-text">Hostel</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  const renderCarSearch = () => (
    <div className="car-search">
      <div className="trip-type-selector mb-4">
        <div className="d-flex justify-content-between align-items-center">
        <div className="btn-group" role="group">
          <input type="radio" className="btn-check" name="carPickupType" id="same" value="same" 
                 checked={carPickupType === 'same'} onChange={(e) => setCarPickupType(e.target.value)} />
          <label className="isolated-car-type-btn" htmlFor="same">Same Drop-off</label>
          
          <input type="radio" className="btn-check" name="carPickupType" id="different" value="different" 
                 checked={carPickupType === 'different'} onChange={(e) => setCarPickupType(e.target.value)} />
          <label className="isolated-car-type-btn" htmlFor="different">Different Drop-off</label>
            
            <input type="radio" className="btn-check" name="carPickupType" id="transfer" value="transfer" 
                   checked={carPickupType === 'transfer'} onChange={(e) => setCarPickupType(e.target.value)} />
            <label className="isolated-car-type-btn" htmlFor="transfer">Transfer Service</label>
          </div>

          {/* Transfer Vehicle Filters - Same row as buttons */}
          {carPickupType === 'transfer' && (
            <div className="d-flex gap-2">
              <div 
                className={`transfer-vehicle-option ${selectedTransferVehicle.includes("regular-car") ? 'selected' : ''}`}
                onClick={() => handleTransferVehicleToggle("regular-car")}
                style={{ padding: '6px 10px', fontSize: '11px' }}
              >
                <span className="transfer-vehicle-display">
                  <FaCar className="transfer-vehicle-icon me-1" style={{ fontSize: '11px', color: 'rgb(83, 10, 166)' }} />
                  <span className="transfer-vehicle-text">Small Car</span>
                </span>
              </div>
              <div 
                className={`transfer-vehicle-option ${selectedTransferVehicle.includes("van-minibus") ? 'selected' : ''}`}
                onClick={() => handleTransferVehicleToggle("van-minibus")}
                style={{ padding: '6px 10px', fontSize: '11px' }}
              >
                <span className="transfer-vehicle-display">
                  <FaTaxi className="transfer-vehicle-icon me-1" style={{ fontSize: '11px', color: 'rgb(83, 10, 166)' }} />
                  <span className="transfer-vehicle-text">Van Vito</span>
                </span>
              </div>
              <div 
                className={`transfer-vehicle-option ${selectedTransferVehicle.includes("sprinter-large") ? 'selected' : ''}`}
                onClick={() => handleTransferVehicleToggle("sprinter-large")}
                style={{ padding: '6px 10px', fontSize: '11px' }}
              >
                <span className="transfer-vehicle-display">
                  <FaBus className="transfer-vehicle-icon me-1" style={{ fontSize: '11px', color: 'rgb(83, 10, 166)' }} />
                  <span className="transfer-vehicle-text">Sprinter</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="d-lg-flex">
        <div className="d-flex form-info">
          <div className="form-item position-relative" ref={carPickupSuggestionsRef}>
            <label className="form-label">
              <FaCar className="me-2" />
              {carPickupType === 'transfer' ? 'From' : 'Pick-up Location'}
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={carPickupType === 'transfer' ? 'Airport, Hotel, or Address' : 'City or Airport'}
              value={carPickupLocation}
              onChange={handleCarPickupLocationChange}
              onFocus={() => {
                if (carPickupLocation.length >= 2) {
                  setShowCarPickupSuggestions(true);
                } else if (popularAirports.length > 0) {
                  setCarPickupSuggestions(popularAirports);
                  setShowCarPickupSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowCarPickupSuggestions(false);
                }, 150);
              }}
            />
            <div className="fs-12">{carPickupType === 'transfer' ? 'Pickup location' : 'Where do you want to pick up?'}</div>
            
            {showCarPickupSuggestions && (carPickupSuggestions.length > 0 || popularAirports.length > 0) && (
              <div className="suggestions-dropdown">
                {carPickupSuggestions.length === 0 && popularAirports.length > 0 && (
                  <>
                    <div className="popular-section">
                      <FaFire className="fire-icon" /> Popular Locations
                    </div>
                    {popularAirports.map((airport, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleCarLocationSelect(airport, 'pickup')}
                      >
                        <div className="airport-location">
                          {airport.city}, {airport.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">{airport.iata}</div>
                            <div className="airport-name">{airport.name}</div>
                            <FaCar className="airport-icon" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {carPickupSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${item.type === 'city' ? 'city-item' : ''}`}
                    onClick={() => handleCarLocationSelect(item, 'pickup')}
                  >
                    {item.type === 'city' ? (
                      <>
                        <div className="airport-header">
                          <div className="city-info">
                            <FaMapMarkerAlt className="airport-icon" style={{color: '#ff5100'}} />
                            <div className="city-name">{item.city}</div>
                            <div className="city-airports-count">{item.airports.length} locations</div>
                          </div>
                        </div>
                        <div className="airport-location">
                          All rental locations in {item.country}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="airport-location">
                          {item.city}, {item.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">{item.iata}</div>
                            <div className="airport-name">{item.name}</div>
                            <FaCar className="airport-icon" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {(carPickupType === 'different' || carPickupType === 'transfer') && (
            <div className="form-item position-relative" ref={carDropoffSuggestionsRef}>
              <label className="form-label">
                <FaCar className="me-2" />
                {carPickupType === 'transfer' ? 'To' : 'Drop-off Location'}
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={carPickupType === 'transfer' ? 'Airport, Hotel, or Address' : 'City or Airport'}
                value={carDropoffLocation}
                onChange={handleCarDropoffLocationChange}
                onFocus={() => {
                  if (carDropoffLocation.length >= 2) {
                    setShowCarDropoffSuggestions(true);
                  } else if (popularAirports.length > 0) {
                    setCarDropoffSuggestions(popularAirports);
                    setShowCarDropoffSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowCarDropoffSuggestions(false);
                  }, 150);
                }}
              />
              <div className="fs-12">{carPickupType === 'transfer' ? 'Drop-off location' : 'Where do you want to drop off?'}</div>
              
              {showCarDropoffSuggestions && (carDropoffSuggestions.length > 0 || popularAirports.length > 0) && (
                <div className="suggestions-dropdown">
                  {carDropoffSuggestions.length === 0 && popularAirports.length > 0 && (
                    <>
                      <div className="popular-section">
                        <FaFire className="fire-icon" /> Popular Locations
                      </div>
                      {popularAirports.map((airport, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleCarLocationSelect(airport, 'dropoff')}
                        >
                          <div className="airport-location">
                            {airport.city}, {airport.country}
                          </div>
                          <div className="airport-header">
                            <div className="airport-main-info">
                              <div className="airport-code">{airport.iata}</div>
                              <div className="airport-name">{airport.name}</div>
                              <FaCar className="airport-icon" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {carDropoffSuggestions.map((item, index) => (
                    <div
                      key={index}
                      className={`suggestion-item ${item.type === 'city' ? 'city-item' : ''}`}
                      onClick={() => handleCarLocationSelect(item, 'dropoff')}
                    >
                      {item.type === 'city' ? (
                        <>
                          <div className="airport-header">
                            <div className="city-info">
                              <FaMapMarkerAlt className="airport-icon" style={{color: '#ff5100'}} />
                              <div className="city-name">{item.city}</div>
                              <div className="city-airports-count">{item.airports.length} locations</div>
                            </div>
                          </div>
                          <div className="airport-location">
                            All rental locations in {item.country}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="airport-location">
                            {item.city}, {item.country}
                          </div>
                          <div className="airport-header">
                            <div className="airport-main-info">
                              <div className="airport-code">{item.iata}</div>
                              <div className="airport-name">{item.name}</div>
                              <FaCar className="airport-icon" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="form-item">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              {carPickupType === 'transfer' ? 'Transfer Date' : 'Pick-up Date & Time'}
            </label>
            <DatePicker
              className="form-control"
              placeholder="Select Date"
              value={carPickupDate ? dayjs(carPickupDate) : null}
              onChange={(date) => setCarPickupDate(date ? date.format('YYYY-MM-DD') : '')}
              format="MMM DD, YYYY"
              suffixIcon={null}
              placement="bottomLeft"
              getPopupContainer={getDatePickerContainer}
            />
            <div className="fs-12">{carPickupType === 'transfer' ? 'Transfer date' : 'When do you want to pick up?'}</div>
          </div>

          {carPickupType !== 'transfer' && (
          <div className="form-item">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              Drop-off Date & Time
            </label>
            <DatePicker
              className="form-control"
              placeholder="Select Date"
              value={carDropoffDate ? dayjs(carDropoffDate) : null}
              onChange={(date) => setCarDropoffDate(date ? date.format('YYYY-MM-DD') : '')}
              format="MMM DD, YYYY"
              suffixIcon={null}
              placement="bottomLeft"
              getPopupContainer={getDatePickerContainer}
            />
            <div className="fs-12">When do you want to drop off?</div>
          </div>
          )}

          {carPickupType === 'transfer' && (
            <div className="form-item">
              <label className="form-label">
                <FaClock className="me-2" />
                Transfer Time
              </label>
              <input
                type="time"
                className="form-control"
                value={carPickupTime}
                onChange={(e) => setCarPickupTime(e.target.value)}
              />
              <div className="fs-12">Pickup time</div>
            </div>
          )}
        </div>

        <button 
          type="button" 
          className="isolated-car-search-btn"
          onClick={handleSearch}
        >
          <FaCar className="me-2" />
          {carPickupType === 'transfer' ? 'Search Transfers' : 'Search Cars'}
        </button>
      </div>

      
    </div>
  );

  const renderCruiseSearch = () => (
    <div className="cruise-search">
      <div className="d-lg-flex">
        <div className="d-flex form-info">
          <div className="form-item position-relative" ref={cruiseDestinationSuggestionsRef}>
            <label className="form-label">
              <FaShip className="me-2" />
              Destination
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Country or City"
              value={cruiseDestination}
              onChange={handleCruiseDestinationChange}
              onFocus={() => {
                if (cruiseDestination.length >= 2) {
                  setShowCruiseDestinationSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowCruiseDestinationSuggestions(false);
                }, 150);
              }}
            />
            <div className="fs-12">Choose your cruise destination</div>
            
            {showCruiseDestinationSuggestions && cruiseDestinationSuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {cruiseDestinationSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${item.type === 'country' ? 'city-item' : ''}`}
                    onClick={() => handleCruiseDestinationSelect(item)}
                  >
                    {item.type === 'country' ? (
                      <>
                        <div className="airport-header">
                          <div className="city-info">
                            <FaShip className="airport-icon" style={{color: '#0066cc'}} />
                            <div className="city-name">{item.name}</div>
                            <div className="city-airports-count">Country</div>
                          </div>
                        </div>
                        <div className="airport-location">
                          Cruise destinations in {item.name}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="airport-location">
                          {item.name}, {item.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">CITY</div>
                            <div className="airport-name">{item.name}</div>
                            <FaMapMarkerAlt className="airport-icon" style={{color: '#0066cc'}} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-item">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              Departure Date
            </label>
            <DatePicker
              className="form-control"
              placeholder="Select Date"
              value={cruiseDepartureDate ? dayjs(cruiseDepartureDate) : null}
              onChange={(date) => setCruiseDepartureDate(date ? date.format('YYYY-MM-DD') : '')}
              format="MMM DD, YYYY"
              suffixIcon={null}
              placement="bottomLeft"
              getPopupContainer={getDatePickerContainer}
            />
            <div className="fs-12">When do you want to depart?</div>
          </div>

          <div className="form-item position-relative">
            <label className="form-label">
              <FaClock className="me-2" />
              Duration
            </label>
            <div 
              className="form-control d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowDurationDropdown(!showDurationDropdown)}
            >
              <span>
                {cruiseDuration || 'Select Duration'}
              </span>
              <i className={`fas fa-chevron-${showDurationDropdown ? 'up' : 'down'}`}></i>
            </div>
            <div className="fs-12">How long do you want to cruise?</div>
            
            {showDurationDropdown && (
              <div className="duration-dropdown">
                {[
                  { value: "3-5", label: "3-5 Days", icon: <FaClock className="duration-icon" /> },
                  { value: "6-8", label: "6-8 Days", icon: <FaClock className="duration-icon" /> },
                  { value: "9-14", label: "9-14 Days", icon: <FaClock className="duration-icon" /> },
                  { value: "15+", label: "15+ Days", icon: <FaClock className="duration-icon" /> }
                ].map((duration, index) => (
                  <div
                    key={index}
                    className={`duration-item ${cruiseDuration === duration.value ? 'selected' : ''}`}
                    onClick={() => {
                      setCruiseDuration(duration.value);
                      setShowDurationDropdown(false);
                    }}
                  >
                    {duration.icon}
                    {duration.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-item position-relative" ref={cruiseGuestsDropdownRef}>
            <label className="form-label">
              <FaUsers className="me-2" />
              Travelers
            </label>
            <div 
              className="form-control d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowCruiseGuestsDropdown(!showCruiseGuestsDropdown)}
            >
              <span>
                {cruiseGuests.adults + cruiseGuests.children} Travelers
              </span>
              <i className={`fas fa-chevron-${showCruiseGuestsDropdown ? 'up' : 'down'}`}></i>
            </div>
            <div className="fs-12">Add travelers</div>
            
            {showCruiseGuestsDropdown && (
              <div className={`travelers-dropdown ${showCruiseGuestsDropdown ? 'show' : 'hide'}`}>
                <div className="traveler-counter mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Adults</div>
                      <small className="text-muted">Ages 18 or above</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleCruiseGuestsChange('adults', 'decrement')}
                        disabled={cruiseGuests.adults <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{cruiseGuests.adults}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleCruiseGuestsChange('adults', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Children</div>
                      <small className="text-muted">Ages 2-17</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleCruiseGuestsChange('children', 'decrement')}
                        disabled={cruiseGuests.children <= 0}
                      >
                        -
                      </button>
                      <span className="fw-bold">{cruiseGuests.children}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleCruiseGuestsChange('children', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          type="button" 
          className="isolated-cruise-search-btn"
          onClick={handleSearch}
        >
          <FaShip className="me-2" />
          Search Cruises
        </button>
      </div>
    </div>
  );

  const renderTourSearch = () => (
    <div className="tour-search">
      <div className="d-lg-flex">
        <div className="d-flex form-info">
          <div className="form-item position-relative" ref={tourDestinationSuggestionsRef}>
            <label className="form-label">
              <FaUmbrellaBeach className="me-2" />
              Destination
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Country or City"
              value={tourDestination}
              onChange={handleTourDestinationChange}
              onFocus={() => {
                if (tourDestination.length >= 2) {
                  setShowTourDestinationSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowTourDestinationSuggestions(false);
                }, 150);
              }}
            />
            <div className="fs-12">Choose your tour destination</div>
            
            {showTourDestinationSuggestions && tourDestinationSuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {tourDestinationSuggestions.map((item, index) => (
                  <div
                    key={index}
                    className={`suggestion-item ${item.type === 'country' ? 'city-item' : ''}`}
                    onClick={() => handleTourDestinationSelect(item)}
                  >
                    {item.type === 'country' ? (
                      <>
                        <div className="airport-header">
                          <div className="city-info">
                            <FaUmbrellaBeach className="airport-icon" style={{color: '#ff9500'}} />
                            <div className="city-name">{item.name}</div>
                            <div className="city-airports-count">Country</div>
                          </div>
                        </div>
                        <div className="airport-location">
                          Tour destinations in {item.name}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="airport-location">
                          {item.name}, {item.country}
                        </div>
                        <div className="airport-header">
                          <div className="airport-main-info">
                            <div className="airport-code">CITY</div>
                            <div className="airport-name">{item.name}</div>
                            <FaMapMarkerAlt className="airport-icon" style={{color: '#ff9500'}} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-item">
            <label className="form-label">
              <FaCalendarAlt className="me-2" />
              Departure Date
            </label>
            <DatePicker
              className="form-control"
              placeholder="Select Date"
              value={tourDepartureDate ? dayjs(tourDepartureDate) : null}
              onChange={(date) => setTourDepartureDate(date ? date.format('YYYY-MM-DD') : '')}
              format="MMM DD, YYYY"
              suffixIcon={null}
              placement="bottomLeft"
              getPopupContainer={getDatePickerContainer}
            />
            <div className="fs-12">When do you want to depart?</div>
          </div>

          <div className="form-item position-relative">
            <label className="form-label">
              <FaClock className="me-2" />
              Duration
            </label>
            <div 
              className="form-control d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowTourDurationDropdown(!showTourDurationDropdown)}
            >
              <span>
                {tourDuration || 'Select Duration'}
              </span>
              <i className={`fas fa-chevron-${showTourDurationDropdown ? 'up' : 'down'}`}></i>
            </div>
            <div className="fs-12">How long do you want to tour?</div>
            
            {showTourDurationDropdown && (
              <div className="duration-dropdown">
                {[
                  { value: "1-3", label: "1-3 Days", icon: <FaClock className="duration-icon" /> },
                  { value: "4-7", label: "4-7 Days", icon: <FaClock className="duration-icon" /> },
                  { value: "8-14", label: "8-14 Days", icon: <FaClock className="duration-icon" /> },
                  { value: "15+", label: "15+ Days", icon: <FaClock className="duration-icon" /> }
                ].map((duration, index) => (
                  <div
                    key={index}
                    className={`duration-item ${tourDuration === duration.value ? 'selected' : ''}`}
                    onClick={() => {
                      setTourDuration(duration.value);
                      setShowTourDurationDropdown(false);
                    }}
                  >
                    {duration.icon}
                    {duration.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-item position-relative" ref={tourGuestsDropdownRef}>
            <label className="form-label">
              <FaUsers className="me-2" />
              Travelers
            </label>
            <div 
              className="form-control d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowTourGuestsDropdown(!showTourGuestsDropdown)}
            >
              <span>
                {tourGuests.adults + tourGuests.children} Travelers
              </span>
              <i className={`fas fa-chevron-${showTourGuestsDropdown ? 'up' : 'down'}`}></i>
            </div>
            <div className="fs-12">Add travelers</div>
            
            {showTourGuestsDropdown && (
              <div className={`travelers-dropdown ${showTourGuestsDropdown ? 'show' : 'hide'}`}>
                <div className="traveler-counter mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Adults</div>
                      <small className="text-muted">Ages 18 or above</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTourGuestsChange('adults', 'decrement')}
                        disabled={tourGuests.adults <= 1}
                      >
                        -
                      </button>
                      <span className="fw-bold">{tourGuests.adults}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTourGuestsChange('adults', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="fw-bold">Children</div>
                      <small className="text-muted">Ages 2-17</small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTourGuestsChange('children', 'decrement')}
                        disabled={tourGuests.children <= 0}
                      >
                        -
                      </button>
                      <span className="fw-bold">{tourGuests.children}</span>
                      <button 
                        className="counter-btn" 
                        onClick={() => handleTourGuestsChange('children', 'increment')}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          type="button" 
          className="isolated-tour-search-btn"
          onClick={handleSearch}
        >
          <FaUmbrellaBeach className="me-2" />
          Search Tours
        </button>
      </div>
    </div>
  );

  // Handle tab change with navigation
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    // Navigate to corresponding page
    const targetRoute = tabToRoute[newTab];
    if (targetRoute && targetRoute !== pathname) {
      router.push(targetRoute);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "flights":
        return renderFlightSearch();
      case "hotels":
        return renderHotelSearch();
      case "cars":
        return renderCarSearch();
      case "cruises":
        return renderCruiseSearch();
      case "tours":
        return renderTourSearch();
      default:
        return renderFlightSearch();
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <style>{`
        /* === الحل النهائي للنوافذ المنسدلة في صفحة الفنادق === */
        .suggestions-dropdown,
        .price-dropdown,
        .hotel-guests-dropdown {
          z-index: 2147483647 !important;
          position: fixed !important;
          background: white !important;
          border: 1px solid #ddd !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        /* إجبار الفلاتر السفلية على z-index منخفض */
        .hotel-advanced-filters,
        .filter-group,
        .citizenship-dropdown {
          z-index: 1 !important;
          position: relative !important;
        }
      `}</style>
      <div className="banner-form">
        {!isFlightListPage && (
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "flights" ? "active" : ""}`}
                onClick={() => handleTabChange("flights")}
                role="tab"
                style={{ cursor: "pointer" }}
              >
                <FaPlane className="me-2" />
                Flights
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "hotels" ? "active" : ""}`}
                onClick={() => handleTabChange("hotels")}
                role="tab"
                style={{ cursor: "pointer" }}
              >
                <FaHotel className="me-2" />
                Hotels
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "cars" ? "active" : ""}`}
                onClick={() => handleTabChange("cars")}
                role="tab"
                style={{ cursor: "pointer" }}
              >
                <FaCar className="me-2" />
                Cars
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "cruises" ? "active" : ""}`}
                onClick={() => handleTabChange("cruises")}
                role="tab"
                style={{ cursor: "pointer" }}
              >
                <FaShip className="me-2" />
                Cruises
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "tours" ? "active" : ""}`}
                onClick={() => handleTabChange("tours")}
                role="tab"
                style={{ cursor: "pointer" }}
              >
                <FaUmbrellaBeach className="me-2" />
                Tours
              </a>
            </li>
          </ul>
        )}

        <div className="tab-content">
          <div className="tab-pane fade show active">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Meal Plan Explanation Modal */}
      {showMealExplanationModal && (
        <div className="meal-explanation-modal" onClick={() => setShowMealExplanationModal(false)}>
          <div className="meal-explanation-content" onClick={(e) => e.stopPropagation()}>
            <div className="meal-explanation-header">
              <h2 className="meal-explanation-title">Hotel Meal Plans Explained</h2>
              <button 
                className="meal-explanation-close"
                onClick={() => setShowMealExplanationModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="meal-plan-grid">
              {mealPlanOptions.map((plan, index) => (
                <div key={index} className="meal-plan-card">
                  <div className="meal-plan-card-header">
                    <span className="meal-plan-card-icon">{plan.icon}</span>
                    <h3 className="meal-plan-card-title">{plan.label}</h3>
                  </div>
                  <p className="meal-plan-card-description">{plan.description}</p>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                <strong>💡 Tip:</strong> All-inclusive and Ultra All-inclusive plans often provide the best value for families and longer stays, 
                while Room Only gives you the flexibility to explore local dining options.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompleteSearchEngine;