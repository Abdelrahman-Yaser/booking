"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';

const LoginModal = () => {
  const { login, showLoginModal, closeLoginModal } = useAuth();
  const [step, setStep] = useState("email"); // 'email', 'password'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle modal show/hide based on AuthContext state
  useEffect(() => {
    console.log('LoginModal useEffect: showLoginModal =', showLoginModal);
    
    const handleModal = () => {
      console.log('handleModal called');
      console.log('window.bootstrap available:', !!window.bootstrap);
      
      if (typeof window !== 'undefined' && window.bootstrap) {
        const modalElement = document.getElementById('loginModal');
        console.log('modalElement found:', !!modalElement);
        
        if (!modalElement) {
          console.log('Modal element not found!');
          return;
        }
        
        if (showLoginModal) {
          console.log('Opening modal');
          try {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
            console.log('Modal show() called successfully');
          } catch (error) {
            console.error('Error opening modal:', error);
          }
        } else {
          console.log('Closing modal');
          const modal = window.bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
      } else {
        console.log('Bootstrap not available');
      }
    };

    // Add a small delay to ensure Bootstrap is loaded
    const timeoutId = setTimeout(handleModal, 100);
    
    return () => clearTimeout(timeoutId);
  }, [showLoginModal]);

  // Handle modal close
  const handleModalClose = () => {
    setStep('email');
    setEmail('');
    setPassword('');
    closeLoginModal();
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Correctly call the login function from context
    const mockUser = { name: email.split('@')[0], email: email };
    login(mockUser); 
    
    toast.success(`Welcome, ${mockUser.name}!`);
  };

  const handleLogin = async (e) => {
    // This function can be used for future backend integration
    e.preventDefault();
  };
  
  const handleSocialLogin = (provider) => {
    // Correctly call the login function from context
    const mockUser = { name: `${provider} User`, email: `${provider.toLowerCase()}@example.com` };
    login(mockUser);

    toast.success(`Welcome, ${mockUser.name}!`);
  }

  const renderEmailStep = () => (
    <form onSubmit={handleContinue} className="mt-4">
      <div className="form-input-material">
        <input
          type="email"
          name="email"
          placeholder="Please enter an email address"
          className="form-control-material"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary btn-block mt-4">
        Continue
      </button>
    </form>
  );

  const renderPasswordStep = () => (
    // This step is no longer reachable but kept for future use
    <form onSubmit={handleLogin} className="mt-3">
        <div className="text-center mb-3">
            <p className="mb-0">Signing in with: <strong>{email}</strong></p>
        </div>
      <div className="form-input-material">
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="form-control-material"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
      </div>
       <div className="d-flex justify-content-end mt-2">
         <a href="#" className="text-sm" onClick={(e) => {e.preventDefault(); toast.info("Forgot password functionality is not implemented yet.")}}>Forgot Password?</a>
       </div>
      <button type="submit" className="btn btn-primary btn-block mt-3 mb-2">
        Sign In
      </button>
      <div className="text-center">
          <a href="#" className="text-sm" onClick={(e) => {e.preventDefault(); setStep('email'); setEmail(''); setPassword('');}}>Use a different email</a>
      </div>
    </form>
  );

  return (
    <div
      className="modal fade"
      id="loginModal"
      tabIndex="-1"
      aria-labelledby="loginModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '460px' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title w-100 text-center" id="loginModalLabel">
              Sign In / Register
            </h5>
            <button
              type="button"
              id="login-modal-close-btn"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleModalClose}
            ></button>
          </div>
          <div className="modal-body">
            <p className="text-center text-secondary mb-3">
              Manage your bookings with ease and enjoy member-only benefits
            </p>
            
            {step === "email" ? renderEmailStep() : renderPasswordStep()}
            
            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1"/>
              <span className="mx-3 text-secondary" style={{ fontSize: '13px' }}>More Sign In Methods</span>
              <hr className="flex-grow-1"/>
            </div>

            <div className="d-flex justify-content-center">
                <button className="social-login-btn social-facebook" onClick={() => handleSocialLogin('Facebook')}>
                    <FaFacebook />
                </button>
                <button className="social-login-btn social-google mx-4" onClick={() => handleSocialLogin('Google')}>
                    <FaGoogle />
                </button>
                <button className="social-login-btn social-twitter" onClick={() => handleSocialLogin('X')}>
                    <FaTwitter />
                </button>
            </div>
            
            <p className="text-center text-secondary mt-4" style={{ fontSize: '12px' }}>
              By signing in or registering, you are deemed to have agreed to the Flymefy <a href="#">Terms and Conditions</a> and <a href="#">Privacy Statement</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;