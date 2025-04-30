import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Mail } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyEmail, generateOtp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsVerifying(true);

    try {
      const isVerified = await verifyEmail(email);
      if (isVerified) {
        await generateOtp(email);
        navigate("/enter-otp");
      } else {
        setError("Invalid email address. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-green-300 to-blue-500 p-4">
      <div className="card max-w-md w-full animate-slide-up shadow-xl border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4 shadow-md pulse">
            <Shield className="w-10 h-10 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Secure Login</h1>
          <p className="text-gray-500 mt-2 text-center text-sm">
            Enter your email to receive a one-time password (OTP)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="input-field pl-10 bg-gray-50 hover:bg-white"
                placeholder="you@example.com"
                disabled={isVerifying}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="btn w-full bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 shadow-md text-white"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
