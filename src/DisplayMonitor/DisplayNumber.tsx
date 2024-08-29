import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid';

const Logo = require('../Photos/coollogo_com-178391066.png');
const MLogo = require('../Photos/lingayen-seal.png');

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

export default function DisplayMonitor() {
  setInterval(refreshDisplay, 1000);

  async function refreshDisplay() {
    const transactions: string[] =
       ['SANITARY', 'BUILDINGPERMIT', 'ZONING', 'FIRESAFETYINSPECTIONCERTIFICATE', 'BIRTHCERTIFICATE', 'DEATHCERTIFICATE', 'MARRIAGECERTIFICATE', 'CEDULA', 'REALPROPERTYTAX', 'CASHIER'];
    let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
    let transactionCodes : {[key: string]: string}= {};
    transactionCodes = JSON.parse(transactionCodeString);
      transactions.forEach(async item => {
        let transactionCode = transactionCodes[item] ?? '';
        try {
          const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionCode}`);
          let queueNumber = response.data.transactions_queue;

          if (queueNumber !== '') {
            let nowServingContainer = document.getElementById('NowServing' + transactionCode) ?? document as unknown as HTMLElement;
            nowServingContainer.innerText = queueNumber;
          } 
          if (queueNumber === undefined) {
            let nowServingContainer = document.getElementById('NowServing' + transactionCode) ?? document as unknown as HTMLElement;
            var obj = transactionCode;
            obj = JSON.stringify(obj);
            obj.replace(/(?=,(?!"))(,(?!{))/g,"");
            obj= JSON.parse(obj);
            nowServingContainer.innerText = obj + "00000";
          } 
        } catch (error) {
          console.error('Error fetching transaction status:', error);
          // Handle error, such as showing an error message to the user
      }
    })
  };
  

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1} columns={16}>
          <Grid item xs={8}>
            <center>
              <img src={Logo} width={550} alt=""/>
              <Paper
                sx={{
                  margin: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1.5,
                }}
                >
                  <center>
                    <img src={MLogo} width={800} alt="" />
                  </center>
                  
                </Paper>
            </center>
          </Grid>
          <Grid item xs={4}>
            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
            >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 1
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingBPS'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 2
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingBPB'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 3
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingBPZ'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 4
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingBPF'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 5
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingLCB'>
                
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
          <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
            >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 6
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingLCD'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 7
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingLCM'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 8
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingCDL'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 9
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingRPT'>
                
              </Typography>
            </Paper>

            <Paper
            sx={{
              margin: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 1,
            }}
          >
            <Typography component="h1" variant="h4" align='left' fontFamily={"serif"} color={'primary'} marginTop={1}>
              WINDOW 10
            </Typography>
            <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
              NOW SERVING
            </Typography>
              <Typography component="h1" variant="h2" align='right' fontFamily={"serif"} color={'black'} marginTop={1} id='NowServingCSH'>
                
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
        
      <Copyright sx={{ mt: 6, mb: 4 }} />
    </ThemeProvider>
  );
}
