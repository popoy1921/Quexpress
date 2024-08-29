import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Background from '../Photos/Artboard.jpg';

const Logo = require('../Photos/coollogo_com-178391066.png');

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
        }
      }
    }
  }
});

const SignIn: React.FC = () => {
  const [accountId, setAccountId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      // Send a request to your backend to retrieve user info based on the email
      const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/customer/get/${accountId}`)
      .then(async function (response) {
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
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper
          elevation={24}
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 1.5,
            opacity:0.95,
          }}
        >
          <img src={Logo} width={600} alt="" />
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <Typography component="h1" variant="h2" fontFamily={"serif"} color={'grey'}>
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              style={{minWidth:'auto', minHeight:'auto', fontSize: 30, fontFamily:'serif'}}
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
              style={{minWidth:'auto', minHeight:'auto', fontSize: 30, fontFamily:'serif'}}
              type="submit"
              fullWidth
              variant="contained"
              sx={{mb: 4 }}
            >
                Sign In
            </Button>
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