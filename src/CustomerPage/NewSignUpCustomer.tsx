import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UniqueNumber from '../UniqueNumber'

const Logo = require('../Photos/coollogo_com-178391066.png');

// const uniqueNumber = <UniqueNumber/>;

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" fontFamily={"serif"} {...props}>
      {'Copyright © '}
      
      <Link color='inherit' href={'/'}>
        QuExpress
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUpCustomer() {

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const accountId = UniqueNumber();
    
    if (firstName === null){
      alert('First Name field is empty');
      return;
    }
    if(lastName === null){
      alert('Last Name field is empty');
      return;
    }
    if (email === null) {
      alert('Email field is empty');
      return;
    }

    // Perform regex test on the email value
    if (!/^\S+@\S+\.\S+$/.test(email as string)) {
      alert('Invalid email format');
      return;
    }

    alert('Successful submission');

    const userDetails = {
      firstName : firstName,
      lastName  : lastName,
      email     : email,
      accountId : accountId,
    }

    registerUser(userDetails);

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
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Paper 
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
          }}
        >
          <img src={Logo} width={500} alt="" />
          <Typography component="h1" variant="h3" fontFamily={"serif"} color={'grey'}>
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
                Sign Up
            </Button>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}