import React, { useState, useEffect } from 'react';

type TimerProps = {
  seconds: number;
  onExpire: () => void;
};

const Timer: React.FC<TimerProps> = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    // Reset timer when seconds prop changes
    setTimeLeft(seconds);
  }, [seconds]);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }
    
    // Set up interval to decrement time
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    
    // Clear interval on unmount
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);
  
  // Format time as mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex items-center text-sm font-medium">
      <div className={`mr-2 w-2 h-2 rounded-full ${timeLeft < 10 ? 'bg-error-500 animate-pulse' : 'bg-primary-500'}`}></div>
      <span className={timeLeft < 10 ? 'text-error-500' : 'text-gray-600'}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default Timer;