import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import returnDateTime from '../TimeStamp';

const Logo = require('../Photos/coollogo_com-178391066.png');

const { formattedDate } = returnDateTime();

const queueNumber = localStorage.getItem('QueueNumber');
const transactionType = localStorage.getItem('TransactionType');

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'serif',
  }
});


export default function CounterPrint() {


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm" id='printablediv1'>
        <CssBaseline />
        <Paper
          elevation={24}
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 1,
            opacity:0.95,
          }}
        >
          <center>
          <Typography component="h1" variant="h5" fontFamily={"serif"} marginTop={1}>
            {transactionType}
          </Typography>
          </center>
          <Typography component="h1" variant="h6" fontFamily={"serif"} color={'grey'} marginTop={1}>
            YOUR QUEUE NUMBER
          </Typography>
          <Typography component="h1" variant="h3" fontFamily={"serif"} marginTop={1}>
            {queueNumber}
          </Typography>
          <Typography component="h1" variant="h6" fontFamily={"serif"} marginTop={1}>
            {formattedDate}
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}