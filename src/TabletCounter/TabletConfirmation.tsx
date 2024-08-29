import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Grid, Paper } from '@mui/material';
import CancelButton from '../CommonElements/CancelButton';
import axios from 'axios';
import { format } from 'date-fns';
import ConfirmButton from '../CommonElements/ConfirmButton';
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

function capitalizeAndRemoveSpaces(str: string): string {
  return str.replace(/\s/g, "").toUpperCase();
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

export default function confirmQueue() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      // Send a request to your backend to retrieve user info based on the transaction type
    const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transactions/get/${transactionType}`)
    .then(async function (response) {
      if(transactionType !== null) {
        const transactionDesc = capitalizeAndRemoveSpaces(transactionType);
        let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
        let transactionCodes : {[key: string]: string} = {};
        if(transactionCodes !== null) {
          transactionCodes = JSON.parse(transactionCodeString);
          const currentDate = localStorage.getItem('currentDate');
          const dateToday = format(new Date(), "yyyy-MM-dd");
          // reset counters
          if (currentDate !== dateToday) {
            localStorage.setItem('currentDate', dateToday);
            for (var transactionCodeKey in transactionCodes) {
              localStorage.setItem(transactionCodeKey + '#', '0');
            }
          }
          // get current counter
          let transactionCodeCounter = (parseInt(localStorage.getItem(transactionDesc + '#') ?? '0') + 1).toString().padStart(5, '0');
          localStorage.setItem(transactionDesc + '#', transactionCodeCounter);
          localStorage.setItem('QueueNumber', transactionCodes[transactionDesc] +''+ transactionCodeCounter);
          var queueNumberContainer = document.getElementById("QueueNumber") ?? document as unknown as HTMLElement;            
          queueNumberContainer.innerText = transactionCodes[transactionDesc] +''+ transactionCodeCounter;
        }
      }
    })
  }

  function printExternal(): void {
    const printWindow = window.open("/CounterPrint", 'print');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        setTimeout(() => {
          printWindow?.print();
          // printWindow.close();
        }, 500); // Adjust the delay as needed
      }, true);
    }
  }

  window.onafterprint = function() {
    window.location.href = '/SignInCustomer';
  };



  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Paper
          elevation={24}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 5,
            opacity:0.95,
          }}
        >
          <img src={Logo} width={500} alt="" />
          <Typography component="h1" variant="h5" fontFamily={"serif"} color={'grey'} marginTop={4}>
            PLEASE CONFIRM YOUR TRANSACTION
          </Typography>
          <Typography component="h1" variant="h2" fontFamily={"serif"} marginTop={1}>
            {transactionType}
          </Typography>
          <Typography component="h1" variant="h1" fontFamily={"serif"} marginTop={1} id="QueueNumber">

          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, mb: 10 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  style={{minWidth:500, minHeight:150, fontSize: 30, fontFamily:'serif'}}
                  type='submit'
                  fullWidth
                  size='large'
                  variant="contained"
                  sx={{ mt: 3, mb: 2}}
                  onClick={printExternal}>
                  YES  
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  style={{minWidth:500, minHeight:150, fontSize: 30, fontFamily:'serif'}}
                  type='submit'
                  fullWidth
                  size='large'
                  variant="contained"
                  sx={{ mt: 3, mb: 2}}
                  >
                  NO  
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
