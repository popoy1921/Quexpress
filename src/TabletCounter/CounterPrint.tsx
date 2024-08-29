import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import returnDateTime from '../TimeStamp';

const Logo = require('../Photos/coollogo_com-178391066.png');

const { formattedDate, formattedTime } = returnDateTime();

const transactionType = localStorage.getItem('TransactionType');
const customerFirstName = localStorage.getItem('UserFirstName');
const accountId = localStorage.getItem('AccountId');
const customerId = localStorage.getItem('UserID');
const queueNumber = localStorage.getItem('QueueNumber');

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


export default function CounterPrint() {

  const navigate = useNavigate();
  
  function capitalizeAndRemoveSpaces(str: string): string {
    return str.replace(/\s/g, "").toUpperCase();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transactions/get/${transactionType}`)
      .then(async function (response) {

        // Send a request to your backend to retrieve user info based on the email
        const transactionData = {
          transactionId        : response.data.transaction_id,
          customerId           : customerId,
          customerAccountId    : accountId,
          queueNumber          : queueNumber,
          windowId             : response.data.transaction_id,
          staffId              : null,
          date                 : formattedDate,
          startTime            : formattedTime,
          endTime              : null,
        }
        createLog(transactionData);
      })
      .catch(function (error) {
        alert(' ' + error);
      });
      
      function createLog(transactionData : Object)
      {
        axios.post(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/create`, transactionData)
        .then(response => {
          // let printContent = document.getElementById('printablediv1');
          // let printContent1 = '';
          // if (printContent  !== null) {
          //   printContent1 = printContent.innerHTML;
          // }
          // let originalContents = document.body.innerHTML;
          // document.body.innerHTML = printContent1;
          // window.print();
          // document.body.innerHTML = originalContents; 
        })
        .catch(error => {
          // Handle error
          console.error('Error:', error);
        });
      }
      
  }

  window.onafterprint = function() {
    window.location.href = '/SignInCustomer';
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm" id='printablediv1'>
        <CssBaseline />
        <Paper
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 5,
          }}
        >
          
          <img src={Logo} width={300} alt="" />
          
          <Typography component="h1" variant="h3" fontFamily={"serif"} color={'grey'} marginTop={4}>
            {customerFirstName}
          </Typography>
          <Typography component="h1" variant="h5" fontFamily={"serif"} color={'grey'} marginTop={4}>
            YOUR QUEUE NUMBER
          </Typography>
          <Typography component="h2" variant="h2" fontFamily={"serif"} marginTop={4}>
            {queueNumber}
          </Typography>
          <Typography component="h1" variant="h5" fontFamily={"serif"} marginTop={4}>
            {formattedDate}
          </Typography>

          
        </Paper>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}