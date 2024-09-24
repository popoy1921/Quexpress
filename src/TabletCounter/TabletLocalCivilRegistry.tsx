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
import { useNavigate } from 'react-router-dom';

const Logo = require('../Photos/coollogo_com-178391066.png');
const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

const transactionType = localStorage.getItem('TransactionType');

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" fontFamily={"serif"} {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://localhost:3000/">
        QuExpress
      </Link>{' '}
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

export default function SignIn() {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!localStorage.getItem('AccountId')) {
      navigate('/SignInCustomer'); 
    }
  }, [navigate]);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Paper
          elevation={24}
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 5,
            opacity:0.95,
          }}
        >
          <img src={Logo} width={600} alt="" />
          <Typography component="h1" variant="h4" fontFamily={"serif"} marginTop={1}>
            {transactionType}
          </Typography>
          <Typography component="h1" variant="h5" color={'grey'} marginTop={1}>
            PLEASE CHOOSE TRANSACTION
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CustomButton details={'BIRTH CERTIFICATE'} destination='/CounterConfirmation'>
                    BIRTH CERTIFICATE
                </CustomButton>
              </Grid>
              <Grid item xs={6}>
                <CustomButton details={'DEATH CERTIFICATE'} destination='/CounterConfirmation'>
                    DEATH CERTIFICATE
                </CustomButton>
              </Grid>
              <Grid item xs={3.01} />
              <Grid item xs={6}>
                <CustomButton details={'MARRIAGE CERTIFICATE'} destination='/CounterConfirmation'>
                    MARRIAGE CERTIFICATE
                </CustomButton>
              </Grid>
              <Grid item xs={3.01} />
              <Grid item xs={6}>
                <CancelButton details='' destination='/CounterTablet'>
                    BACK
                </CancelButton>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}