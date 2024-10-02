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
import { Refresh } from '@mui/icons-material';

const Logo = require('../Photos/coollogo_com-178391066.png');
const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

const firstName = localStorage.getItem('CustomerFirstName');
const lastName = localStorage.getItem('CustomerLastName');
const email = localStorage.getItem('CustomerEmail');
const accountId = localStorage.getItem('CustomerAccountId');

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

// TODO remove, this demo shouldn't need to reset the theme.
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
          
          // Tablet styles
          '@media (min-width:601px) and (max-width:1024px)': {
            backgroundImage: `url(${BackgroundTablet})`,
          },
          
          // Desktop styles
          '@media (min-width:1025px)': {
            backgroundImage: `url(${BackgroundDesktop})`,
          },
          
          // Orientation styles
          '@media (orientation: portrait)': {
            // Adjustments for portrait orientation
            backgroundSize: 'contain',
          },
          
          '@media (orientation: landscape)': {
            // Adjustments for landscape orientation
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
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 601px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  var accountId = useParams().AccountId;
  
  async function displayDetails() {
    if (!accountId) {
      console.error('Account ID not found');
      return;
    }
    
    const CustomerAccountIdContainer = document.getElementById('CustomerAccountId') as HTMLElement | null;
    console.log(CustomerAccountIdContainer);
    if (CustomerAccountIdContainer) {
      CustomerAccountIdContainer.innerText = 'Account ID: ' + accountId;
    }
    const CustomerNameContainer = document.getElementById('CustomerName') as HTMLElement | null;
    console.log(CustomerNameContainer);
    if (CustomerNameContainer) {
      CustomerNameContainer.innerText = 'Customer Name: ' + firstName + ' ' + lastName;
    }
    const CustomerEmailContainer = document.getElementById('CustomerEmail') as HTMLElement | null;
    console.log(CustomerEmailContainer);
    if (CustomerEmailContainer) {
      CustomerEmailContainer.innerText = 'Email: ' + email;
    }
  }
  
  //   try {
  //     const response = await axios.get<{ 
  //       customer_first_name: string; 
  //       customer_last_name: string; 
  //       customer_email: string; 
  //     }>(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/customer/get/${accountId}`);
  
  //     const customer = response.data;
  
  //     // Safely get and update DOM elements
  //     const CustomerAccountIdContainer = document.getElementById('CustomerAccountId') as HTMLElement | null;
  //     if (CustomerAccountIdContainer) {
  //       CustomerAccountIdContainer.innerText = 'Account ID: ' + accountId;
  //     }
  
  //     const CustomerNameContainer = document.getElementById('CustomerName') as HTMLElement | null;
  //     if (CustomerNameContainer) {
  //       CustomerNameContainer.innerText = `Customer Name: ${customer.customer_first_name} ${customer.customer_last_name}`;
  //     }
  
  //     const CustomerEmailContainer = document.getElementById('CustomerEmail') as HTMLElement | null;
  //     if (CustomerEmailContainer) {
  //       CustomerEmailContainer.innerText = `Customer Email: ${customer.customer_email}`;
  //     }
  //   } catch (error) {
  //     // Handle the error properly
  //     setErrorMessage('Server Error');
  //     alert('Error: ' + error);
  //   }
  // }
  
  React.useEffect(() => {
    displayDetails();
  }, []);

  const proceedSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.removeItem('CustomerFirstName');
    localStorage.removeItem('CustomerLastName');
    localStorage.removeItem('CustomerEmail');
    localStorage.removeItem('CustomerAccountId');
    navigate('/');
  }
      // Send a request to your backend to retrieve user info based on the email
      
  const getFontSize = () => {
    if (isMobile) return '16px';
    if (isTablet) return '20px';
    if (isDesktop) return '24px';
    return '20px'; // Default size if none of the conditions match
  };
     
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth={isMobile ? "xs" : isTablet ? "sm" : isDesktop ? "xs" : "xs"} >
        <CssBaseline />
        <Paper 
          elevation={24}
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: isMobile ? 2 : isTablet ? 4 : 6,
            opacity:0.95,
            width: isPortrait ? '100%' : 'auto',
          }}
        >
          <img src={Logo} width={500} alt="" />
          <Typography component="h1" variant={isMobile ? "h6" : isTablet ? "h6" : isDesktop ? "h6" : "h6"} fontFamily={"serif"} color={'grey'}>
            <center>You have successfully registered!</center>
            <center>(Please save information below)</center>
          </Typography>
          <Box component="form" onSubmit={proceedSignUp} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} id='CustomerAccountId' style={{fontSize: 18}}>
                
              </Grid>
              <Grid item xs={12} sm={6} id='CustomerName' style={{fontSize: 18}}>
                
              </Grid>
              <Grid item xs={12} id='CustomerEmail' style={{fontSize: 18}}>
                
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} id='CustomerName'>
              <Button
                style={{minWidth:'auto', minHeight:'auto', fontSize: getFontSize(), fontFamily:'serif'}}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Finish
              </Button>
            </Grid>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}