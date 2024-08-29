import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { Box, Button, Container, Grid, Paper } from '@mui/material';
import returnDateTime from '../../TimeStamp';
import axios from 'axios';

const { formattedDate, formattedTime } = returnDateTime();
const transaction = localStorage.getItem('TransactionAccess');

export default function TransactonControl() {
  function nextNumber(event: any)
  {
    event.preventDefault();
    updateNumber('done');
  }

  function cancelNumber(event: any)
  {
    event.preventDefault();
    updateNumber('cancelled');
  }

  function updateNumber(nextTransactionStatus: string)
  {
    updateTransactionStatus(nextTransactionStatus);
    getNumber();
  }

  function updateTransactionStatus(nextTransactionStatus: string)
  {
    // current number move to done
    let transactionData = {
      transactionQueue    : localStorage.getItem('TellerNowServing'),
      status              : nextTransactionStatus,
      transactionEndTime  : formattedTime
    };
    axios.put(`http://localhost:5000/transaction/updatetransactionstatus `, transactionData)
    .then(response => {          
      
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function getNumber()
  {
    // get first row value
    let tableQueue = document.getElementById('QueueTable') ?? document;
    let tableQueueBody = tableQueue.getElementsByTagName('tbody')[0];
    let rows = tableQueueBody.getElementsByTagName("tr");
    let queueNumber = '';
    if (rows.length > 0) {
      // move next number to on going
      queueNumber = rows[0].getElementsByTagName("td")[0].innerText;
      let transactionData = {
        transactionQueue : queueNumber,
        status           : 'on going'
      };
      axios.put(`http://localhost:5000/transaction/updatetransactionstatus `, transactionData)
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
      localStorage.setItem('TellerNowServing', nowServingContainer.innerText);
    }

  }
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
              {localStorage.getItem('TellerNowServing')}
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
                  >
                    CALL AGAIN   
                  </Button>
                </Grid>
                <Grid item xs={3}/>
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