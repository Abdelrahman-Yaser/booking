"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MainMenu from "../MainMenu";
import MobileMenu from "../MobileMenu";
import Image from "next/image";

const Header = () => {
  const [navbar, setNavbar] = useState(false);

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
      <header className={`header ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container">
          <div className="header__left">
            <Link href="/" className="header__logo">
              <Image
                width={140}
                height={40}
                src="/img/general/logo-dark.svg"
                alt="logo"
              />
            </Link>
          </div>

          <div className="header__center">
            <MainMenu />
          </div>

          <div className="header__right">
            <div className="header__buttons">
              <Link href="/login" className="button -sm -outline-purple-1 text-purple-1">
                Sign In
              </Link>
              <Link href="/signup" className="button -sm -purple-1 text-white ml-10">
                Sign Up
              </Link>
            </div>

            <div className="header__mobile-menu">
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.4s ease;
          background: white;
        }

        .header.is-sticky {
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          padding: 0.75rem 0;
        }

        .header__container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header__left {
          flex-shrink: 0;
        }

        .header__center {
          flex: 1;
          margin: 0 2rem;
        }

        .header__right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header__buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header__mobile-menu {
          display: none;
        }

        @media (max-width: 1024px) {
          .header__center {
            display: none;
          }

          .header__buttons {
            display: none;
          }

          .header__mobile-menu {
            display: block;
          }
        }

        :global(.button.-purple-1) {
          background-color: #4f46e5;
          border-color: #4f46e5;
        }

        :global(.button.-outline-purple-1) {
          border-color: #4f46e5;
          color: #4f46e5;
        }

        :global(.text-purple-1) {
          color: #4f46e5;
        }

        :global(.text-white) {
          color: white;
        }

        :global(.ml-10) {
          margin-left: 10px;
        }
      `}</style>
    </>
  );
};

export default Header; 