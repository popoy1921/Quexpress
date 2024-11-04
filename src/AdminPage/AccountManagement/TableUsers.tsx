import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from 'axios';
import { Button, Container, CircularProgress, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Define the Row interface
interface Row {
  user_id: number;
  user_name: string;
  access_id: number;
  user_first_name: string;
  user_last_name: string;
}

const App = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [tableData, setData] = useState<Row[]>([]); // Use Row type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget);
  };

  const handleClose = (value?: string) => {
      setAnchorEl(null);
      if (value === 'Teller') {
          navigate('/SignUpTeller');
      } else if (value === 'Cashier') {
          navigate('/SignUpCashier');
      } else {
        
      }
  };

  const editAccount = (row: Row) => { // Use Row type
      navigate('/EditAccount/' + row.user_id);
  };

  const deleteAccount = async (row: Row) => { // Use Row type
      try {
          let userDetails = {
              firstName: row.user_first_name,
              lastName: row.user_last_name,
              email: row.user_name,
              removed: 1
          };
          await axios.put(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/users/update/${row.user_id}`, userDetails);
          setData(prevData => prevData.filter(item => item.user_id !== row.user_id));
          setSnackbarMessage('Delete Successful');
          setOpenSnackbar(true);
      } catch (error) {
          console.error('Error updating user:', error);
          setSnackbarMessage('Error deleting account');
          setOpenSnackbar(true);
      }
  };

  useEffect(() => {
      // Fetch data when the component mounts
      axios.get(`${process.env.REACT_APP_OTHER_BACKEND_SERVER}/users/get/all`)
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
      { name: 'ID', sortable: true, selector: (row: Row) => row.user_id, omit: true },
      { name: 'Account', sortable: true, selector: (row: Row) => row.user_name },
      { name: 'Access ID', sortable: true, selector: (row: Row) => row.access_id },
      { name: 'First Name', sortable: true, selector: (row: Row) => row.user_first_name },
      { name: 'Last Name', sortable: true, selector: (row: Row) => row.user_last_name },
      {
          name: 'Actions',
          cell: (row: Row) => (
              <div>
                  <Button onClick={() => editAccount(row)} color="primary">
                      <EditIcon />
                  </Button>
                  <Button onClick={() => deleteAccount(row)} color="error">
                      <DeleteIcon />
                  </Button>
              </div>
          )
      },
  ];

  const tableDataForTableExtension = {
      columns: tableTransactionLogColumns,
      data: tableData,
      export: false,
      print: false,
  };

  return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
          >
              Add New Account
          </Button>
          <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={() => handleClose()}
              MenuListProps={{
                  'aria-labelledby': 'basic-button',
              }}
          >
              <MenuItem onClick={() => handleClose('Teller')}>Teller Account</MenuItem>
              <MenuItem onClick={() => handleClose('Cashier')}>Cashier Account</MenuItem>
          </Menu>

          {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>
                  <CircularProgress />
              </div>
          ) : error ? (
              <div style={{ textAlign: 'center', color: 'red', marginTop: '20%' }}>
                  <h2>Error: {error}</h2>
              </div>
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

          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
              <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                  {snackbarMessage}
              </Alert>
          </Snackbar>
      </Container>
  );
};

export default App;

