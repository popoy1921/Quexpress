import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Grid, Paper } from '@mui/material';
import CustomButton from '../CommonElements/CustomButton';
import CancelButton from '../CommonElements/CancelButton';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Logo = require('../Photos/coollogo_com-178391066.png');
const mLogo = require('../Photos/lingayen-seal.png');
const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

const transactionType = localStorage.getItem('TransactionType');

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

export default function SignIn() {
  const navigate = useNavigate();
  const [windows, setWindows] = useState<{ window_id: number; window_status: string }[]>([]);
  
  React.useEffect(() => {
    if (!localStorage.getItem('AccountId')) {
      navigate('/SignInCustomer'); 
    }
    const fetchWindows = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/window/get`);
        setWindows(response.data); // Assuming the API returns an array of objects with window_id and window_status
      } catch (error) {
        console.error('Error fetching windows:', error);
      }
    };

    fetchWindows();
  }, [navigate]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const isWindowOnline = (id: number) => {
    const window = windows.find((win) => win.window_id === id);
    console.log(window?.window_status === 'online');
    return window?.window_status === 'online';
  };

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 601px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth={isMobile ? "xs" : isTablet ? "md" : isDesktop ? "lg" : "lg"}>
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
          <img src={Logo} width={isMobile ? 200 : isPortrait ? 300 : isDesktop ? 500 : 500} alt="" />
          <Typography component="h1" variant={isMobile ? "h5" : isTablet ? "h4" : "h4"} color={'black'} marginTop={1}>
          {transactionType}
          </Typography>
          <Typography component="h1" variant={isMobile ? "h6" : isTablet ? "h5" : "h5"} color={'grey'} marginTop={1}>
            PLEASE CHOOSE TRANSACTION
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <CustomButton details={'BUSINESS PERMIT ' + transactionType} destination='/CounterConfirmation' windowId={[14, 15]} disabled={!isWindowOnline(14) && !isWindowOnline(15)}>
                BUSINESS PERMIT
                </CustomButton>
                <CustomButton details={'BIRTH CERTIFICATE ' + transactionType} destination='/CounterConfirmation' windowId={[20, 21]} disabled={!isWindowOnline(20) && !isWindowOnline(21)}>
                BIRTH CERTIFICATE
                </CustomButton>
                <CustomButton details={'CORRECTION ' + transactionType} destination='/CounterConfirmation' windowId={[20, 21]} disabled={!isWindowOnline(20) && !isWindowOnline(21)}>
                LCR CORRECTION
                </CustomButton>
              </Grid>

              <Grid item xs={4}>
                <CustomButton details={'RENTAL ' + transactionType} destination='/CounterConfirmation' windowId={[18, 19]} disabled={!isWindowOnline(18) && !isWindowOnline(19)}>
                RENTAL PAYMENT
                </CustomButton>
                <CustomButton details={'DEATH CERTIFICATE ' + transactionType} destination='/CounterConfirmation' windowId={[20, 21]} disabled={!isWindowOnline(20) && !isWindowOnline(21)}>
                DEATH CERTIFICATE
                </CustomButton>
                <CustomButton details={'VIOLATION ' + transactionType} destination='/CounterConfirmation' windowId={[20, 21]} disabled={!isWindowOnline(20) && !isWindowOnline(21)}>
                VIOLATION
                </CustomButton>
              </Grid>

              <Grid item xs={4}>
                <CustomButton details={'REAL PROPERTY TAX'} destination='/CounterConfirmation' windowId={[16, 17]} disabled={!isWindowOnline(16) && !isWindowOnline(17)}>
                REAL PROPERTY TAX
                </CustomButton>
                <CustomButton details={'MARRIAGE CERTIFICATE ' + transactionType} destination='/CounterConfirmation' windowId={[20, 21]} disabled={!isWindowOnline(20) && !isWindowOnline(21)}>
                MARRIAGE CERTIFICATE
                </CustomButton>
                <CustomButton details={'PERMIT TO OPERATE ' + transactionType} destination='/CounterConfirmation' windowId={[14, 15]} disabled={!isWindowOnline(14) && !isWindowOnline(15)}>
                PERMIT TO OPERATE
                </CustomButton>
              </Grid>
              <Grid item xs={3}/>
              <Grid item xs={6}>
                <CustomButton details={'OTHERS ' + transactionType} destination='/CounterConfirmation' windowId={[20, 21]} disabled={!isWindowOnline(20) && !isWindowOnline(21)}>
                OTHERS
                </CustomButton>
                <CancelButton details={'BACK'} destination='/CounterTablet'>
                    BACK
                </CancelButton>
              </Grid>
            </Grid> 
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />   
        <div className="logo-container">
          <img 
            src={mLogo} 
            width={isMobile ? 100 : isPortrait ? 200 : isDesktop ? 100 : 100} 
            alt="" 
          />
        </div>
      </Container>
    </ThemeProvider>
  );
}