import * as React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Fade, Paper } from '@mui/material';
import Title from '../Title';
import Grid from '@mui/material/Grid'; // Import Grid component from MUI

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

export default function Served() {
  const [servedData, setServedData] = useState<{ windowId: string, totalCount: number }[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_OTHER_BACKEND_SERVER}/window/get`
        );

        const windowIds = response.data.map((window: { window_id: string }) => window.window_id);

        const dataPromises = windowIds.map((windowId: string) =>
          axios.get(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/transaction_log/admin/${windowId}`)
        );

        const responses = await Promise.all(dataPromises);

        const data = responses.map((res, index) => ({
          windowId: res.data.window_id || windowIds[index],
          totalCount: res.data.total_count,
        }));

        setServedData(data);
        setIsVisible(true);
      } catch (err) {
        console.error("Error fetching served data", err);
      }
    };

    fetchData();
  }, []);

  let cashierCount = 1;

  return (
    <Box sx={{ padding: 2 }}>
      {/* Grid Container for 7 Columns */}
      <Grid container spacing={2} justifyContent="flex-start">
        {servedData.length > 0 &&
          servedData.slice(0, 21).map((item, index) => {
            // Determine if it's a Cashier (windowId > 13)
            const isCashier = parseInt(item.windowId) > 13;
            let title = `Window ${item.windowId}`;
            
            if (isCashier) {
              title = `Cashier ${cashierCount}`;
              cashierCount++;  // Increment the cashier counter for each Cashier
            }

            return (
              <Grid item xs={12} sm={6} md={4} lg={1.71} key={index}> 
                <Paper
                  elevation={24}
                  sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '230px',
                    borderRadius: 2,
                  }}
                >
                  <Card sx={{ minWidth: 175, p: 1, backgroundColor: '#e8f5e9', boxShadow: 3 }}>
                    <CardContent>
                      <Title>{title}</Title>  {/* Display dynamic title */}
                      <Fade in={isVisible} timeout={1000}>
                        <Typography component="h1" variant="h2" align="right" color="primary">
                          {item.totalCount || 0}
                        </Typography>
                      </Fade>
                      <Box sx={{ marginTop: 3, textAlign: 'right' }}>
                        <Typography variant="body2" color="text.secondary">
                          {getDate()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </Box>
  );
}
