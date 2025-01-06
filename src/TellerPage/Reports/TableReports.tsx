import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from 'axios';
import { Alert, CircularProgress, Container, Typography } from '@mui/material';
import "../../index.css";
import { format } from 'date-fns';

const App = () => {
  const [tableData, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessid = localStorage.getItem('AccessId');

  interface Row {
    transactions_queue :  string,
    transaction_ref :  string,
    customer_first_name : string,
    customer_last_name : string,
    customer_account_id :  string,
    window_id :  string,
    transaction_desc : string,
    sub_transaction_desc : string,
    staff_id :  string,
    transaction_datetime :  string,
    transaction_starttime :  string,
    transaction_endtime :  string,
    transaction_status :  string,
  }

  useEffect(() => {
    const transaction = localStorage.getItem('TransactionAccess');
    let transactionCodeString = localStorage.getItem('TransactionCodes') as string;
    let transactionCodes : {[key: string]: string}= {};
    transactionCodes = JSON.parse(transactionCodeString);
    let transactionCode = transactionCodes[transaction ?? ''];

    const queryParams = new URLSearchParams({
      transactionCode: transactionCode,
      queue: 'notForQueue',
    }).toString();

    axios.get(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/transaction_log/get/get_queue?${queryParams}`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setData(response.data); // Set the data for the table
        } else {
          console.error("API response is not an array:", response.data);
          setData([]); // Default to an empty array
        }
        setLoading(false); // Turn off the loading indicator
      })
      .catch(err => {
        setError(err.message); // Set error if there is an issue
        setLoading(false); // Turn off the loading indicator
      });
  }, []); // Empty dependency array means this runs once on mount

  // Define the columns for the DataTable
  const tableTransactionLogColumns = [
    {
      name: 'Transaction Reference', 
      sortable: true,
      selector: (row: Row) => row.transaction_ref != null ? row.transaction_ref : row.transactions_queue,
      cellExport: (row: Row) => row.transaction_ref != null ? row.transaction_ref : row.transactions_queue,
    },
    {name : 'Customer Account ID'   , sortable: true, selector : (row : Row)  => row.customer_account_id, cellExport: (row : Row) => row.customer_account_id},
    {name : 'Customer Name'         , sortable: true, selector : (row : Row)  => row.customer_first_name +' '+ row.customer_last_name, cellExport: (row : Row) => row.customer_first_name + row.customer_last_name},
    {name : 'Transaction'           , sortable: true, selector : (row : Row)  => row.transaction_desc +' '+ row.sub_transaction_desc, cellExport: (row : Row) => row.transaction_desc +' '+ row.sub_transaction_desc},
    {name : 'Staff ID'              , sortable: true, selector : (row : Row)  => row.staff_id, cellExport: (row : Row) => row.staff_id},
    {name : 'Date'                  , sortable: true, selector : (row : Row)  => format(new Date(row.transaction_datetime), 'MMMM d, yyyy'), cellExport: (row : Row) => format(new Date(row.transaction_datetime), 'MMMM d, yyyy')},
    {name : 'Start Time'            , sortable: true, selector : (row : Row)  => row.transaction_starttime, cellExport: (row : Row) => row.transaction_starttime},
    {name : 'End Time'              , sortable: true, selector : (row : Row)  => row.transaction_endtime, cellExport: (row : Row) => row.transaction_endtime},
    {name : 'Transaction Status'    , sortable: true, selector : (row : Row)  => row.transaction_status, cellExport: (row : Row) => row.transaction_status},
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const tableDataForTableExtension = {
    columns: tableTransactionLogColumns,
    data: tableData
  };

  return (
    <Container maxWidth='xl' sx={{ mt: 2 }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading Data...</Typography>
        </div>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      ) : (
        <DataTableExtensions {...tableDataForTableExtension}>
              <DataTable
                columns={tableTransactionLogColumns}
                data={tableData || []}
                pagination
                responsive
                highlightOnHover
                pointerOnHover
                striped
                style={{ 
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                }} 
              />
        </DataTableExtensions>
      )}
    </Container>
  );
};

export default App;