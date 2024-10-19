import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Checkbox, CircularProgress, FormControlLabel, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UniqueNumber from '../UniqueNumber';
import { useMediaQuery } from 'react-responsive';
import OTPInput from './OTPInput';

const Logo = require('../Photos/coollogo_com-178391066.png');

const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

// const uniqueNumber = <UniqueNumber/>;

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

  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 601px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpVerified, setOtpVerified] = React.useState(false); // new state to track OTP verification
  const [isSendingOtp, setIsSendingOtp] = React.useState(false); // loading state for sending OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false); // loading state for verifying OTP

  const handleOTPSend = async () => {
    setIsSendingOtp(true);
    const mobileNumber = (document.getElementById('mobileNumber') as HTMLInputElement)?.value;
  
    try {
      await axios.post(process.env.REACT_APP_OTHER_BACKEND_SERVER + '/send-otp', { mobileNumber });
      setOtpSent(true); // OTP is sent
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setIsSendingOtp(false); // stop loading spinner
    }
  };
  
  const handleOTPChange = (otp: string) => setOtp(otp);

  const handleOTPSubmit = async () => {
    setIsVerifyingOtp(true);
    const mobileNumber = (document.getElementById('mobileNumber') as HTMLInputElement)?.value;
  
    try {
      await axios.post(process.env.REACT_APP_OTHER_BACKEND_SERVER + '/verify-otp', { mobileNumber, otp });
      setOtpVerified(true); // OTP is verified
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(event.target.checked);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!otpVerified) {
    alert('Please verify the OTP first');
    return;
    }
    
    const data = new FormData(event.currentTarget);

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const mobileNumber = data.get('mobileNumber');
    const accountId = UniqueNumber();
    
    if (!firstName){
      alert('First Name field is empty');
      return;
    }
    if(!lastName){
      alert('Last Name field is empty');
      return;
    }
    if (!mobileNumber) {
      alert('Mobile Number field is empty');
      return;
    }

    if (!/^\+?\d{10,15}$/.test(mobileNumber as string)) {
      alert('Invalid mobile number format');
      return;
    }
    
    if (!termsAccepted) {
      alert('You must accept the terms and conditions');
      return;
    }

    
    alert('Successful submission');

    const userDetails = {
      firstName     : firstName,
      lastName      : lastName,
      mobileNumber  : mobileNumber,
      accountId     : accountId,
    }

    registerUser(userDetails);

    localStorage.setItem('CustomerFirstName', firstName.toString());
    localStorage.setItem('CustomerLastName', lastName.toString());
    localStorage.setItem('CustomerMobileNumber', mobileNumber.toString());
    localStorage.setItem('CustomerAccountID', accountId.toString());

    navigate('/SuccessfulRegistration/' + accountId);
  }

  async function registerUser(userDetails : Object)
  {
    await axios.post(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/customer/create`, userDetails)
    .then(response => {
      console.log('Response:', response.data);
    })
    .catch(error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth={isMobile ? "xs" : isTablet ? "sm" : isDesktop ? "sm" : "md"} >
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
          <Typography component="h1" variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} fontFamily={"serif"} color={'grey'}>
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="mobileNumber"
                  label="Mobile Number"
                  name="mobileNumber"
                  autoComplete="tel-national"
                  type="tel"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={termsAccepted}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="I agree to the Terms and Conditions"
                />
              </Grid>
            </Grid>
            {!otpSent ? (
              <Button
                fullWidth
                variant="contained"
                onClick={handleOTPSend}
                disabled={isSendingOtp}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSendingOtp ? <CircularProgress size={24} /> : 'Send OTP'}
              </Button>
            ) : (
              <>
                <Typography variant="h6" fontFamily={"serif"} color={'grey'}>Enter OTP</Typography>
                <OTPInput length={6} onChange={handleOTPChange} />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleOTPSubmit}
                  disabled={isVerifyingOtp}
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isVerifyingOtp ? <CircularProgress size={24} /> : 'Verify OTP'}
                </Button>
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!otpVerified} // Disable until OTP is verified
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}