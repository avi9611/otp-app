import React, { useState, useRef, useEffect } from 'react';

type OtpInputProps = {
  length: number;
  onComplete: (otp: string) => void;
};

const OtpInput: React.FC<OtpInputProps> = ({ length, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    
    // Take only the last character if multiple characters are pasted
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    
    // If input is filled, move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };
  
  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only proceed if pasted data contains only digits
    if (!/^\d+$/.test(pastedData)) return;
    
    const pastedOtp = pastedData.substring(0, length).split('');
    const newOtp = [...otp];
    
    // Fill inputs with pasted data
    pastedOtp.forEach((digit, index) => {
      if (index < length) {
        newOtp[index] = digit;
      }
    });
    
    setOtp(newOtp);
    
    // Focus on the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[length - 1]?.focus();
    }
    
    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };
  
  return (
    <div className="flex justify-center space-x-3 fade-in">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="otp-input"
          aria-label={`Digit ${index + 1}`}
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
};

export default OtpInput;