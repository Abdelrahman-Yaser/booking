'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import MainMenu from "../MainMenu";
import LanguageCurrencyMegaMenu from "../LanguageCurrencyMegaMenu";
import HeaderSearch from "../HeaderSearch";
import MobileMenu from "../MobileMenu";
import { useAuth } from "../../../contexts/AuthContext";
import UserProfile from "../../common/UserProfile";

const Header3 = () => {
  const [navbar, setNavbar] = useState(false);
  const { isAuthenticated, user, openLoginModal } = useAuth();

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header className={`header bg-white ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link href="/" className="header-logo mr-20">
                  <img src="/img/general/logo-dark.png" alt="Flymefy logo" />
                </Link>
                {/* End logo */}

                <HeaderSearch />
                {/* End logo */}

                <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-dark-1" />
                  </div>
                </div>
                {/* End header-menu */}
              </div>
              {/* End d-flex */}
            </div>
            {/* End col */}

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center xxl:d-none">
                  <LanguageCurrencyMegaMenu textClass="text-dark-1" />
                  {/* End Language & Currency Megamenu */}

                  <div className="col-auto">
                    {isAuthenticated && user ? (
                      <UserProfile user={user} />
                    ) : (
                      <button
                        className="button px-20 py-10 text-14 fw-500 rounded-8 d-flex items-center text-dark-1"
                        onClick={() => {
                          console.log('Login button clicked');
                          openLoginModal();
                        }}
                        style={{
                          transition: 'all 0.3s ease',
                          border: '1px solid #e5e7eb',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          height: '42px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#faf5ff';
                          e.target.style.borderColor = '#8b5cf6';
                          e.target.style.color = '#8b5cf6';
                          e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.15)';
                          const svg = e.target.querySelector('svg');
                          if (svg) svg.style.color = '#8b5cf6';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.color = '';
                          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                          const svg = e.target.querySelector('svg');
                          if (svg) svg.style.color = '';
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-8 text-dark-1" style={{transition: 'color 0.3s ease'}}>
                          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                          <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
                        </svg>
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
                {/* End language and currency selector */}

                {/* Start mobile menu icon */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-dark-1">
                  <div>
                    <Link
                      href="/login"
                      className="d-flex items-center icon-user text-inherit text-22"
                    />
                  </div>
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />

                    <div
                      className="offcanvas offcanvas-start  mobile_menu_contnet"
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu />
                      {/* End MobileMenu */}
                    </div>
                  </div>
                </div>
                {/* End mobile menu icon */}
              </div>
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
      {/* End Header */}

    </>
  );
};

export default Header3;
