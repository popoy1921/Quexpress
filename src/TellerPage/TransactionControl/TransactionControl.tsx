import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import returnDateTime from '../../TimeStamp';
import { useParams } from 'react-router-dom';
import NextIcon from '@mui/icons-material/ArrowForward'; // Next button icon
import CallIcon from '@mui/icons-material/Call'; // Call button icon
import CancelIcon from '@mui/icons-material/Cancel'; // Cancel button icon
import CashierIcon from '@mui/icons-material/AttachMoney'; // Pass to cashier button icon
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { useState } from 'react';

const { formattedDate } = returnDateTime();
const transactionAccess = localStorage.getItem('TransactionAccess');

export default function TransactionControl() {  
  let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
  let transactionCodes: { [key: string]: string } = {};
  transactionCodes = JSON.parse(transactionCodeString);
  let transactionCode = transactionCodes[useParams().TransactionCode ?? ''];

  const [accessId, setAccessId] = React.useState(localStorage.getItem('AccessId'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [nowServing, setNowServing] = useState(localStorage.getItem(transactionCode + 'NowServing') || 'No Available Number');
  const [nowTransactionPass, setnowTransactionPass] = useState(localStorage.getItem('TransactionPass') || null);
  const [nowServingColor, setNowServingColor] = useState('black'); // Default color

  // Set interval to update accessId
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newAccessId = localStorage.getItem('AccessId');
      if (newAccessId !== accessId) {
        setAccessId(newAccessId);
      }
    }, 2000); // Update every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [accessId]);

  // Effect to update nowServing and its color
  React.useEffect(() => {
    const updateNowServing = () => {
      let newNowServing = localStorage.getItem(transactionCode + 'NowServing') || 'No Available Number';
      if (newNowServing === '0') {
        newNowServing = 'No Available Number';
        setNowServing(newNowServing);
      } else {
        setNowServing(newNowServing);
      }
      const nowTransactionPass = localStorage.getItem('TransactionPass') || null;
      setnowTransactionPass(nowTransactionPass);
    };

    updateNowServing(); // Initial update
    const interval = setInterval(updateNowServing, 1000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [transactionCode]);

  // async function updateForMonitorBlink(transactionCode: string) {
  //   await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateBlink/` + transactionCode, { 'blink': 1 });
  // }

  function nextNumber(event: any) {
    event.preventDefault();
    updateNumber('done');
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      // updateForMonitorBlink(transactionCode);
    }
  }

  function callAgain(event: any) {
    event.preventDefault();
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      // updateForMonitorBlink(transactionCode);
    }
  }

  function cancelNumber(event: any) {
    event.preventDefault();
    let transactionRef = localStorage.getItem(transactionCode + 'NowServing') as string;
    toEnd(transactionRef);
    updateTransactionStatus('cancelled');
    getNumber();
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      // updateForMonitorBlink(transactionCode);
    }
  }

  function updateNumber(nextTransactionStatus: string) {
    updateTransactionStatus(nextTransactionStatus);
    getNumber();
  }

  async function toEnd(transactionRef: string) {
    let date: Date = new Date();
    let transactionQueue = localStorage.getItem(transactionCode + 'NowServing');
    let isTransactionRef = localStorage.getItem('IsTransactionRef');
    let transactionData: any = {};
    console.log(isTransactionRef)
    
    if (!transactionData.transactionRef) {
      if (accessId === '2') {
        if (transactionCode === 'BPLO3') {
          if (transactionQueue) {
            if (isTransactionRef === 'isTransactionRef'){
              transactionData.transactionRef = transactionQueue;
              transactionData.forClaim = true;         
            } else {
              transactionData.transactionQueue = transactionQueue;
            }
          }
        } else if (transactionCode === 'BPLO2') {
          if (transactionQueue) {
            if (isTransactionRef === 'isTransactionRef'){
              transactionData.transactionRef = transactionQueue;
              transactionData.forClaim = true;         
            } else {
              transactionData.transactionQueue = transactionQueue;
            }
          }
        } else if (transactionCode === 'LCRT') {
          if (transactionQueue) {
            if (isTransactionRef === 'isTransactionRef'){
              transactionData.transactionRef = transactionQueue;
              transactionData.forClaim = true;         
            } else {
              transactionData.transactionQueue = transactionQueue;
            }
          }
        } else {
          transactionData.transactionQueue = transactionQueue;
        }
      } else if (accessId === '3') {
        if (transactionCode === 'CSH1' || transactionCode === 'CSH2' || transactionCode === 'CSH7' || transactionCode === 'CSH8') {
          if (transactionQueue) {
            if (isTransactionRef === 'isTransactionRef'){
              transactionData.transactionRef = transactionQueue;
              transactionData.forCashier = true;         
            } else {
              transactionData.transactionQueue = transactionQueue;
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

    const params = new URLSearchParams(transactionData).toString();
    console.log(params)
    await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get_count?${params}`)
      .then(async response2 => {
      console.log(response2.data[0].finalcount);
      if(response2.data[0].finalcount <= 2){
        await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get?${params}`)
          .then(async response => {
            var responseData = response.data[0];
            const createData = {
              transactionId: responseData.transaction_id,
              customerId: responseData.customer_id,
              customerAccountId: responseData.customer_account_id,
              queueNumber: responseData.transactions_queue,
              windowId: null,
              staffId: null,
              date: formattedDate,
              startTime: null,
              endTime: null,
              refQueueNumber: responseData.transaction_ref,
              transactionStatus: null,
              transactionPass: responseData.transaction_pass,
            };            
            createLog(createData);
            }
          )
          .catch(function (error) {
            alert(' ' + error);
          });
        }
      })
      .catch(function (error) {
        alert(' ' + error);
      });
  }

  async function updateTransactionStatus(nextTransactionStatus: string) {
    // current number move to done
    let date: Date = new Date();
    let transactionQueue = localStorage.getItem(transactionCode + 'NowServing');
    let isTransactionRef = localStorage.getItem('IsTransactionRef');
    let transactionLogId = localStorage.getItem('TransactionLogID');
    let transactionData: any = {
      transactionLogId: transactionLogId,
      status: nextTransactionStatus,
      transactionEndTime: format(date, 'HH:mm:ss'),
    };

    if (!transactionData.transactionRef) {
      if (accessId === '2') {
        if (transactionCode === 'BPLO3') {
          if (transactionQueue) {
            if (transactionQueue.startsWith('BPT') || transactionQueue.startsWith('BST') || transactionQueue.startsWith('BBT') || transactionQueue.startsWith('BZT') || transactionQueue.startsWith('BFT') || transactionQueue.startsWith('POT')) {
              transactionData.transactionQueue = transactionQueue;
            } else {
              transactionData.transactionRef = transactionQueue;
              transactionData.forClaim = true;
            }
          }
        } else if (transactionCode === 'BPLO2') {
          if (transactionQueue) {
            if (isTransactionRef === 'isTransactionRef'){
              transactionData.transactionRef = transactionQueue;
              transactionData.forClaim = true;         
            } else {
              transactionData.transactionQueue = transactionQueue;
            }
          }
        } else if (transactionCode === 'LCRT') {
          if (transactionQueue) {
            if (transactionQueue.startsWith('LBT') || transactionQueue.startsWith('LDT') || transactionQueue.startsWith('LMT') || transactionQueue.startsWith('LCT') || transactionQueue.startsWith('LTC')) {
              transactionData.transactionQueue = transactionQueue;
            } else {
              transactionData.transactionRef = transactionQueue;
              transactionData.forClaim = true;
            }
          }
        } else {
          transactionData.transactionQueue = transactionQueue;
        }
      } else if (accessId === '3') {
        if (transactionCode === 'CSH1' || transactionCode === 'CSH2' || transactionCode === 'CSH7' || transactionCode === 'CSH8') {
          if (transactionQueue) {
            if (transactionQueue.startsWith('BPP') || transactionQueue.startsWith('POP') || transactionQueue.startsWith('VLP') || transactionQueue.startsWith('OTP') || transactionQueue.startsWith('LBP') || transactionQueue.startsWith('LDP') || transactionQueue.startsWith('LMP') || transactionQueue.startsWith('LCP')
              || transactionQueue.startsWith('BSP') || transactionQueue.startsWith('BBP') || transactionQueue.startsWith('BZP') || transactionQueue.startsWith('BFP') || transactionQueue.startsWith('MYP') || transactionQueue.startsWith('WPP')) {
              transactionData.transactionQueue = transactionQueue;
            } else {
              transactionData.transactionRef = transactionQueue;
              transactionData.forCashier = true;
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
            case 'DTIM':
              windowData.windowId = 13;
              break;
            case 'CSH1':
            windowData.windowId = 14;
            if (transactionQueue) {
              if (transactionQueue.startsWith('BPP') || transactionQueue.startsWith('POP') || transactionQueue.startsWith('BSP') || transactionQueue.startsWith('BBP') || transactionQueue.startsWith('BZP') || transactionQueue.startsWith('BFP') || transactionQueue.startsWith('MYP') || transactionQueue.startsWith('WPP')) {
                windowData.windowId = 14;
              }
            }
            break;
          case 'CSH2':
            windowData.windowId = 15;
            if (transactionQueue) {
              if (transactionQueue.startsWith('BPP') || transactionQueue.startsWith('POP') || transactionQueue.startsWith('BSP') || transactionQueue.startsWith('BBP') || transactionQueue.startsWith('BZP') || transactionQueue.startsWith('BFP') || transactionQueue.startsWith('MYP') || transactionQueue.startsWith('WPP')) {
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
    let transactionLogId = '';
    let isTransactionRef = '';
    let transactionPass = '';
  
    if (rows.length > 0) {
      // move next number to on going
      queueNumber = rows[0].getElementsByTagName("td")[1].innerText;
      transactionLogId = rows[0].getElementsByTagName("td")[0].innerHTML;
      isTransactionRef = rows[0].getElementsByTagName("td")[5].innerHTML;
      transactionPass  = rows[0].getElementsByTagName("td")[6].innerHTML;
      let transactionData: any = {
        transactionLogId: transactionLogId,
        transactionStartTime: format(date, 'HH:mm:ss'),
        status: 'on going',
      }
  
      if (accessId === '2') {
        if (transactionCode === 'BPLO3') {
          if (queueNumber) {
            
            if (queueNumber.startsWith('BPT') || queueNumber.startsWith('BST') || queueNumber.startsWith('BBT') || queueNumber.startsWith('BZT') || queueNumber.startsWith('BFT') || queueNumber.startsWith('POT')) {
              transactionData.transactionQueue = queueNumber;
            } else {
              transactionData.transactionRef = queueNumber;
              transactionData.forClaim = true;
            }
          }
        } else if (transactionCode === 'BPLO2') {
          if (queueNumber) {
            if (isTransactionRef === 'isTransactionRef'){
              transactionData.transactionRef = queueNumber;
              transactionData.forClaim = true;         
            } else {
              transactionData.transactionQueue = queueNumber;
            }
          }
        }  else if (transactionCode === 'LCRT') {
          if (queueNumber) {
            if (queueNumber.startsWith('LBT') || queueNumber.startsWith('LDT') || queueNumber.startsWith('LMT') || queueNumber.startsWith('LCT') || queueNumber.startsWith('LTC')) {
              transactionData.transactionQueue = queueNumber;
            } else {
              transactionData.transactionRef = queueNumber;
              transactionData.forClaim = true;
            }
          }
        } else {
          transactionData.transactionQueue = queueNumber;
        }
      } else if (accessId === '3') {
        if (transactionCode === 'CSH1' || transactionCode === 'CSH2' || transactionCode === 'CSH7' || transactionCode === 'CSH8') {
          if (queueNumber) {
            if (queueNumber.startsWith('BPP') || queueNumber.startsWith('POP') || queueNumber.startsWith('VLP') || queueNumber.startsWith('OTP') || queueNumber.startsWith('LBP') || queueNumber.startsWith('LDP') || queueNumber.startsWith('LMP') || queueNumber.startsWith('LCP')  || queueNumber.startsWith('MYP') || queueNumber.startsWith('WPP') || queueNumber.startsWith('BSP') || queueNumber.startsWith('BBP') || queueNumber.startsWith('BZP') || queueNumber.startsWith('BFP')) {
              transactionData.transactionQueue = queueNumber;
            } else {
              transactionData.transactionRef = queueNumber;
              transactionData.forCashier = true;
              setNowServingColor(transactionPass === 'toClaim' ? 'green' : 'red');
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
            case 'DTIM':
              windowData.windowId = 13;
              break;
            case 'CSH1':
              windowData.windowId = 14;
              if (queueNumber.startsWith('BPP') || queueNumber.startsWith('POP') || queueNumber.startsWith('BSP') || queueNumber.startsWith('BBP') || queueNumber.startsWith('BZP') || queueNumber.startsWith('BFP') || queueNumber.startsWith('MYP') || queueNumber.startsWith('WPP')) {
                windowData.windowId = 14;
              }
              break;
            case 'CSH2':
              windowData.windowId = 15;
              if (queueNumber.startsWith('BPP') || queueNumber.startsWith('POP') || queueNumber.startsWith('BSP') || queueNumber.startsWith('BBP') || queueNumber.startsWith('BZP') || queueNumber.startsWith('BFP') || queueNumber.startsWith('MYP') || queueNumber.startsWith('WPP')) {
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
      setNowServingColor('black');
    }
  
    let nowServingContainer = document.getElementById('nowServing') ?? document as any;
    if (nowServingContainer.innerText !== '') {
      localStorage.setItem(transactionCode + 'NowServing', nowServingContainer.innerText);
      localStorage.setItem('IsTransactionRef', isTransactionRef);
      localStorage.setItem('TransactionLogID', transactionLogId);
      localStorage.setItem('TransactionPass', transactionPass);
    }
  }

  function passToCashier(event: any) {
    event.preventDefault();
    setDialogOpen(true);
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      // updateForMonitorBlink(transactionCode);
    }
  }

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setDialogOpen(false);
    let transactionRef = localStorage.getItem(transactionCode + 'NowServing') as string;
    if (option === 'Pay to Claim') {

      toCashier(transactionRef, 'toClaim');
      updateNumber('done');
    } else if (option === 'Pay to Stop') {
      
      toCashier(transactionRef, 'toStop');
      updateNumber('done');
    }
  };

  async function toCashier(transactionRef: string, passTo: string) {
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
        if(transactionRef.startsWith('BP') || transactionRef.startsWith('MY') || transactionRef.startsWith('WP') || transactionRef.startsWith('BS') || transactionRef.startsWith('BB') || transactionRef.startsWith('BZ') || transactionRef.startsWith('BF') || transactionRef.startsWith('PO')){
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
            refQueueNumber: transactionRef,
            transactionPass: passTo,
          };
          createLog(transactionData);
        } else if(transactionRef.startsWith('LC') || transactionRef.startsWith('LB') || transactionRef.startsWith('LD') || transactionRef.startsWith('LM')){
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
            refQueueNumber: transactionRef,
            transactionPass: passTo,
          };
        createLog(transactionData);
        }
      })
      .catch(function (error) {
        alert(' ' + error);
      });
  }

  function passToClaim(event: any) {
    event.preventDefault();
    let transactionRef = localStorage.getItem(transactionCode + 'NowServing') as string;
    toClaim(transactionRef);
    updateNumber('done');
    if (document.getElementById('nowServing')?.innerText !== 'No Available Number') {
      // updateForMonitorBlink(transactionCode);
    }
  }

  async function toClaim(transactionRef: string) {
    await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionRef}`)
      .then(async function (response) {
        const currentDate = localStorage.getItem('currentDate');
        const dateToday = format(new Date(), "yyyy-MM-dd");
        // reset counters
        if (currentDate !== dateToday) {
          localStorage.setItem('currentDate', dateToday);
          localStorage.setItem('CLAIM' + '#', '0');
        }
        // get current counter
        let transactionCodeCounter: any = (parseInt(localStorage.getItem('CLAIM' + '#') ?? '0') + 1).toString().padStart(5, '0');
        localStorage.setItem('CLAIM' + '#', transactionCodeCounter);
        
        var responseData = response.data;
        if(transactionRef.startsWith('BP') || transactionRef.startsWith('BS') || transactionRef.startsWith('BB') || transactionRef.startsWith('BZ') || transactionRef.startsWith('BF') || transactionRef.startsWith('BC') || transactionRef.startsWith('PO') || transactionRef.startsWith('WP') || transactionRef.startsWith('MY')){
          const transactionData = {
            transactionId: responseData.transaction_id,
            customerId: responseData.customer_id,
            customerAccountId: responseData.customer_account_id,
            queueNumber: 'BTC' + transactionCodeCounter,
            windowId: null,
            staffId: null,
            date: formattedDate,
            startTime: null,
            endTime: null,
            refQueueNumber: transactionRef,
          };
          createLog(transactionData);
        } else if(transactionRef.startsWith('LC') || transactionRef.startsWith('LB') || transactionRef.startsWith('LD') || transactionRef.startsWith('LM')){
          const transactionData = {
            transactionId: responseData.transaction_id,
            customerId: responseData.customer_id,
            customerAccountId: responseData.customer_account_id,
            queueNumber: 'LTC' + transactionCodeCounter,
            windowId: null,
            staffId: null,
            date: formattedDate,
            startTime: null,
            endTime: null,
            refQueueNumber: transactionRef,
          };
        createLog(transactionData);
        }
        else if(transactionRef.startsWith('MY') || transactionRef.startsWith('WP')){
          const transactionData = {
            transactionId: responseData.transaction_id,
            customerId: responseData.customer_id,
            customerAccountId: responseData.customer_account_id,
            queueNumber: responseData.transactionRef,
            windowId: null,
            staffId: null,
            date: formattedDate,
            startTime: null,
            endTime: null,
            refQueueNumber: transactionRef,
          };
        createLog(transactionData);
        }
      })
      .catch(function (error) {
        alert(' ' + error);
      });
  }

  function createLog(transactionData: Object) {
    console.log(transactionData)
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
                sx={{ color: nowServingColor, fontWeight: 'bold'
               }}
              >
                {nowServing}
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
                  {(accessId === '2' && transactionCode !== 'BPLO3' && transactionCode !== 'DTIM' && transactionCode !== 'LCRT') && (
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
                  {/* Dialog for selection */}
                  <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    PaperProps={{
                      sx: { padding: 2, borderRadius: 2, boxShadow: 5 },
                    }}
                  >
                    <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                      Choose an Option
                    </DialogTitle>
                    <DialogContent>
                      <Typography
                        variant="body1"
                        sx={{ textAlign: 'center', fontSize: '1.1rem', color: 'text.secondary', mb: 2 }}
                      >
                        Please select one of the following actions:
                      </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                      <Button
                        onClick={() => handleOptionSelect('Pay to Claim')}
                        variant="contained"
                        sx={{
                          bgcolor: '#388e3c',
                          color: '#fff',
                          '&:hover': { bgcolor: '#2e7d32' },
                          px: 3,
                          py: 1.5,
                          fontWeight: 'bold',
                        }}
                      >
                        Pay to Claim
                      </Button>
                      <Button
                        onClick={() => handleOptionSelect('Pay to Stop')}
                        variant="contained"
                        sx={{
                          bgcolor: '#d32f2f',
                          color: '#fff',
                          '&:hover': { bgcolor: '#c62828' },
                          px: 3,
                          py: 1.5,
                          fontWeight: 'bold',
                        }}
                      >
                        Pay to Stop
                      </Button>
                    </DialogActions>
                  </Dialog>


                  {/* Conditionally render the PASS TO CLAIM button based on transactionCode */}
                  {(transactionCode === 'CSH1' || transactionCode === 'CSH2' || transactionCode === 'CSH7' || transactionCode === 'CSH8') && (
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        size="medium"
                        variant="contained"
                        sx={{ mt: 2, mb: 2, bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
                        onClick={passToClaim}
                        startIcon={<DriveFileMoveIcon />}
                      >
                        PASS TO CLAIM
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
