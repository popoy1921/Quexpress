import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';


const Logo = require('./Photos/coollogo_com-178391066.png');
const MLogo = require('./Photos/lingayen-seal.png');
const BackgroundMobile = require('./Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('./Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('./Photos/BackgroundDesktop.jpg');


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


export default function MainPage() {
    
    const navigate = useNavigate();

    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
    const isTablet = useMediaQuery({ query: '(min-width: 601px) and (max-width: 1024px)' });
    const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

    const proceedRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate('/SignUpCustomer');
    }
    
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
            <img src={MLogo} width={isMobile ? 300 : isPortrait ? 100 : isDesktop ? 450 : 400} alt="" />
          <Box component="form" noValidate onSubmit={proceedRegistration} sx={{ mt: 1 }}>
            <Typography component="h1" variant={isMobile ? "h5" : isTablet ? "h4" : isDesktop ? "h4" : "h4"} fontFamily={"serif"} color={'grey'}>
              <center>A Queue Management System</center>
            </Typography>
            <Typography component="h1" variant={isMobile ? "h6" : isTablet ? "h5" : isDesktop ? "h5" : "h5"} fontFamily={"serif"} color={'grey'}>
              <center>for the Municipality of</center>
            </Typography>
            <Typography component="h1" variant={isMobile ? "h4" : isTablet ? "h3" : isDesktop ? "h3" : "h3"} fontFamily={"serif"} color={'grey'}>
              <center>LINGAYEN</center>
            </Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, mb: 1 }}
                >
                Online Registration
            </Button>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}