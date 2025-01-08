import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Background from '../../Photos/BackgroundDesktop.jpg';

const Logo = require('../../Photos/coollogo_com-178391066.png');

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
          backgroundImage: `url(${Background})`,
          backgroundSize: 'cover',
          backgroundattachment: 'fixed',
        }
      }
    }
  },
  palette: {
    primary: { main: '#228B22' },
  },
});

export default function SignUp() {

  const navigate = useNavigate();
  const [userRole, setUserRole] = React.useState('');

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setUserRole(event.target.value);
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const password = data.get('password');
    const access = 3;

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
    const hashedPassword = bcrypt.hashSync(password as string, 10);
    console.log('Hashed Password:', hashedPassword);
    
    const validatePassword = (password: string): boolean => {
      // Regular expressions for each condition
      const hasCapital = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const isMinimumLength = password.length >= 8;

      return hasCapital && hasLowercase && hasNumber && isMinimumLength;
    }

    if (!validatePassword(password as string)) {
      alert('Password does not meet the criteria');
      return;
    }
    alert('Successful submission');
    
    const userDetails = {
      firstName : firstName,
      lastName  : lastName,
      email     : email,
      password  : hashedPassword,
      access    : access,
      userRole  : userRole,
    }

    registerUser(userDetails);
    
  }

  function registerUser(userDetails : Object)
  {
    axios.post(process.env.REACT_APP_OTHER_BACKEND_SERVER + `users/create`, userDetails)
    .then(response => {
      console.log('Response:', response.data);
      navigate('/AdminAccountManagement');
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
          elevation={24}
          sx={{
            marginTop: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            opacity: 0.95,
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="userRole-label">User Role</InputLabel>
                  <Select
                    labelId="userRole-label"
                    id="userRole"
                    value={userRole}
                    label="User Role"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value="14">Cashier1</MenuItem>
                    <MenuItem value="15">Cashier2</MenuItem>
                    <MenuItem value="16">Cashier3</MenuItem>
                    <MenuItem value="17">Cashier4</MenuItem>
                    <MenuItem value="18">Cashier5</MenuItem>
                    <MenuItem value="19">Cashier6</MenuItem>
                    <MenuItem value="20">Cashier7</MenuItem>
                    <MenuItem value="21">Cashier8</MenuItem>
                  </Select>
                </FormControl>
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
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}