import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  
  // Custom date formatting: "Day, Month Date, Year"
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('en-US', {
    weekday: 'long', // "Monday"
    year: 'numeric', // "2023"
    month: 'long',   // "September"
    day: 'numeric'   // "25"
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());

      // Update date in the same custom format
      setDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Typography component="h1" variant="h3" align="center" marginTop={0} marginBottom={0} fontFamily={"serif"} color={'black'}>
        {date}
      </Typography>
      <Typography component="h1" variant="h1" align="center" marginTop={0} marginBottom={0} fontFamily={"serif"} color={'black'}>
        {time}
      </Typography>
    </div>
  );
};

export default DigitalClock;