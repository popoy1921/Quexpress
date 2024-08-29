import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from 'axios';
import { Container } from '@mui/material';

const App = () => {
  const [tableData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  interface Row {
    window_id :  number,
    window_desc : string,
    transactions_queue :  string,
  }

  useEffect(() => {
    // Fetch data when the component mounts
    axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/window/get`)
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
    {name : 'Window Number' , sortable: true, selector : (row : Row)  => row.window_id},
    {name : 'Description'   , sortable: true, selector : (row : Row)  => row.window_desc},
    {name : 'Queue Number'  , sortable: true, selector : (row : Row)  => row.transactions_queue},
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
    export: false,
    print: false,
    Filter: false,
  };

  return (
    <div>
      <DataTableExtensions {...tableDataForTableExtension}>
        <Container maxWidth='xl' sx={{mt:2}}>
          <DataTable
            columns={tableTransactionLogColumns}
            data={tableData}
            pagination
          />
        </Container>
      </DataTableExtensions>
    </div>
    
  );
};

export default App;