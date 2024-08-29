import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { useEffect, useState } from 'react';
import axios from 'axios';

function getDate(){
  const monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const today = new Date();

  const month = today.getMonth();
  const monthName = monthNames[month];
  const year = today.getFullYear();
  const date = today.getDate();

  return monthName + '/' + date + '/' +year;
}

export default function Served() {
  const [numberOfServed, setNumberOfServed] = useState(1);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/today/done`)
      .then(response => {
        setNumberOfServed(response.data.length);
      })
      .catch(err => {
      });
    }
    fetchData();
  }, []);



  return (
    <React.Fragment>
      <Title>Served Today</Title>
      <Typography component="p" variant="h1" align='right'>
        {numberOfServed}
      </Typography>
      <div>
        <Typography color="text.secondary" marginTop={6} sx={{ flex: 1 }}>
          {getDate()}
        </Typography>
      </div>
    </React.Fragment>
  );
}