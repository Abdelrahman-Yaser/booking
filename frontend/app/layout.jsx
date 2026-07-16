"use client";

import Aos from "aos";
import { useEffect } from "react";
import SrollTop from "../components/common/ScrollTop";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "../styles/index.scss";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { AuthProvider } from "../contexts/AuthContext";
import LoginModal from "../components/common/LoginModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SelectedCarProvider } from "@/contexts/SelectedCarContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
    
    // Load Bootstrap JS
    if (typeof window !== "undefined" && !window.bootstrap) {
      require("bootstrap");
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Flymefy - Your Ultimate Travel Companion</title>
        <meta name="description" content="Discover amazing destinations, book flights, hotels, cars, tours and cruises with Flymefy - your complete travel solution." />
        <meta name="keywords" content="travel, flights, hotels, cars, tours, cruises, booking, vacation, travel agency" />
        <meta name="author" content="Flymefy" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Flymefy - Your Ultimate Travel Companion" />
        <meta property="og:description" content="Discover amazing destinations, book flights, hotels, cars, tours and cruises with Flymefy." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flymefy - Your Ultimate Travel Companion" />
        <meta name="twitter:description" content="Discover amazing destinations, book flights, hotels, cars, tours and cruises with Flymefy." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/purple-theme.css" />
        <link rel="stylesheet" href="/css/chat.css" />
        <link rel="icon" href="./favicon.ico" />
        <meta name="theme-color" content="#530aa6" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
        <style jsx global>{`
          :root {
            --color-blue-1: #530aa6 !important;
            --color-blue-2: #f3f0ff !important;
            --swiper-theme-color: #530aa6 !important;
            --font-inter: ${inter.style.fontFamily};
          }
          
          /* Force button text to be white - highest priority */
          .btn-primary, .button.-dark-1, .mainSearch__submit, .search-btn {
            color: #ffffff !important;
          }
          
          .btn-primary *, .button.-dark-1 *, .mainSearch__submit *, .search-btn * {
            color: #ffffff !important;
          }
          
          /* Final, Modern, Themed Login Modal Styles */
          #loginModal .modal-content {
            border-radius: 12px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1) !important;
            border: 1px solid #e5e7eb !important;
            overflow: hidden;
          }
          #loginModal .modal-header {
            border-bottom: 1px solid #e5e7eb !important;
            padding: 1rem 1.5rem !important;
          }
          #loginModal .modal-body {
            padding: 1rem 2.5rem 2rem !important;
          }
          #loginModal .modal-title {
            font-weight: 600 !important;
            font-size: 22px !important;
            color: #111827 !important;
          }
          #loginModal .btn-primary {
            width: 100% !important;
            background-color: var(--color-blue-1) !important;
            border-color: var(--color-blue-1) !important;
            color: white !important;
            height: 48px !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            border-radius: 8px !important;
            transition: background-color 0.3s ease !important;
          }
          #loginModal .btn-primary:hover {
            background-color: #420885 !important;
          }
          #loginModal .form-control-material {
            width: 100% !important;
            height: 52px !important;
            border: 1px solid #d1d5db !important;
            border-radius: 8px !important;
            padding: 0 1rem !important;
            font-size: 15px !important;
            background-color: #f9fafb !important;
            color: #111827 !important;
          }
          #loginModal .form-control-material::placeholder {
            color: #9ca3af;
          }
          #loginModal .form-control-material:focus {
            outline: none !important;
            border-color: var(--color-blue-1) !important;
            box-shadow: 0 0 0 3px rgba(83, 10, 166, 0.15) !important;
            background-color: white !important;
          }
          
          /* Modern Social Icon Styling with Border */
          .social-login-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 22px;
            border: 1px solid #d1d5db;
            background-color: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .social-login-btn:hover {
            border-color: var(--color-blue-1);
            transform: translateY(-2px);
          }
          .social-facebook { color: #1877F2; }
          .social-google { color: #DB4437; }
          .social-twitter { color: #1DA1F2; }
        `}</style>
      </head>
      <body className={inter.className}>
        <SelectedCarProvider>
          <Provider store={store}>
            <AuthProvider>
              {children}
              <SrollTop />
              <LoginModal />
            </AuthProvider>
          </Provider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SelectedCarProvider>
      </body>
    </html>
  );
}
