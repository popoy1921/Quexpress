import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { Box, Button, Container, Grid, Paper } from '@mui/material';
import axios from 'axios'
import { format } from 'date-fns';
import returnDateTime from '../../TimeStamp';
import { useParams } from 'react-router-dom';

const { formattedDate, formattedTime } = returnDateTime();

export default function TransactonControl() {
  let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
  let transactionCodes : {[key: string]: string}= {};
  transactionCodes = JSON.parse(transactionCodeString);
  let transactionCode = transactionCodes[useParams().TransactionCode ?? ''];

  async function updateForMonitorBlink (transactionCode : string)
  {
    await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateBlink/` + transactionCode, {'blink' : 1});
  }

  function nextNumber(event: any)
  {
    event.preventDefault();
    updateNumber('done');
    if (document.getElementById('nowServing')?.innerText != 'No Available Number'){
      updateForMonitorBlink(transactionCode)
    }
  }

  function callAgain(event: any)
  {
    event.preventDefault();
    if (document.getElementById('nowServing')?.innerText != 'No Available Number'){
      updateForMonitorBlink(transactionCode)
    }
  }

  function cancelNumber(event: any)
  {
    event.preventDefault();
    updateNumber('cancelled');
    if (document.getElementById('nowServing')?.innerText != 'No Available Number'){
      updateForMonitorBlink(transactionCode)
    }
  }

  function updateNumber(nextTransactionStatus: string)
  {
    updateTransactionStatus(nextTransactionStatus);
    getNumber();
  }

  async function updateTransactionStatus(nextTransactionStatus: string)
  {
    // current number move to done
    let date: Date = new Date();
    let transactionQueue = localStorage.getItem(transactionCode + 'NowServing');
    let transactionData = {
      transactionQueue    : transactionQueue,
      status              : nextTransactionStatus,
      transactionEndTime  : format(date, 'HH:mm:ss'),
    };
    if (transactionQueue === '0') {
      return false;
    }
    await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/update`, transactionData)
    .then(response => {
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  async function getNumber()
  {
    // get first row value
    let date: Date = new Date();
    let tableQueue = document.getElementById('QueueTable') ?? document;
    let tableQueueBody = tableQueue.getElementsByTagName('tbody')[0];
    let rows = tableQueueBody.getElementsByTagName("tr");
    let queueNumber = '';
    if (rows.length > 0) {
      // move next number to on going
      queueNumber = rows[0].getElementsByTagName("td")[0].innerText;
      let transactionData = {
        transactionQueue      : queueNumber,
        status                : 'on going',
        transactionStartTime  : format(date, 'HH:mm:ss'),
      };
      await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/update`, transactionData)
      .then(response => {          
        
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
      // update display for now serving
      let nowServingContainer = document.getElementById('nowServing') ?? document as any;
      nowServingContainer.innerText = queueNumber;
    } 
    else {
      // no next number available
      alert('Next Number Unavailable');
      let nowServingContainer = document.getElementById('nowServing') ?? document as any;
      nowServingContainer.innerText = 'No Available Number';
    }

    let nowServingContainer = document.getElementById('nowServing') ?? document as any;
    if (nowServingContainer.innerText !== '') {
      localStorage.setItem(transactionCode + 'NowServing', nowServingContainer.innerText);
    }

  }

  function passToCashier(event: any)
  {
    event.preventDefault();
    let transactionRef = localStorage.getItem(transactionCode + 'NowServing') as string;
    toCashier(transactionRef);
    updateNumber('done');
    if (document.getElementById('nowServing')?.innerText != 'No Available Number'){
      updateForMonitorBlink(transactionCode)
    }
  }

  async function toCashier(transactionRef: string)
  {
    await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionRef}`)
    .then(async function (response) {
      const currentDate = localStorage.getItem('currentDate');
      const dateToday = format(new Date(), "yyyy-MM-dd");
      // reset counters
      if (currentDate !== dateToday) {
        localStorage.setItem('currentDate', dateToday);
        localStorage.setItem('CASHIER' + '#', '0');
      }
      // get current counter
      let transactionCodeCounter = (parseInt(localStorage.getItem('CASHIER' + '#') ?? '0') + 1).toString().padStart(5, '0');
      localStorage.setItem('CASHIER' + '#', transactionCodeCounter);

      var responseData = response.data;
      const transactionData = {
        transactionId        : responseData.transaction_id,
        customerId           : responseData.customer_id,
        customerAccountId    : responseData.customer_account_id,
        queueNumber          : 'CSH' + transactionCodeCounter,
        windowId             : 10,
        staffId              : null,
        date                 : formattedDate,
        startTime            : null,
        endTime              : null,
        refQueueNumber       : responseData.transactions_queue,
      }
      createLog(transactionData);
    })
    .catch(function (error) {
      alert(' ' + error);
    });
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

  var accessId = localStorage.getItem('AccessId');
  
  if(accessId === '2') {
    return (
      <React.Fragment>
        <Container maxWidth="xl" sx={{ mt: 5, mb: 1 }}>
          <Grid container spacing={10}>
            <Grid item xs={2}/>
            <Grid item xs={8}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 280,
                }}
              >
              <Title>Now Serving</Title>
              <Typography component="p" variant="h4" align='right' id='nowServing'>
                {localStorage.getItem(transactionCode + 'NowServing') === '0' ? 'No On Going Number': localStorage.getItem(transactionCode + 'NowServing')}
              </Typography>
              <Box component="form" noValidate sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button 
                      type="submit"
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2}}
                      onClick={nextNumber}
                    >
                      NEXT NUMBER  
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      type="submit"
                      fullWidth
                      size='medium'
                      variant="contained"
                      onClick={callAgain}
                      sx={{ mt: 2, mb: 2}} 
                    >
                      CALL AGAIN   
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      type="submit"
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2}} 
                      onClick={cancelNumber}
                    >
                      CANCEL NUMBER   
                    </Button>
                  </Grid> 
                  <Grid item xs={6}>
                    <Button 
                      type="submit"
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2}} 
                      onClick={passToCashier}
                    >
                      PASS TO CASHIER   
                    </Button>
                  </Grid>
                <Grid item xs={3}/>
                </Grid>
              </Box>
  
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Container maxWidth="xl" sx={{ mt: 5, mb: 1 }}>
          <Grid container spacing={10}>
            <Grid item xs={2}/>
            <Grid item xs={8}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 280,
                }}
              >
              <Title>Now Serving</Title>
              <Typography component="p" variant="h4" align='right' id='nowServing'>
                {localStorage.getItem(transactionCode + 'NowServing') === '0' ? 'No On Going Number': localStorage.getItem(transactionCode + 'NowServing')}
              </Typography>
              <Box component="form" noValidate sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button 
                      type="submit"
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2}}
                      onClick={nextNumber}
                    >
                      NEXT NUMBER  
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      type="submit"
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2}} 
                      onClick={callAgain}
                    >
                      CALL AGAIN   
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                  </Grid> 
                  <Grid item xs={6}>
                    <Button 
                      type="submit"
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2}} 
                      onClick={cancelNumber}
                    >
                      CANCEL NUMBER   
                    </Button>
                  </Grid> 
                <Grid item xs={3}/>
                </Grid>
              </Box>
  
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}