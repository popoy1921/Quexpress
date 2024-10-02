import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from 'axios';
import { Container, CircularProgress, Typography, Alert } from '@mui/material';

const App = () => {
  const [tableData, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface Row {
    window_id: number;
    window_desc: string;
    transactions_queue: string;
  }

  useEffect(() => {
    // Fetch data when the component mounts
    axios.get(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/window/get`)
      .then(response => {
        setData(response.data); // Set the data for the table
        setLoading(false); // Turn off the loading indicator
      })
      .catch(err => {
        setError(err.message); // Set error if there is an issue
        setLoading(false); // Turn off the loading indicator
      });
  }, []); // Empty dependency array means this runs once on mount

  // Define the columns for the DataTable
  const tableTransactionLogColumns = [
    { name: 'Window Number', sortable: true, selector: (row: Row) => row.window_id },
    { name: 'Description', sortable: true, selector: (row: Row) => row.window_desc },
    { name: 'Queue Number', sortable: true, selector: (row: Row) => row.transactions_queue },
  ];

  const tableDataForTableExtension = {
    columns: tableTransactionLogColumns,
    data: tableData,
    export: false,
    print: false,
    filter: false,
  };

  return (
    <Container maxWidth='xl' sx={{ mt: 4 }}>
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
            style={{ boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }} // Add shadow to DataTable
          />
        </DataTableExtensions>
      )}
    </Container>
  );
};

export default App;
