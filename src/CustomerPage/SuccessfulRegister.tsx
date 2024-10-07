import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import React from 'react';

const Logo = require('../Photos/coollogo_com-178391066.png');
const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" fontFamily={"serif"} {...props}>
      {'Copyright © '}
        QuExpress
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',

          '@media (max-width:600px)': {
            backgroundImage: `url(${BackgroundMobile})`,
          },
          
          '@media (min-width:601px) and (max-width:1024px)': {
            backgroundImage: `url(${BackgroundTablet})`,
          },
          
          '@media (min-width:1025px)': {
            backgroundImage: `url(${BackgroundDesktop})`,
          },
          
          '@media (orientation: portrait)': {
            backgroundSize: 'contain',
          },
          
          '@media (orientation: landscape)': {
            backgroundSize: 'cover',
          },
        }
      }
    }
  },
  palette: {
    primary: {main: '#228B22'},
  }
});

export default function SignUpCustomer() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [refreshCount, setRefreshCount] = useState(0); // Track the refresh count

  const navigate = useNavigate();
  const accountId = useParams().AccountId;

  async function displayDetails() {
    if (!accountId) {
      console.error('Account ID not found');
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get<{ 
        customer_first_name: string; 
        customer_last_name: string; 
        customer_number: string; 
      }>(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/customer/get/${accountId}`);
      const customer = response.data;

      setFirstName(customer.customer_first_name);
      setLastName(customer.customer_last_name);
      setMobileNumber(customer.customer_number);
    } catch (error) {
      setErrorMessage('Server Error');
      alert('Error: ' + error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  }  
  
  React.useEffect(() => {
    if (refreshCount < 1) {
      displayDetails(); // Fetch customer details
      setTimeout(() => setRefreshCount(prev => prev + 1), 1000); // Simulate a "refresh" after 1 second delay
    }
  }, [refreshCount]);

  const proceedSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.removeItem('CustomerFirstName');
    localStorage.removeItem('CustomerLastName');
    localStorage.removeItem('CustomerMobileNumber');
    localStorage.removeItem('CustomerAccountId');
    navigate('/');
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper 
          elevation={24}
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 4,
            opacity: 0.95,
          }}
        >
          <img src={Logo} width={500} alt="" />
          <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'}>
            {loading ? (
              <center>Loading...</center>
            ) : (
              <>
                <center>You have successfully registered!</center>
                <center>(Please save information below)</center>
              </>
            )}
          </Typography>
          {!loading && (
            <Box component="form" onSubmit={proceedSignUp} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} id='CustomerAccountId' style={{fontSize: 20}}>
                  Account ID: {accountId}
                </Grid>
                <Grid item xs={12} sm={6} id='CustomerName' style={{fontSize: 20}}>
                  Customer Name: {firstName} {lastName}
                </Grid>
                <Grid item xs={12} id='CustomerMobileNumber' style={{fontSize: 20}}>
                  Customer Mobile Number: {mobileNumber}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  style={{minWidth:'auto', minHeight:'auto', fontSize: '20px', fontFamily:'serif'}}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Finish
                </Button>
              </Grid>
            </Box>
          )}
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}
