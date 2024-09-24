import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const Logo = require('../Photos/coollogo_com-178391066.png');
const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

if(localStorage.getItem('TransactionCodes') === null) {
  localStorage.setItem('TransactionCodes', JSON.stringify({
    SANITARY : "BPS",
    BUILDINGPERMIT : "BPB",
    ZONING: "BPZ",
    FIRESAFETYINSPECTIONCERTIFICATE : "BPF",
    BIRTHCERTIFICATE : "LCB",
    DEATHCERTIFICATE : "LCD",
    MARRIAGECERTIFICATE : "LCM",
    CEDULA : "CDL",
    REALPROPERTYTAX : "RPT",
    CASHIER : "CSH"
  }));
}

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
  }
});

const SignIn: React.FC = () => {
  const [accountId, setAccountId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 601px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  useEffect(() => {
    localStorage.removeItem('AccountId');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
      // Send a request to your backend to retrieve user info based on the email
      const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/customer/get/${accountId}`)
      .then(async function (response) {
        console.log(response.data)
        if(response.data.account_id === accountId){
          localStorage.setItem('AccountId', response.data.account_id);
          localStorage.setItem('UserFirstName', response.data.customer_first_name);
          localStorage.setItem('UserLastName', response.data.customer_last_name);
          localStorage.setItem('UserEmail', response.data.customer_email);
          localStorage.setItem('UserID', response.data.customer_id);
          navigate('/Counter');
        }
      })
      .catch(function (error) {
        setErrorMessage('Invalid Account ID');
      });
  }

  const getFontSize = () => {
    if (isMobile) return '16px';
    if (isTablet) return '20px';
    if (isDesktop) return '24px';
    return '20px'; // Default size if none of the conditions match
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth={isMobile ? "xs" : isTablet ? "sm" : isDesktop ? "sm" : "md"}>
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
          <img src={Logo} width={isMobile ? 300 : isPortrait ? 400 : isDesktop ? 600 : 600} alt="" />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Typography component="h1" variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} fontFamily={"serif"} color={'grey'}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              style={{minWidth:'auto', minHeight:'auto', fontSize: getFontSize(), fontFamily:'serif'}}
              margin="normal"
              required
              fullWidth
              id="accountId"
              label="Input Account ID"
              name="accountId"
              onChange={(e) => setAccountId(e.target.value)}
              autoFocus
              sx={{mb: 4 }}
            />
            <Button
              style={{minWidth:'auto', minHeight:'auto', fontSize: getFontSize(), fontFamily:'serif'}}
              type="submit"
              fullWidth
              variant="contained"
              sx={{mb: 4 }}
            >
                Sign In
            </Button>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}

function setError(arg0: string) {

}

export default SignIn;