import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';

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
const defaultTheme = createTheme();



const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transaction, setTransaction] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      // Send a request to your backend to retrieve user info based on the email
      const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/get/${email}`)
      .then(async function (response) {
        console.log(response.data);
        const isMatch = await comparePasswords(password, response.data.user_pass);
        if(response.data.user_name === email){
          if(isMatch === false){
            alert('Invalid email or password');
          } else{
            if(response.data.access_id === 1){
                localStorage.setItem('UserFirstName', response.data.user_first_name);
                localStorage.setItem('UserEmail', response.data.user_name);
                localStorage.setItem('UserID', response.data.user_id);
                navigate(`/Admin`);
            }
            else{
                alert('Invalid Account');
            }
          }
        }
      })
      .catch(function (error) {
        setErrorMessage('Invalid Account');
      });
  }
  
  const handleChange = (event: SelectChangeEvent) => {
    setTransaction(event.target.value as string);
  };

  async function comparePasswords(plainTextPassword: string, hashedPassword: string) {
    const result = await bcrypt.compare(plainTextPassword, hashedPassword);
    return result;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
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
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Typography component="h1" variant="h3" fontFamily={"serif"} color={'grey'}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
            <Grid container justifyContent="center">
              <Grid item >
                <Link href="/SignUpCustomer" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

function setError(arg0: string) {

}

export default SignIn;