import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from 'axios';
import { Alert, CircularProgress, Container, Typography } from '@mui/material';
import { hover } from '@testing-library/user-event/dist/hover';

const App = () => {
  const [tableData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  interface Row {
    transactions_queue :  string,
    customer_account_id :  string,
    window_id :  string,
    staff_id :  string,
    transaction_starttime :  string,
    transaction_endtime :  string,
    transaction_status :  string,
    transaction_ref :  string
  }

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/all/notForQueue`)
      .then(response => {
        console.log(response.data);
        setData(response.data); // Set the data for the table
        setLoading(false); // Turn off the loading indicator
      })
      .catch(err => {
        setError(err.message); // Set error if there is an issue
        setLoading(false); // Turn off the loading indicator
      });
    }
    fetchData();
  }, []);

  

  // Define the columns for the DataTable
  const tableTransactionLogColumns = [
    {name : 'Transaction Queue'     , sortable: true, selector : (row : Row)  => row.transactions_queue, cellExport: (row : Row) => row.transactions_queue},
    {name : 'Customer Account ID'   , sortable: true, selector : (row : Row)  => row.customer_account_id, cellExport: (row : Row) => row.customer_account_id},
    {name : 'Window ID'             , sortable: true, selector : (row : Row)  => row.window_id, cellExport: (row : Row) => row.window_id},
    {name : 'Staff ID'              , sortable: true, selector : (row : Row)  => row.staff_id, cellExport: (row : Row) => row.staff_id},
    {name : 'Transaction Start Time', sortable: true, selector : (row : Row)  => row.transaction_starttime, cellExport: (row : Row) => row.transaction_starttime},
    {name : 'Transaction End Time'  , sortable: true, selector : (row : Row)  => row.transaction_endtime, cellExport: (row : Row) => row.transaction_endtime},
    {name : 'Transaction Status'    , sortable: true, selector : (row : Row)  => row.transaction_status, cellExport: (row : Row) => row.transaction_status},
    {name : 'Transaction Reference' , sortable: true, selector : (row : Row)  => row.transaction_ref, cellExport: (row : Row) => row.transaction_ref},
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const tableDataForTableExtension = {
    columns: tableTransactionLogColumns,
    data: tableData,
    filter: true,
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
            <div style={{ marginTop: '20px' }}>
            <DataTable
              columns={tableTransactionLogColumns}
              data={tableData}
              pagination
              responsive
              highlightOnHover
              pointerOnHover
              striped
              style={{ 
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
              }} 
            />
            </div>
        </DataTableExtensions>
      )}
    </Container>
    
  );
};

export default App;