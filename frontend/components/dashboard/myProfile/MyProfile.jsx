'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MyProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // Set default user data
      setUser({
        name: "Guest User",
        email: "guest@flymefy.com",
        phone: "+1 234 567 8900",
        address: "123 Main Street",
        country: "United States",
        state: "California",
        city: "Los Angeles",
        postal_code: "90210",
        updated_at: new Date().toISOString()
      });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const userName = user?.name || "N/A";
  const userEmail = user?.email || "N/A";
  const updatedAt = user?.updated_at
    ? new Date(user.updated_at).toLocaleString()
    : "N/A";

  return (
    <div className="card shadow-none mb-0">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h6>My Profile</h6>
        <div className="d-flex align-items-center justify-content-center">
          <Link
            href="/dashboard/settings"
            className="p-1 rounded-circle btn btn-light d-flex align-items-center justify-content-center"
          >
            <i className="isax isax-edit-2 fs-14" />
          </Link>
        </div>
      </div>
      <div className="card-body">
        <h6 className="fs-16 mb-3">Basic Information</h6>
        <div className="d-flex align-items-center mb-3">
          <span className="avatar avatar-xl flex-shrink-0 me-3">
            <Image
              src="/img/users/user-01.jpg"
              alt="Profile"
              width={80}
              height={80}
              className="img-fluid rounded"
            />
          </span>
          <div className="profile-upload">
            <div className="mb-2">
              <p className="fs-12">
                Recommended image size is 40px x 40px
              </p>
            </div>
            <div className="profile-uploader d-flex align-items-center">
              <div className="drag-upload-btn btn btn-sm btn-primary me-2">
                Upload
                <input
                  type="file"
                  className="form-control image-sign"
                  multiple
                />
              </div>
              <Link href="#" className="btn btn-light btn-sm">
                Cancel
              </Link>
            </div>
          </div>
        </div>
        <div className="row border-bottom pb-2 mb-3">
          <div className="col-md-6">
            <div className="mb-2">
              <h6 className="fs-14">Name</h6>
              <p>{userName}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              <h6 className="fs-14">Email</h6>
              <p>{userEmail}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              <h6 className="fs-14">Last Updated</h6>
              <p>{updatedAt}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-2">
              <h6 className="fs-14">Phone</h6>
              <p>{user?.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
        <h6 className="fs-16 mb-3">Address Information</h6>
        <div className="row g-2">
          <div className="col-md-12">
            <div>
              <h6 className="fs-14">Address</h6>
              <p>{user?.address || "Not provided"}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <h6 className="fs-14">Country</h6>
              <p>{user?.country || "Not provided"}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <h6 className="fs-14">State</h6>
              <p>{user?.state || "Not provided"}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <h6 className="fs-14">City</h6>
              <p>{user?.city || "Not provided"}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <h6 className="fs-14">Postal Code</h6>
              <p>{user?.postal_code || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile; 