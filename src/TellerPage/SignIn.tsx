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
import { FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Background from '../Photos/peakpx.jpg';

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
  }
});

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transaction, setTransaction] = React.useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('UserEmail');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/get/${email}`)
      .then(async function (response) {
        const isMatch = await comparePasswords(password, response.data.user_pass);
        if (response.data.user_name === email) {
          if (isMatch === false) {
            alert('Invalid email or password');
          } else {
            if (response.data.access_id === 2) {
              if(transaction !== '') {
                if (
                  transaction === 'SANITARY' || 
                  transaction === 'BUILDINGPERMIT' || 
                  transaction === 'ZONING' || 
                  transaction === 'FIRESAFETYINSPECTIONCERTIFICATE' || 
                  transaction === 'BIRTHCERTIFICATE' || 
                  transaction === 'DEATHCERTIFICATE' || 
                  transaction === 'MARRIAGECERTIFICATE' || 
                  transaction === 'CEDULA' || 
                  transaction === 'REALPROPERTYTAX' 
                ) {
                  alert('Welcone ' + response.data.user_first_name + ' with Transaction type ' +transaction);
                  localStorage.setItem('UserFirstName', response.data.user_first_name);
                  localStorage.setItem('UserEmail', response.data.user_name);
                  localStorage.setItem('UserID', response.data.user_id);
                  localStorage.setItem('TransactionAccess', transaction);
                  localStorage.setItem('AccessId', response.data.access_id);
                  navigate(`/Teller/` +  transaction);
                } else {
                  alert('Teller Account is not applicable to use this this type of transaction');
                  navigate('/SignInAccount');
                }  
              }
            } else if(response.data.access_id === 3) {
              if(transaction !== '') {
                if(transaction === 'CASHIER') {
                  alert('Welcone ' + response.data.user_first_name + ' with Transaction type ' +transaction);
                  localStorage.setItem('UserFirstName', response.data.user_first_name);
                  localStorage.setItem('UserEmail', response.data.user_name);
                  localStorage.setItem('UserID', response.data.user_id);
                  localStorage.setItem('TransactionAccess', transaction);
                  localStorage.setItem('AccessId', response.data.access_id);
                  navigate(`/Teller/` +  transaction);
                } else {
                  alert('Cashier Account is not applicable to use this this type of transaction');
                  navigate('/SignInAccount');
                }
              }
            }

            // reset nowserving counters
            let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
            let transactionCodes : {[key: string]: string} = {};
            if(transactionCodes !== null) {
              transactionCodes = JSON.parse(transactionCodeString);
              const currentDate = localStorage.getItem('tellerCurrentDate');
              const dateToday = format(new Date(), "yyyy-MM-dd");
              // reset counters
              if (currentDate !== dateToday) {
                localStorage.setItem('tellerCurrentDate', dateToday);
                for (var transactionCodeKey in transactionCodes) {
                  localStorage.setItem(transactionCodes[transactionCodeKey] + 'NowServing', '0');
                }
              }
            }
          }
        }
      })
      .catch(function (error) {
        setErrorMessage('Server Error');
        alert(' ' + error);
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
          elevation={24}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
            opacity: 0.95,
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
            <FormControl fullWidth margin='normal'>
              <InputLabel id="Transaction">Transaction</InputLabel>
              <Select
                required
                labelId="Transaction"
                id="Transaction"
                value={transaction}
                label="Transaction"
                onChange={handleChange}
              >
                <MenuItem value={'SANITARY'}>SANITARY</MenuItem>
                <MenuItem value={'BUILDINGPERMIT'}>BUILDING PERMIT</MenuItem>
                <MenuItem value={'ZONING'}>ZONING</MenuItem>
                <MenuItem value={'FIRESAFETYINSPECTIONCERTIFICATE'}>FIRE SAFETY INSPECTION CERTIFICATE</MenuItem>
                <MenuItem value={'BIRTHCERTIFICATE'}>BIRTH CERTIFICATE</MenuItem>
                <MenuItem value={'DEATHCERTIFICATE'}>DEATH CERTIFICATE</MenuItem>
                <MenuItem value={'MARRIAGE CERTIFICATE'}>MARRIAGE CERTIFICATE</MenuItem>
                <MenuItem value={'CEDULA'}>CEDULA</MenuItem>
                <MenuItem value={'REALPROPERTYTAX'}>REAL PROPERTY TAX</MenuItem>
                <MenuItem value={'CASHIER'}>CASHIER</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
                Sign In
            </Button>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}

function setError(arg0: string) {

}

export default SignIn;