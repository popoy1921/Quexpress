import * as React from 'react';
import Button from '@mui/material/Button';
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

const transactionType = localStorage.getItem('TransactionType');

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
          <Typography component="h1" variant="h2" fontFamily={"serif"} marginTop={1}>
            {transactionType}
          </Typography>
          <Typography component="h1" variant="h5" color={'grey'} marginTop={1}>
            PLEASE CHOOSE TRANSACTION
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CustomButton details={'SANITARY'} destination='/CounterConfirmation'>
                    SANITARY
                    <br />
                    (Municipal Health Office)
                </CustomButton>
              </Grid>
              <Grid item xs={6}>
                <CustomButton details={'BUILDING PERMIT'} destination='/CounterConfirmation'>
                    BUILDING PERMIT
                    <br />
                    (Engineering Office)
                </CustomButton>
              </Grid>
              <Grid item xs={6}>
                <CustomButton details={'ZONING'} destination='/CounterConfirmation'>
                    ZONING
                    <br />
                    (Assessor)
                </CustomButton>
              </Grid> 
              <Grid item xs={6}>
                <CustomButton details={'FIRE SAFETY INSPECTION CERTIFICATE'} destination='/CounterConfirmation'>
                    FIRE SAFETY INSPECTION CERTIFICATE (BFP)
                </CustomButton>
              </Grid>
              <Grid item xs={3}/>
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