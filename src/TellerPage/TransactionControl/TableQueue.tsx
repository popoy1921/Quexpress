import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState } from 'react';
import { Container, Grid, Box } from '@mui/material';
import Title from '../Title';

export default function BasicTable() {  
  setInterval(populateTable, 1000);

  async function populateTable() {
    const transaction = localStorage.getItem('TransactionAccess');
    let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
    let transactionCodes : {[key: string]: string}= {};
    transactionCodes = JSON.parse(transactionCodeString);
    let transactionCode = transactionCodes[transaction ?? ''];
    
    
    const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionCode}/toQueue`)
    .then(async function (response) {
      let queueNumbers = response.data;
      let newRow;
      let columnQueueNumber;
      let columnCustomerAccountId;
      let tableQueue = document.getElementById('QueueTable') ?? document;
      let tableQueueBody = tableQueue.getElementsByTagName('tbody')[0];
      tableQueueBody.innerHTML = "";
      queueNumbers.forEach(function (element : any) {
        newRow = document.createElement('tr');
        columnQueueNumber = document.createElement('td');
        columnCustomerAccountId = document.createElement('td');
        setColumnProperties(columnQueueNumber, element.transactions_queue);
        setColumnProperties(columnCustomerAccountId, element.customer_account_id);
        newRow.append(columnQueueNumber);
        newRow.append(columnCustomerAccountId);
        setRowProperties(newRow);
        tableQueueBody.append(newRow);
      });
    });
  }

  function setColumnProperties(column : any, content : string)
  {
    const columnClasses = [
      'MuiTableCell-root',
      'MuiTableCell-body',
      'MuiTableCell-alignRight',
      'MuiTableCell-sizeMedium',
      'css-177gid-MuiTableCell-root',
      'text-left'
    ];

    columnClasses.forEach(function(className){
      column.classList.add(className);
    });
    column.append(content);
  }

  function setRowProperties(row : any)
  {
    const rowClasses = [
      'MuiTableRow-root',
      'css-34nofg-MuiTableRow-root'
    ];

    rowClasses.forEach(function(className){
      row.classList.add(className);
    });
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg" sx={{ mt: 5, mb: 1 }}>
        <Grid container spacing={10}>
            <Grid item xs={1}/>
            <Grid item xs={10}>
                <Paper
                    sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 300,
                    }}
                >
                <Title>Next in Queue</Title>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table" id="QueueTable">
                      <TableHead>
                        <TableRow>
                          <TableCell>Queue Number</TableCell>
                          <TableCell>Customer Account Number</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
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
