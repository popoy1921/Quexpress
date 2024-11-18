import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from 'axios';
import { Alert, CircularProgress, Container, Typography } from '@mui/material';
import "../../index.css";
import { format } from 'date-fns';


const App = () => {
  const [tableData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
interface Row {
  customer_id: number,
  account_id: string,
  customer_first_name: string,
  customer_last_name: string,
  customer_number: string,
  enabled_datetime :  string,
}

useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/customer/get`)
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

  const tableTransactionLogColumns = [
    {name : 'Customer Account ID'   , sortable: true, selector : (row : Row)  => row.account_id, cellExport: (row : Row) => row.account_id},
    {name : 'Customer Name'         , sortable: true, selector : (row : Row)  => row.customer_first_name +' '+ row.customer_last_name, cellExport: (row : Row) => row.customer_first_name + row.customer_last_name},
    {name : 'Contact Number'        , sortable: true, selector : (row : Row)  => row.customer_number, cellExport: (row : Row) => row.customer_number},
    {name : 'Date Registered'       , sortable: true, selector : (row : Row)  => format(new Date(row.enabled_datetime), 'MMMM d, yyyy'), cellExport: (row : Row) => format(new Date(row.enabled_datetime), 'MMMM d, yyyy')},
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
    export: false,
    print: false,
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
        </DataTableExtensions>
      )}
    </Container>
    
  );
};

export default App;
