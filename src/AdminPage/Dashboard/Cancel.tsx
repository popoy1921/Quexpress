import * as React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Fade } from '@mui/material';
import Title from '../Title';

function getDate() {
  const monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const today = new Date();
  const monthName = monthNames[today.getMonth()];
  const year = today.getFullYear();
  const date = today.getDate();
  
  return `${monthName} ${date}, ${year}`;
}

export default function Cancelled() {
  const [numberOfCancelled, setNumberOfCancelled] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_OTHER_BACKEND_SERVER}/transaction_log/admin/cancelled`
        );
        setNumberOfCancelled(response.data.length);
        setIsVisible(true); // Show animation when data is fetched
      } catch (err) {
        console.error("Error fetching cancelled transactions", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Card sx={{ minWidth: 275, p: 2, backgroundColor: '#f5f5f5', boxShadow: 3 }}>
      <CardContent>
        <Title>Cancelled Today</Title>
        <Fade in={isVisible} timeout={1000}>
          <Typography component="h1" variant="h1" align="right" color="error">
            {numberOfCancelled}
          </Typography>
        </Fade>
        <Box sx={{ marginTop: 3, textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary">
            {getDate()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
