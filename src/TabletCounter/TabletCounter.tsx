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

const Logo = require('../Photos/coollogo_com-178391066.png');
const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" fontFamily={"serif"} {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
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
          <img src={Logo} width={isMobile ? 300 : isPortrait ? 400 : isDesktop ? 600 : 600} alt="" />
          <Typography component="h1" variant={isMobile ? "h5" : isTablet ? "h4" : "h3"} color={'black'} marginTop={1}>
            Welcome {localStorage.getItem('UserFirstName')} {localStorage.getItem('UserLastName')}
          </Typography>
          <Typography component="h1" variant={isMobile ? "h6" : isTablet ? "h5" : "h4"} color={'grey'} marginTop={1}>
            PLEASE CHOOSE TRANSACTION
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CustomButton details={'BUSINESS PERMIT'} destination='/CounterBusinessPermit'>
                    BUSINESS PERMIT
                </CustomButton>
              </Grid>

              <Grid item xs={6}>
                <CustomButton details={'LOCAL CIVIL REGISTRY'} destination='/CounterLocalCivilRegistry'>
                    LOCAL CIVIL REGISTRY
                </CustomButton>
              </Grid>

              <Grid item xs={6}>
                <CustomButton details={'CEDULA'} destination='/CounterConfirmation'>
                    CEDULA
                </CustomButton>
              </Grid>

              <Grid item xs={6}>
                <CustomButton details={'REAL PROPERTY TAX'} destination='/CounterConfirmation'>
                    REAL PROPERTY TAX
                </CustomButton>
              </Grid>
              <Grid item xs={2}/>
              <Grid item xs={8}>
                <CancelButton details={'BACK'} destination='/SignInCustomer'>
                    lOGOUT
                </CancelButton>
              </Grid>
            </Grid> 
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}