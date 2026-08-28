import React, { useState, useEffect } from 'react';

export const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const target = new Date();
    target.setHours(23, 59, 59, 999);
    return Math.max(0, target.getTime() - new Date().getTime());
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date();
      target.setHours(23, 59, 59, 999);
      const newTimeLeft = Math.max(0, target.getTime() - new Date().getTime());
      setTimeLeft(newTimeLeft);
      if (newTimeLeft === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="inline-flex space-x-1 font-mono font-bold tracking-widest text-[#FF9F61]">
      <span>{hours.toString().padStart(2, '0')}</span>
      <span className="animate-pulse">:</span>
      <span>{minutes.toString().padStart(2, '0')}</span>
      <span className="animate-pulse">:</span>
      <span>{seconds.toString().padStart(2, '0')}</span>
    </span>
  );
};
