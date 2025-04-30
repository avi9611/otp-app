import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const ResendOtp: React.FC = () => {
  const navigate = useNavigate();
  const { user, generateOtp, resetOtp } = useAuth();
  
  const handleResend = () => {
    if (user) {
      // Generate a new OTP and navigate to OTP verification page
      generateOtp(user.email);
      navigate('/enter-otp');
    } else {
      // If no user, navigate to login
      navigate('/login');
    }
  };
  
  const handleBack = () => {
    resetOtp();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full slide-up">
        <button 
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-error-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">OTP Expired</h2>
          <p className="text-gray-500 mt-2 text-center">
            The verification code has expired or is invalid
          </p>
        </div>
        
        <div className="space-y-6">
          <button 
            onClick={handleResend}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Resend OTP
          </button>
          
          <button 
            onClick={handleBack}
            className="btn w-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendOtp;