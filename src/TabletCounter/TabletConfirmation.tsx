import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { format, formatDate } from 'date-fns';
import returnDateTime from '../TimeStamp';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';

const Logo = require('../Photos/coollogo_com-178391066.png');
const mLogo = require('../Photos/lingayen-seal.png');
const { formattedDate, formattedTime } = returnDateTime();

const transactionType = localStorage.getItem('TransactionType');
const customerFirstName = localStorage.getItem('UserFirstName');
const accountId = localStorage.getItem('AccountId');
const customerId = localStorage.getItem('UserID');

const BackgroundMobile = require('../Photos/BackgroundMobile.jpg');
const BackgroundTablet = require('../Photos/BackgroundTablet.jpg');
const BackgroundDesktop = require('../Photos/BackgroundDesktop.jpg');

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

export default function ConfirmQueue() {
  const navigate = useNavigate();
  const [printPreview, setPrintPreview] = useState<string | null>(null);

  getQueueNumber();
  async function getQueueNumber() {
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
          // localStorage.setItem(transactionDesc + '#', transactionCodeCounter);
          var queueNumberContainer = document.getElementById("QueueNumber") ?? document as unknown as HTMLElement;            
          queueNumberContainer.innerText = transactionCodes[transactionDesc] +''+ transactionCodeCounter;
          
        }
      }
    })
  }

  const sendPrintRequest = async (textToPrint1: string, textToPrint2: string, textToPrint3: string) => {
    const queryParams = new URLSearchParams({
      text1: textToPrint1,
      text2: textToPrint2,
      text3: textToPrint3,
    }).toString();

    const responseUrl = process.env.REACT_APP_OTHER_BACKEND_SERVER + `/print?${queryParams}`; 
    const printLink = `my.bluetoothprint.scheme://http://quexpress.vercel.app/${responseUrl}`;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = printLink;
  
    document.body.appendChild(iframe);
  
    setTimeout(() => {
      document.body.removeChild(iframe); // Clean up
      navigate("/SignInCustomer");
    }, 2000); // Adjust delay as needed
  }

  const yesButton = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transactions/get/${transactionType}`)
    .then(async function (response) {
      
      if(transactionType !== null) {
        const transactionDesc = capitalizeAndRemoveSpaces(transactionType);
        let transactionCodeCounter = (parseInt(localStorage.getItem(transactionDesc + '#') ?? '0') + 1).toString().padStart(5, '0');
        localStorage.setItem(transactionDesc + '#', transactionCodeCounter);
        localStorage.setItem('QueueNumber', (document.getElementById("QueueNumber") ?? document as unknown as HTMLElement).innerText);
      }
    })
    const response2 = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transactions/get/${transactionType}`)
      .then(async function (response2) {
        
        // Send a request to your backend to retrieve user info based on the email
        const transactionData = {
          transactionId        : response2.data.transaction_id,
          customerId           : customerId,
          customerAccountId    : accountId,
          queueNumber          : localStorage.getItem('QueueNumber'),
          windowId             : null,
          staffId              : null,
          date                 : formattedDate,
          startTime            : null,
          endTime              : null,
          transactionPass      : null,
        }
        createLog(transactionData);
        
        const toPrint1 = `${document.querySelector('#TransactionType')?.textContent}`;
        const toPrint2 = `${document.querySelector('#QueueNumber')?.textContent}`;
        const toPrint3 = `${document.querySelector('#FormattedDate')?.textContent}`;

        sendPrintRequest(toPrint1, toPrint2, toPrint3);
        
      })
      .catch(function (error) {
        alert(' ' + error);
      });
  }
  
  
  const noButton = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/CounterTablet");
  }

  function createLog(transactionData : Object)
  {
    axios.post(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/create`, transactionData)
    .then(response => {
      
    })
    .catch(error => {
      // Handle error
      console.error('Error:', error);
    });
  }

  
  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 601px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth={isMobile ? "xs" : isTablet ? "xs" : isDesktop ? "xs" : "xs"}>
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
          <img src={Logo} width={isMobile ? 200 : isPortrait ? 300 : isDesktop ? 500 : 500} alt="" />
          <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
            YOUR TRANSACTION
          </Typography>
          <center>
          <Typography component="h1" variant="h5" fontFamily={"serif"} marginTop={1} id="TransactionType">
            {transactionType}
          </Typography>
          <Typography component="h1" variant="h3" fontFamily={"serif"} marginTop={1} id="QueueNumber">

          </Typography>
          <Typography component="h1" variant="h6" fontFamily={"serif"} marginTop={1} id="FormattedDate">
            {formattedDate}
          </Typography>
          </center>
          <Box component="form" noValidate sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  style={{minWidth:'auto', minHeight:'auto', fontSize: 30, fontFamily:'serif'}}
                  type='submit'
                  fullWidth
                  size='large'
                  variant="contained"
                  sx={{ mt: 3, mb: 2}}
                  onClick={yesButton}>
                  PROCEED  
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  style={{minWidth:'auto', minHeight:'auto', fontSize: 30, fontFamily:'serif'}}
                  type='submit'
                  fullWidth
                  size='large'
                  variant="contained"
                  sx={{ mt: 3, mb: 2}}
                  onClick={noButton}>
                  CANCEL  
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
        <div className="logo-container">
          <img 
            src={mLogo} 
            width={isMobile ? 100 : isPortrait ? 200 : isDesktop ? 100 : 100} 
            alt="" 
          />
        </div>
      </Container>
    </ThemeProvider>
  );
}
