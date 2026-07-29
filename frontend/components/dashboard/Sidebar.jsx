'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [subdroptoggle, setSubdroptoggle] = useState(false);

  useEffect(() => {
    setSubdroptoggle(pathname.includes("booking"));
  }, [pathname]);

  const activeRouterPath = (link) => link === pathname;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="card user-sidebar mb-4 mb-lg-0 theiaStickySidebar" style={{ width: '100%' }}>
        <div className="card-header user-sidebar-header">
          <div className="profile-content rounded-pill">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center justify-content-center">
                <Image
                  src="/img/users/user-01.jpg"
                  alt="profile"
                  width={50}
                  height={50}
                  className="img-fluid avatar avatar-lg rounded-circle flex-shrink-0 me-1"
                />
                <div>
                  <h6 className="fs-16">Guest User</h6>
                  <span className="fs-14 text-gray-6">
                    Since 18 June 2025
                  </span>
                </div>
              </div>
              <div>
                <Link
                  href="/dashboard/settings"
                  className="p-1 rounded-circle btn btn-light d-flex align-items-center justify-content-center"
                >
                  <i className="isax isax-edit-2 fs-14" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body user-sidebar-body">
          <ul>
            <li>
              <span className="fs-14 text-gray-3 fw-medium mb-2">Main</span>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={`d-flex align-items-center ${
                  activeRouterPath("/dashboard") && "active"
                }`}
              >
                <i className="isax isax-grid-55" /> Dashboard
              </Link>
            </li>
            <li className="submenu">
              <Link
                href="#"
                onClick={() => setSubdroptoggle(!subdroptoggle)}
                className={`d-block ${subdroptoggle ? "subdrop" : ""} ${
                  pathname.includes("booking") ? "active" : ""
                }`}
              >
                <i className="isax isax-calendar-tick5" />
                <span>My Bookings</span>
                <span className="menu-arrow" />
              </Link>
              <ul className={`${subdroptoggle && "d-block"}`}>
                <li>
                  <Link
                    href="/dashboard/booking/flights"
                    className={`fs-14 d-inline-flex align-items-center ${
                      pathname.includes("flights") ? "active" : ""
                    }`}
                  >
                    Flights
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/booking/hotels"
                    className={`fs-14 d-inline-flex align-items-center ${
                      pathname.includes("hotels") ? "active" : ""
                    }`}
                  >
                    Hotels
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/booking/cars"
                    className={`fs-14 d-inline-flex align-items-center ${
                      pathname.includes("cars") ? "active" : ""
                    }`}
                  >
                    Cars
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/booking/cruise"
                    className={`fs-14 d-inline-flex align-items-center ${
                      pathname.includes("cruise") ? "active" : ""
                    }`}
                  >
                    Cruise
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/booking/tours"
                    className={`fs-14 d-inline-flex align-items-center ${
                      pathname.includes("tours") ? "active" : ""
                    }`}
                  >
                    Tours
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link
                href="/dashboard/reviews"
                className={`d-flex align-items-center ${
                  activeRouterPath("/dashboard/reviews") ? "active" : ""
                }`}
              >
                <i className="isax isax-magic-star5" /> My Reviews
              </Link>
            </li>
            <li className="mb-2">
              <div className="message-content">
                <Link
                  href="/dashboard/messages"
                  className={`d-flex align-items-center ${
                    activeRouterPath("/dashboard/messages") ? "active" : ""
                  }`}
                >
                  <i className="isax isax-message-square5" /> Messages
                </Link>
                <span className="msg-count rounded-circle">02</span>
              </div>
            </li>
            <li>
              <Link
                href="/dashboard/wishlist"
                className={`d-flex align-items-center ${
                  activeRouterPath("/dashboard/wishlist") ? "active" : ""
                }`}
              >
                <i className="isax isax-heart5" /> Wishlist
              </Link>
            </li>
            <li>
              <span className="fs-14 text-gray-3 fw-medium mb-2">Finance</span>
            </li>
            <li>
              <Link
                href="/dashboard/wallet"
                className={`d-flex align-items-center ${
                  activeRouterPath("/dashboard/wallet") ? "active" : ""
                }`}
              >
                <i className="isax isax-wallet-add-15" /> Wallet
              </Link>
            </li>
            <li className="mb-2">
              <Link
                href="/dashboard/payment"
                className={`d-flex align-items-center ${
                  activeRouterPath("/dashboard/payment") ? "active" : ""
                }`}
              >
                <i className="isax isax-money-recive5" /> Payment
              </Link>
            </li>
            <li>
              <span className="fs-14 text-gray-3 fw-medium mb-2">Account</span>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className={`d-flex align-items-center ${
                  activeRouterPath("/dashboard/profile") ? "active" : ""
                }`}
              >
                <i className="isax isax-profile-tick5" /> My Profile
              </Link>
            </li>
            <li>
              <div className="message-content">
                <Link
                  href="/dashboard/notifications"
                  className={`d-flex align-items-center ${
                    activeRouterPath("/dashboard/notifications") ? "active" : ""
                  }`}
                >
                  <i className="isax isax-notification-bing5" /> Notifications
                </Link>
                <span className="msg-count bg-purple rounded-circle">05</span>
              </div>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className={`d-flex align-items-center ${
                  activeRouterPath("/dashboard/settings") ? "active" : ""
                }`}
              >
                <i className="isax isax-setting-25" /> Settings
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="d-flex align-items-center pb-0 border-0 bg-transparent w-100 text-start"
                style={{ padding: '10px 0' }}
              >
                <i className="isax isax-logout-15" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
