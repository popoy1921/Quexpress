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
import Background from '../Photos/Artboard.jpg';

const Logo = require('../Photos/coollogo_com-178391066.png');

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
          backgroundImage: `url(${Background})`,
          backgroundSize: 'cover',
          backgroundattachment: 'fixed',
        }
      }
    }
  }
});

export default function SignIn() {
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
      <Container component="main" maxWidth="xl">
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
          <img src={Logo} width={500} alt="" />
          <Typography component="h1" variant="h2" color={'black'} marginTop={1}>
            Welcome {localStorage.getItem('UserFirstName')} {localStorage.getItem('UserLastName')}
          </Typography>
          <Typography component="h1" variant="h5" color={'grey'} marginTop={1}>
            PLEASE CHOOSE TRANSACTION
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CustomButton details={'BUSINESS PERMIT'} destination='/CounterBusinessPermit'>
                    BUSINESS PERMIT
                </CustomButton>
              </Grid>

              <Grid item xs={6} height={200}>
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
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}