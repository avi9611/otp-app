import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import OtpInput from "../components/OtpInput";
import Timer from "../components/Timer";
import { Shield, ArrowLeft } from "lucide-react";

const EnterOtp: React.FC = () => {
  const navigate = useNavigate();
  const { user, verifyOtp, isOtpValid, getRemainingTime, resetOtp } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());

  useEffect(() => {
    // Small delay for context restore from localStorage
    const timeout = setTimeout(() => {
      if (!user || !isOtpValid()) {
        navigate("/login");
      } else {
        setRemainingTime(getRemainingTime());
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [user, isOtpValid, getRemainingTime, navigate]);

  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      const timeLeft = getRemainingTime();
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        navigate("/resend-otp");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, getRemainingTime, navigate]);

  const handleOtpComplete = async (otp: string) => {
    setError("");
    setVerifying(true);

    const isValid = await verifyOtp(otp);
    setVerifying(false);

    if (isValid) {
      navigate("/dashboard");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleExpire = () => {
    resetOtp();
    navigate("/resend-otp");
  };

  const handleBack = () => {
    resetOtp();
    navigate("/login");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-green-300 to-blue-500 p-4">
      <div className="card max-w-md w-full slide-up">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Enter OTP</h2>
          <p className="text-gray-500 mt-2 text-center">
            We've sent a 6-digit code to{" "}
            <span className="font-medium">{user?.email}</span>
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <Timer seconds={remainingTime} onExpire={handleExpire} />
        </div>

        <div className="space-y-6">
          <OtpInput length={6} onComplete={handleOtpComplete} />

          {error && (
            <p className="text-sm text-error-500 text-center mt-4">{error}</p>
          )}

          {verifying && (
            <div className="flex justify-center mt-4">
              <div className="animate-pulse text-primary-500">Verifying...</div>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/resend-otp")}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium underline underline-offset-2 transition"
            >
              Didn’t receive the code?{" "}
              <span className="font-semibold">Resend</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterOtp;
