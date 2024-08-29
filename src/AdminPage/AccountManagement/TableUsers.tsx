import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import axios from 'axios';
import { Button, Container } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Height } from '@mui/icons-material';

const App = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event : React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value?: string) => {
    setAnchorEl(null);
    if(value === 'Teller'){
      navigate('/SignUpTeller');
    } else {
      navigate('/SignUpCashier');
    }
  };
  const editAccount = (row: any) => {
    navigate('/EditAccount/' + row.user_id);
  };
  const deleteAccount = async (row: any) => {
    try {
      let userDetails = {
        firstName : row.user_first_name,
        lastName  : row.user_last_name,
        email     : row.user_name,
        removed   : 1
      };
      await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/update/${row.user_id}`, userDetails).then(
        function() {
          setData(
            tableData.filter(function(rowData : Row){
              return rowData.user_id != row.user_id;
            })
          );
          alert('Delete Successful');
        }
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const [tableData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  interface Row {
    user_id         : number,
    user_name       : string,
    access_id       : number,
    user_first_name :  string,
    user_last_name  :  string,
  }

  useEffect(() => {
    // Fetch data when the component mounts
    axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/get/all`)
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
    {name : 'ID'          , sortable: true, selector : (row : Row)  => row.user_id, Add: (row : Row) => row.user_id, omit: true},
    {name : 'Account'     , sortable: true, selector : (row : Row)  => row.user_name, Add: (row : Row) => row.user_name},
    {name : 'Access ID'   , sortable: true, selector : (row : Row)  => row.access_id, Add: (row : Row) => row.access_id},
    {name : 'First Name'  , sortable: true, selector : (row : Row)  => row.user_first_name, Add: (row : Row) => row.user_first_name},
    {name : 'Last Name'   , sortable: true, selector : (row : Row)  => row.user_last_name, Add: (row : Row) => row.user_last_name},
    {
      name : 'Actions', 
      cell: (row: any) => (
        <div>
          <Button onClick={() => editAccount(row)}>
            <EditIcon/>
          </Button>
          <Button onClick={() => deleteAccount(row)}>
            <DeleteIcon/>
          </Button>
        </div>
      )
    },
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
  };

  return (
    <div>
      <Button 
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          mt:2
        }}
        >
          <AddIcon/>Add New Account
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