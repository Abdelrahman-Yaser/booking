'use client'

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const UserProfile = ({ user }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debug effect to track state changes
  useEffect(() => {
    console.log('UserProfile state changed:', { isOpen });
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    // Redirect to homepage after logout
    router.push('/');
  };

  const getMembershipLevel = () => {
    // هنا يمكن إضافة منطق تحديد مستوى العضوية لاحقاً
    const levels = ['Bronze', 'Silver', 'Gold', 'Diamond'];
    return levels[Math.floor(Math.random() * levels.length)];
  };

  const getMembershipColor = (level) => {
    const colors = {
      'Bronze': '#cd7f32',
      'Silver': '#c0c0c0', 
      'Gold': '#ffd700',
      'Diamond': '#b9f2ff'
    };
    return colors[level] || '#cd7f32';
  };

  const membershipLevel = getMembershipLevel();

  console.log('UserProfile rendering with:', { user, isOpen, membershipLevel });

  const handleButtonClick = () => {
    console.log('Profile button clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className="position-relative d-inline-block" ref={dropdownRef}>
      <button
        className="btn p-0 border-0 bg-white rounded-circle"
        onClick={handleButtonClick}
        style={{
          width: '40px',
          height: '40px',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
          alt="Profile" 
          className="rounded-circle"
          style={{
            width: '36px',
            height: '36px',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSIjOGI1Y2Y2Ii8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDE2QzE2IDE3LjU4MTcgMTIuNDE4MyAxNCAxMiAxNFoiIGZpbGw9IiM4YjVjZjYiLz4KPC9zdmc+';
          }}
        />
      </button>

      <div 
        className={`position-absolute bg-white rounded-3 ${isOpen ? 'd-block' : 'd-none'}`}
        style={{
          top: '100%',
          right: '0',
          marginTop: '8px',
          width: '260px',
          zIndex: 9999,
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Welcome Section */}
        <div 
          className="text-center text-white"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
            padding: '18px 16px'
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Welcome back!
          </div>
          <div 
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2583/2583788.png"
              alt="Bronze"
              style={{
                width: '14px',
                height: '14px'
              }}
            />
            Bronze Member
          </div>
        </div>

        {/* Menu Section */}
        <div style={{ padding: '8px 0' }}>
          <Link 
            href="/dashboard" 
            className="d-flex align-items-center gap-3 text-decoration-none text-dark"
            style={{ 
              padding: '10px 16px',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.color = '#8b5cf6';
              const icon = e.target.querySelector('i');
              if (icon) icon.style.color = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#374151';
              const icon = e.target.querySelector('i');
              if (icon) icon.style.color = '#64748b';
            }}
          >
            <i className="icon-home" style={{ fontSize: '18px', width: '20px', textAlign: 'center', color: '#64748b' }}></i>
            Dashboard
          </Link>

          <Link 
            href="/dashboard/settings" 
            className="d-flex align-items-center gap-3 text-decoration-none text-dark"
            style={{ 
              padding: '10px 16px',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.color = '#8b5cf6';
              const icon = e.target.querySelector('i');
              if (icon) icon.style.color = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#374151';
              const icon = e.target.querySelector('i');
              if (icon) icon.style.color = '#64748b';
            }}
          >
            <i className="icon-user" style={{ fontSize: '18px', width: '20px', textAlign: 'center', color: '#64748b' }}></i>
            Manage My Account
          </Link>

          <Link 
            href="/dashboard/wishlist" 
            className="d-flex align-items-center gap-3 text-decoration-none text-dark"
            style={{ 
              padding: '10px 16px',
              transition: 'all 0.3s ease',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.color = '#8b5cf6';
              const icon = e.target.querySelector('i');
              if (icon) icon.style.color = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#374151';
              const icon = e.target.querySelector('i');
              if (icon) icon.style.color = '#64748b';
            }}
          >
            <i className="icon-heart" style={{ fontSize: '18px', width: '20px', textAlign: 'center', color: '#64748b' }}></i>
            Wishlist
          </Link>

          <div style={{ height: '1px', background: '#f1f5f9', margin: '8px 0' }}></div>

          <button 
            onClick={handleLogout}
            className="d-flex align-items-center gap-3 border-0 bg-transparent w-100 text-start"
            style={{ 
              padding: '10px 16px',
              transition: 'all 0.3s ease',
              color: '#dc2626',
              fontSize: '14px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fef2f2';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <i className="icon-arrow-top-right" style={{ fontSize: '18px', width: '20px', textAlign: 'center', color: '#dc2626' }}></i>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 