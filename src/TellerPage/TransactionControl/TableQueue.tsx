import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import Title from '../Title';

export default function BasicTable() {
  const [queueNumbers, setQueueNumbers] = useState<any[]>([]);

  useEffect(() => {
    const fetchQueueNumbers = async () => {
      const transaction = localStorage.getItem('TransactionAccess');
      let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
      let transactionCodes: { [key: string]: string } = {};
      transactionCodes = JSON.parse(transactionCodeString);
      let transactionCode = transactionCodes[transaction ?? ''];

      try {
        const response = await axios.get(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/transaction_log/get/toQueue/${transactionCode}`);
        setQueueNumbers(response.data);
      } catch (error) {
        console.error('Error fetching queue numbers:', error);
      }
    };

    fetchQueueNumbers(); // Initial fetch

    const intervalId = setInterval(fetchQueueNumbers, 1000); // Set interval to fetch every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ mt: 5, mb: 1 }}>
        <Grid container spacing={10}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Paper
            elevation={24}
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
              }}
            >
              <Title>Next in Queue</Title>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table" id="QueueTable">
                  <TableHead>
                    <TableRow>
                      <TableCell className='hiddenColumn'>Transaction Log ID</TableCell>
                      <TableCell className='hiddenColumn'>Transaction ID</TableCell>                      
                      <TableCell>Queue Number</TableCell>
                      <TableCell>Customer Account Number</TableCell>
                      <TableCell>Transaction</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell className='hiddenColumn'>Status</TableCell>
                      <TableCell className='hiddenColumn'>Claim Status</TableCell>
                      <TableCell id ='curentTransactionId' className='hiddenColumn'>Current Transaction ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(queueNumbers) ? queueNumbers.map((element, index) => (
                      <TableRow key={index}>
                        <TableCell className='hiddenColumn'>
                          {element.transaction_log_id}
                        </TableCell>
                        <TableCell className='hiddenColumn'>
                          {element.transaction_id}
                        </TableCell>
                        <TableCell>
                          {localStorage.getItem('AccessId') === '3' ? (
                            <span
                              style={{
                                color: element.transaction_pass === 'toClaim' ? 'green' : element.transaction_pass === 'toStop' ? 'red' : 'inherit',
                              }}
                            >
                              {element.transaction_ref || element.transactions_queue}
                            </span>
                          ) : localStorage.getItem('AccessId') === '2' ? (
                            element.transaction_ref || element.transactions_queue
                          ) : null}
                        </TableCell>
                        <TableCell>{element.customer_account_id}</TableCell>
                        <TableCell>
                          {element.transaction_desc === element.sub_transaction_desc
                            ? element.transaction_desc
                            : `${element.transaction_desc} ${element.sub_transaction_desc}`}
                        </TableCell>
                        <TableCell>{element.customer_first_name} {element.customer_last_name}</TableCell>
                        <TableCell className='hiddenColumn'>
                          {element.transaction_ref != null
                            ? ('isTransactionRef')
                            : element.transactions_queue
                            ? ('isNotTransactionRef')
                            : null }
                        </TableCell>
                        <TableCell className='hiddenColumn'>{element.transaction_pass}</TableCell>
                        <TableCell className='hiddenColumn'></TableCell>
                      </TableRow>
                    )): []}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}
