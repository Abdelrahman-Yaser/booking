"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar.jsx";
import Header3 from "@/components/header/header-3";
import Footer3 from "@/components/footer/footer-3";

export default function DashboardLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in using the correct keys from AuthContext
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsLoggedIn(true);
    } else {
      // Redirect to homepage if not logged in
      router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }
  return (
    <>
      {/* Header */}
      <Header3 />
      
      <div className="main-wrapper" style={{paddingTop: '120px', paddingBottom: '20px'}}>
        {/* Include CSS files */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/iconsax.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="/css/dashboard-wide.css" />
        
        {/* Custom styles for wider dashboard */}
        <style jsx>{`
          .dashboard-content {
            max-width: 100% !important;
            width: 100% !important;
            padding-left: 0 !important;
          }
          .dashboard-content > * {
            margin-left: 0 !important;
          }
          .container-fluid {
            max-width: 100% !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          .row {
            margin: 0 !important;
          }
          .col-xl-10, .col-lg-9 {
            padding-left: 5px;
            padding-right: 1rem;
          }
          .col-xl-2, .col-lg-3 {
            padding-left: 0.5rem;
            padding-right: 2px;
            flex: 0 0 auto;
            width: 380px;
          }
          @media (min-width: 1400px) {
            .container-fluid {
              padding-left: 3rem !important;
              padding-right: 3rem !important;
            }
            .col-xl-2, .col-lg-3 {
              width: 420px;
            }
          }
          @media (min-width: 1600px) {
            .col-xl-2, .col-lg-3 {
              width: 460px;
            }
          }
        `}</style>
        
        <div className="content content-two">
          <div className="container-fluid px-4">
            <div className="row">
              {/* Sidebar */}
              <div className="col-xl-2 col-lg-3">
                <Sidebar />
              </div>
              {/* /Sidebar */}
              <div className="col-xl-10 col-lg-9">
                <div className="dashboard-content" style={{padding: '20px'}}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Include Bootstrap JS */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
      </div>
      
      {/* Footer */}
      <Footer3 />
    </>
  );
} 

