import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { Box, Button, Container, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import returnDateTime from '../../TimeStamp';
import { useParams } from 'react-router-dom';
import NextIcon from '@mui/icons-material/ArrowForward'; // Next button icon
import CallIcon from '@mui/icons-material/Call'; // Call button icon
import CancelIcon from '@mui/icons-material/Cancel'; // Cancel button icon
import CashierIcon from '@mui/icons-material/AttachMoney'; // Pass to cashier button icon
import { AltRouteRounded } from '@mui/icons-material';

const { formattedDate } = returnDateTime();
const transactionAccess = localStorage.getItem('TransactionAccess');

export default function TransactionControl() {  
  const [accessId, setAccessId] = React.useState(localStorage.getItem('AccessId'));

  // Set interval to update accessId
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newAccessId = localStorage.getItem('AccessId');
      if (newAccessId !== accessId) {
        setAccessId(newAccessId);
      }
    }, 5000); // Update every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [accessId]);

  let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
  let transactionCodes: { [key: string]: string } = {};
  transactionCodes = JSON.parse(transactionCodeString);
  let transactionCode = transactionCodes[useParams().TransactionCode ?? ''];


  async function updateForMonitorBlink(transactionCode: string) {
    await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateBlink/` + transactionCode, { 'blink': 1 });
  }

  function nextNumber(event: any) {
    event.preventDefault();
    updateNumber('done');
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      updateForMonitorBlink(transactionCode);
    }
  }

  function callAgain(event: any) {
    event.preventDefault();
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      updateForMonitorBlink(transactionCode);
    }
  }

  function cancelNumber(event: any) {
    event.preventDefault();
    let transactionRef = localStorage.getItem(transactionCode + 'NowServing') as string;
    toEnd(transactionRef);
    updateNumber('cancelled');
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      updateForMonitorBlink(transactionCode);
    }
  }

  function updateNumber(nextTransactionStatus: string) {
    updateTransactionStatus(nextTransactionStatus);
    getNumber();
  }

  async function toEnd(transactionRef: string) {
    alert(transactionRef)
    await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionRef}`)
    .then(async function (response) {

      var responseData = response.data;
      const transactionData = {
        transactionId: responseData.transaction_id,
        customerId: responseData.customer_id,
        customerAccountId: responseData.customer_account_id,
        queueNumber: responseData.transactions_queue,
        windowId: null,
        staffId: null,
        date: formattedDate,
        startTime: null,
        endTime: null,
        refQueueNumber: null,
      };
      createLog(transactionData);
    })
    .catch(function (error) {
      alert(' ' + error);
    });
  }

  async function updateTransactionStatus(nextTransactionStatus: string) {
    // current number move to done
    let date: Date = new Date();
    let transactionQueue = localStorage.getItem(transactionCode + 'NowServing');
    let transactionData: any = {
      status: nextTransactionStatus,
      transactionEndTime: format(date, 'HH:mm:ss'),
    };
    
    if (!transactionData.transactionRef) {
      if (accessId === '2') {
        transactionData.transactionQueue = transactionQueue;
      } else if (accessId === '3') {
        if (transactionCode === 'CSH1' || transactionCode === 'CSH2' || transactionCode === 'CSH7' || transactionCode === 'CSH8') {
          if (transactionQueue) {
            if (transactionQueue.startsWith('BPP') || transactionQueue.startsWith('POP') || transactionQueue.startsWith('VLP') || transactionQueue.startsWith('OTP') || transactionQueue.startsWith('LBP') || transactionQueue.startsWith('LDP') || transactionQueue.startsWith('LMP') || transactionQueue.startsWith('LCP')) {
              transactionData.transactionQueue = transactionQueue;
            } else {
              transactionData.transactionRef = transactionQueue;
            }
          }
        } else {
          transactionData.transactionQueue = transactionQueue;
        }
      }
    }
  
    if (transactionQueue === '0') {
      return false;
    }
    
    await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/update`, transactionData)
      .then(async response => {
        var staffIdData = {
          staffId: localStorage.getItem('UserID'),
          transactionLogId: response.data.transaction_log_id,
        };
        await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateStaff`, staffIdData);
        
        var windowData: any = {
          transactionLogId: response.data.transaction_log_id,
        };
    
        switch (transactionCode) {
          case 'BPLO1':
              windowData.windowId = 1;
              break;
            case 'BPLO2':
              windowData.windowId = 2;
              break;
            case 'BPS':
              windowData.windowId = 3;
              break;
            case 'BPB':
              windowData.windowId = 4;
              break;
            case 'BPZ':
              windowData.windowId = 5;
              break;
            case 'BPF':
              windowData.windowId = 6;
              break;
            case 'BPLO3':
              windowData.windowId = 7;
              break;
            case 'LBC':
              windowData.windowId = 8;
              break;
            case 'LDC':
              windowData.windowId = 9;
              break;
              case 'LMC':
              windowData.windowId = 10;
              break;
            case 'LCC':
              windowData.windowId = 11;
              break;
            case 'LCRT':
              windowData.windowId = 12;
              break;
            case 'DTM':
              windowData.windowId = 13;
              break;
            case 'CSH1':
            windowData.windowId = 14;
            if (transactionQueue) {
              if (transactionQueue.startsWith('BPP') || transactionQueue.startsWith('POP')) {
                windowData.windowId = 14;
              }
            }
            break;
          case 'CSH2':
            windowData.windowId = 15;
            if (transactionQueue) {
              if (transactionQueue.startsWith('BPP') || transactionQueue.startsWith('POP')) {
                windowData.windowId = 15;
              }
            }
            break;
          case 'CSH3':
            windowData.windowId = 16;
            break;
          case 'CSH4':
            windowData.windowId = 17;
            break;
          case 'CSH5':
            windowData.windowId = 18;
            break;
          case 'CSH6':
            windowData.windowId = 19;
            break;
          case 'CSH7':
            windowData.windowId = 20;
            if (transactionQueue) {
              if (transactionQueue.startsWith('VLP') || transactionQueue.startsWith('OTP') || transactionQueue.startsWith('LBP') || transactionQueue.startsWith('LDP') || transactionQueue.startsWith('LMP') || transactionQueue.startsWith('LCP')) {
                windowData.windowId = 20;
              }
            }
            break;
          case 'CSH8':
            windowData.windowId = 21;
            if (transactionQueue) {
              if (transactionQueue.startsWith('VLP') || transactionQueue.startsWith('OTP') || transactionQueue.startsWith('LBP') || transactionQueue.startsWith('LDP') || transactionQueue.startsWith('LMP') || transactionQueue.startsWith('LCP')) {
                windowData.windowId = 21;
              }
            }
            break;
          default:
            console.log('No matching transaction code.');
            return; // exit early if no matching code
        }
    
        // Update window data if a transaction code matches
        if (windowData.windowId) {
          await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateWindow`, windowData);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } // Closing bracket for updateTransactionStatus function
  
  async function getNumber() {
    // get first row value 
    let date: Date = new Date();
    let tableQueue = document.getElementById('QueueTable') ?? document;
    let tableQueueBody = tableQueue.getElementsByTagName('tbody')[0];
    let rows = tableQueueBody.getElementsByTagName("tr");
    let queueNumber = '';
  
    if (rows.length > 0) {
      // move next number to on going
      queueNumber = rows[0].getElementsByTagName("td")[0].innerText;
      let transactionData: any = {
        status: 'on going',
        transactionStartTime: format(date, 'HH:mm:ss'),
      };
  
      if (accessId === '2') {
        transactionData.transactionQueue = queueNumber;
      } else if (accessId === '3') {
        if (transactionCode === 'CSH1' || transactionCode === 'CSH2' || transactionCode === 'CSH7' || transactionCode === 'CSH8') {
          if (queueNumber) {
            if (queueNumber.startsWith('BPP') || queueNumber.startsWith('POP') || queueNumber.startsWith('VLP') || queueNumber.startsWith('OTP') || queueNumber.startsWith('LBP') || queueNumber.startsWith('LDP') || queueNumber.startsWith('LMP') || queueNumber.startsWith('LCP')) {
              transactionData.transactionQueue = queueNumber;
            } else {
              transactionData.transactionRef = queueNumber;
            }
          }
        } else {
          transactionData.transactionQueue = queueNumber;
        }
      }
  
      await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/update`, transactionData)
        .then(async response => {
          var staffIdData = {
            staffId: localStorage.getItem('UserID'),
            transactionLogId: response.data.transaction_log_id,
          };
          await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateStaff`, staffIdData);
  
          var windowData: any = {
            transactionLogId: response.data.transaction_log_id,
          };  
          switch (transactionCode) {
            case 'BPLO1':
              windowData.windowId = 1;
              break;
            case 'BPLO2':
              windowData.windowId = 2;
              break;
            case 'BPS':
              windowData.windowId = 3;
              break;
            case 'BPB':
              windowData.windowId = 4;
              break;
            case 'BPZ':
              windowData.windowId = 5;
              break;
            case 'BPF':
              windowData.windowId = 6;
              break;
            case 'BPLO3':
              windowData.windowId = 7;
              break;
            case 'LBC':
              windowData.windowId = 8;
              break;
            case 'LDC':
              windowData.windowId = 9;
              break;
              case 'LMC':
              windowData.windowId = 10;
              break;
            case 'LCC':
              windowData.windowId = 11;
              break;
            case 'LCRT':
              windowData.windowId = 12;
              break;
            case 'DTM':
              windowData.windowId = 13;
              break;
            case 'CSH1':
              windowData.windowId = 14;
              if (queueNumber.startsWith('BPP') || queueNumber.startsWith('POP')) {
                windowData.windowId = 14;
              }
              break;
            case 'CSH2':
              windowData.windowId = 15;
              if (queueNumber.startsWith('BPP') || queueNumber.startsWith('POP')) {
                windowData.windowId = 15;
              }
              break;
            case 'CSH3':
              windowData.windowId = 16;
              break;
            case 'CSH4':
              windowData.windowId = 17;
              break;
            case 'CSH5':
              windowData.windowId = 18;
              break;
            case 'CSH6':
              windowData.windowId = 19;
              break;
            case 'CSH7':
              windowData.windowId = 20;
              if (queueNumber.startsWith('VLP') || queueNumber.startsWith('OTP') || queueNumber.startsWith('LBP') || queueNumber.startsWith('LDP') || queueNumber.startsWith('LMP') || queueNumber.startsWith('LCP')) {
                windowData.windowId = 20;
              }
              break;
            case 'CSH8':
              windowData.windowId = 21;
              if (queueNumber.startsWith('VLP') || queueNumber.startsWith('OTP') || queueNumber.startsWith('LBP') || queueNumber.startsWith('LDP') || queueNumber.startsWith('LMP') || queueNumber.startsWith('LCP')) {
                windowData.windowId = 21;
              }
              break;
            default:
              console.log('No matching transaction code.');
              return; // exit early if no matching code
          }
  
          // Update window data if a transaction code matches
          if (windowData.windowId) {
            await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateWindow`, windowData);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
  
      // update display for now serving
      let nowServingContainer = document.getElementById('nowServing') ?? document as any;
      nowServingContainer.innerText = queueNumber;
    } else {
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

  function passToCashier(event: any) {
    event.preventDefault();
    let transactionRef = localStorage.getItem(transactionCode + 'NowServing') as string;
    toCashier(transactionRef);
    updateNumber('done');
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      updateForMonitorBlink(transactionCode);
    }
  }

  async function toCashier(transactionRef: string) {
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
        let transactionCodeCounter: any = (parseInt(localStorage.getItem('CASHIER' + '#') ?? '0') + 1).toString().padStart(5, '0');
        localStorage.setItem('CASHIER' + '#', transactionCodeCounter);

        var responseData = response.data;
        if(transactionRef.startsWith('BP') || transactionRef.startsWith('MY') || transactionRef.startsWith('WR') || transactionRef.startsWith('BS') || transactionRef.startsWith('BB') || transactionRef.startsWith('BZ') || transactionRef.startsWith('BF') || transactionRef.startsWith('BC')){
          const transactionData = {
            transactionId: responseData.transaction_id,
            customerId: responseData.customer_id,
            customerAccountId: responseData.customer_account_id,
            queueNumber: 'CSH1' + transactionCodeCounter,
            windowId: null,
            staffId: null,
            date: formattedDate,
            startTime: null,
            endTime: null,
            refQueueNumber: responseData.transactions_queue,
          };
          createLog(transactionData);
        } else if(transactionRef.startsWith('LC')){
          const transactionData = {
            transactionId: responseData.transaction_id,
            customerId: responseData.customer_id,
            customerAccountId: responseData.customer_account_id,
            queueNumber: 'CSH7' + transactionCodeCounter,
            windowId: null,
            staffId: null,
            date: formattedDate,
            startTime: null,
            endTime: null,
            refQueueNumber: responseData.transactions_queue,
          };
        createLog(transactionData);
        }
      })
      .catch(function (error) {
        alert(' ' + error);
      });
  }

  function createLog(transactionData: Object) {
    axios.post(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/create`, transactionData)
      .then(response => { })
      .catch(error => {
        console.error('Error:', error);
      });
  }



  return (
    <React.Fragment>
      <Container maxWidth="xl" sx={{ mt: 5, mb: 1 }}>
        <Grid container spacing={10}>
          <Grid item xs={2} />
          <Grid item xs={8}>
            <Paper
              elevation={24}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                backgroundColor: '#f9f9f9',
              }}
            >
              <Title>Now Serving</Title>
              <Typography
                component="p"
                variant="h4"
                align='right'
                id='nowServing'
                sx={{ color: '#333', fontWeight: 'bold' }}
              >
                {localStorage.getItem(transactionCode + 'NowServing') === '0' ? 'No On Going Number' : localStorage.getItem(transactionCode + 'NowServing')}
              </Typography>
              <Box component="form" noValidate sx={{ mt: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2, bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
                      onClick={nextNumber}
                      startIcon={<NextIcon />}
                    >
                      NEXT NUMBER
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2, bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
                      onClick={callAgain}
                      startIcon={<CallIcon />}
                    >
                      CALL AGAIN
                    </Button>
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', justifyContent: accessId !== '2' ? 'center' : 'flex-start' }}>
                    <Button
                      fullWidth
                      size='medium'
                      variant="contained"
                      sx={{ mt: 2, mb: 2, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' } }}
                      onClick={cancelNumber}
                      startIcon={<CancelIcon />}
                    >
                      CANCEL NUMBER
                    </Button>
                  </Grid>
                  {/* Conditionally render the PASS TO CASHIER button based on accessId */}
                  {accessId === '2' && (
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        size='medium'
                        variant="contained"
                        sx={{ mt: 2, mb: 2, bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
                        onClick={passToCashier}
                        startIcon={<CashierIcon />}
                      >
                        PASS TO CASHIER
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
