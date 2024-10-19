import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import Background from '../Photos/BackgroundDesktop.jpg';

const Logo = require('../Photos/coollogo_com-178391066.png');

if(localStorage.getItem('TransactionCodes') === null) {
  localStorage.setItem('TransactionCodes', JSON.stringify({
    BPLO1 : "BPLO1",
    BPLO2 : "BPLO2",
    BPLO3 : "BPLO3",
    BUSINESSPERMITINQUIRY : "BPI",
    NEWAPPLICANT : "BPN",
    RENEWAL : "BPR",
    CLOSINGBUSINESS : "BPC",
    BUSINESSPERMITCLAIM : "BPT",
    SANITARY : "BPS",
    SANITARYINQUIRY : "BSI",
    SANITARYREQUIREMENTS : "BSR",
    SANITARYPAYMENT : "BSP",
    SANITARYCLAIM : "BST",
    BUILDINGPERMIT: "BPB",
    BUILDINGPERMITINQUIRY : "BBI",
    BUILDINGPERMITREQUIREMENTS : "BBR",
    BUILDINGPERMITPAYMENT : "BBP",
    BUILDINGPERMITCLAIM : "BBT",
    ZONING: "BPZ",
    ZONINGINQUIRY  : "BZI",
    ZONINGREQUIREMENTS  : "BZR",
    ZONINGPAYMENT  : "BZP",
    ZONINGCLAIM  : "BZT",
    FIRESAFETYINSPECTIONCERTIFICATE : "BPF",
    FIRESAFETYINSPECTIONCERTIFICATEINQUIRY : "BFI",
    FIRESAFETYINSPECTIONCERTIFICATEREQUIREMENTS : "BFR",
    FIRESAFETYINSPECTIONCERTIFICATEPAYMENT : "BFP",
    FIRESAFETYINSPECTIONCERTIFICATECLAIM : "BFT",
    LCRCLAIM : "LCRT",
    BIRTHCERTIFICATE: "LBC",
    BIRTHCERTIFICATEINQUIRY : "LBI",
    BIRTHCERTIFICATEREQUIREMENTS : "LBR",
    BIRTHCERTIFICATECLAIM : "LBT",
    DEATHCERTIFICATE: "LDC",
    DEATHCERTIFICATEINQUIRY : "LDI",
    DEATHCERTIFICATEREQUIREMENTS : "LDR",
    DEATHCERTIFICATECLAIM : "LDT",
    MARRIAGECERTIFICATE: "LMC",
    MARRIAGECERTIFICATEINQUIRY : "LMI",
    MARRIAGECERTIFICATEREQUIREMENTS : "LMR",
    MARRIAGECERTIFICATECLAIM : "LMT",
    CORRECTION: "LCC",
    CORRECTIONBIRTHCERTIFICATE  : "LCB",
    CORRECTIONDEATHCERTIFICATE  : "LCD",
    CORRECTIONMARRIAGECERTIFICATE  : "LCM",
    CORRECTIONCLAIM  : "LCT",
    DTI: "DTM",
    DTIINQUIRY : "DTI",
    DTIREQUIREMENTS : "DTR",
    DTIPAYMENT : "DTP",
    DTICLAIM : "DTT",
    MAYORCLEARANCEINQUIRY  : "MYI",
    MAYORCLEARANCEREQUIREMENTS  : "MYR",
    MAYORCLEARANCEPAYMENT  : "MYP",
    MAYORCLEARANCECLAIM  : "MYT",
    WORKINGPERMITINQUIRY : "WPI",
    WORKINGPERMITREQUIREMENTS : "WPR",
    WORKINGPERMITPAYMENT : "WPP",
    WORKINGPERMITCLAIM : "WPT",
    PERMITTOOPERATEINQUIRY : "POI",
    PERMITTOOPERATEREQUIREMENTS : "POR",
    PERMITTOOPERATEPAYMENT : "POP",
    PERMITTOOPERATECLAIM : "POT",
    BUSINESSPERMITPAYMENT : "BPP",
    CEDULA : "CDL",
    RENTALPAYMENT: "RTP",
    REALPROPERTYTAX : "RPT",
    BIRTHCERTIFICATEPAYMENT : "LBP",
    DEATHCERTIFICATEPAYMENT : "LDP",
    MARRIAGECERTIFICATEPAYMENT : "LMP",
    CORRECTIONPAYMENT : "LCP",
    VIOLATIONPAYMENT : "VLP",
    OTHERSPAYMENT : "OTP",
    CASHIER1 : "CSH1",
    CASHIER2 : "CSH2",
    CASHIER3 : "CSH3",
    CASHIER4 : "CSH4",
    CASHIER5 : "CSH5",
    CASHIER6 : "CSH6",
    CASHIER7 : "CSH7",
    CASHIER8 : "CSH8",
    CASHIER9 : "CSH9",
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
  },
  palette: {
    primary: { main: '#228B22' },
  },
});

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [transaction, setTransaction] = React.useState('');
  const [windowNumber, setWindowNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('UserEmail');
  }, []);

  const handleChangeTransaction = (event: SelectChangeEvent) => {
    setTransaction(event.target.value as string);
  };

  const handleChangeWindow = (event: SelectChangeEvent) => {
    setWindowNumber(event.target.value as string); // Update window state
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/users/get/${email}`);
      const user = response.data;
  
      const isMatch = await comparePasswords(password, user.user_pass);
      if (!isMatch || user.user_name !== email) {
        alert('Invalid email or password');
        return;
      }
  
      // Ensure a transaction is selected
      if (transaction === '') {
        alert('Please select a transaction');
        return;
      }

      if (transaction === 'CASHIER' && windowNumber === '') {
        alert('Please select a window');
        return;
      }
  
      // Check for Teller role (access_id === 2)
      if (user.access_id === 2) {
        const allowedTellerTransactions = [
          'BPLO1', 'BPLO2', 'BPLO3', 'SANITARY', 'BUILDINGPERMIT', 'ZONING', 'FIRESAFETYINSPECTIONCERTIFICATE',
          'BIRTHCERTIFICATE', 'DEATHCERTIFICATE', 'MARRIAGECERTIFICATE','CORRECTION', 'LCRT',
          'DTI', 'CEDULA', 'REALPROPERTYTAX'
        ];
  
        if (allowedTellerTransactions.includes(transaction)) {
          grantAccess(user, transaction);
        } else {
          alert('Teller account is not authorized for this transaction.');
          navigate('/SignInAccount');
        }
      }
  
      // Check for Cashier role (access_id === 3)
      else if (user.access_id === 3) {
        if (transaction === 'CASHIER') {
          grantAccess(user, transaction+windowNumber);
        } else {
          alert('Cashier account is not authorized for this transaction.');
          navigate('/SignInAccount');
        }
      } else {
        alert('Invalid access level.');
      }
  
      resetCountersIfNewDay();
    } catch (error) {
      setErrorMessage('Server Error');
    }
  };
  
  // Helper function to grant access
  const grantAccess = (user: any, transaction: string) => {
    alert(`Welcome ${user.user_first_name} with Transaction type ${transaction}`);
    localStorage.setItem('UserFirstName', user.user_first_name);
    localStorage.setItem('UserEmail', user.user_name);
    localStorage.setItem('UserID', user.user_id);
    localStorage.setItem('TransactionAccess', transaction);
    localStorage.setItem('AccessId', user.access_id);
    navigate(`/Teller/${transaction}`);
  };
  
  // Reset counters if a new day
  const resetCountersIfNewDay = () => {
    const transactionCodes = JSON.parse(localStorage.getItem('TransactionCodes') as string);
    const currentDate = localStorage.getItem('tellerCurrentDate');
    const dateToday = format(new Date(), 'yyyy-MM-dd');
  
    if (currentDate !== dateToday) {
      localStorage.setItem('tellerCurrentDate', dateToday);
      for (let transactionCodeKey in transactionCodes) {
        localStorage.setItem(`${transactionCodes[transactionCodeKey]}NowServing`, '0');
      }
    }
  };
  
  
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
                <MenuItem value={'BPLO1'}>BPLO RECEIVING</MenuItem>
                <MenuItem value={'BPLO2'}>CLEARANCE/ WORK PERMIT</MenuItem>
                <MenuItem value={'BPLO3'}>BPLO CLAIM</MenuItem>
                <MenuItem value={'SANITARY'}>SANITARY</MenuItem>
                <MenuItem value={'BUILDINGPERMIT'}>BUILDING PERMIT</MenuItem>
                <MenuItem value={'ZONING'}>ZONING</MenuItem>
                <MenuItem value={'FIRESAFETYINSPECTIONCERTIFICATE'}>FIRE SAFETY INSPECTION CERTIFICATE</MenuItem>
                <MenuItem value={'BIRTHCERTIFICATE'}>BIRTH CERTIFICATE</MenuItem>
                <MenuItem value={'DEATHCERTIFICATE'}>DEATH CERTIFICATE</MenuItem>
                <MenuItem value={'MARRIAGECERTIFICATE'}>MARRIAGE CERTIFICATE</MenuItem>
                <MenuItem value={'CORRECTION'}>CORRECTION</MenuItem>
                <MenuItem value={'LCRCLAIM'}>LCR TO CLAIM</MenuItem>
                <MenuItem value={'DTI'}>DTI</MenuItem>
                <MenuItem value={'CASHIER'}>CASHIER</MenuItem>
              </Select>
            </FormControl>

            {/* Conditionally show the window selection when CASHIER is selected */}
            {transaction === 'CASHIER' && (
              <FormControl fullWidth margin='normal'>
                <InputLabel id="Window">Window Number</InputLabel>
                <Select
                  required
                  labelId="Window"
                  id="Window"
                  value={windowNumber}
                  label="Window"
                  onChange={handleChangeWindow}
                >
                  <MenuItem value={'1'}>CASHIER WINDOW 1</MenuItem>
                  <MenuItem value={'2'}>CASHIER WINDOW 2</MenuItem>
                  <MenuItem value={'3'}>CASHIER WINDOW 3</MenuItem>
                  <MenuItem value={'4'}>CASHIER WINDOW 4</MenuItem>
                  <MenuItem value={'5'}>CASHIER WINDOW 5</MenuItem>
                  <MenuItem value={'6'}>CASHIER WINDOW 6</MenuItem>
                  <MenuItem value={'7'}>CASHIER WINDOW 7</MenuItem>
                  <MenuItem value={'8'}>CASHIER WINDOW 8</MenuItem>
                </Select>
              </FormControl>
            )}

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