import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import AssignmentIcon from '@mui/icons-material/AssignmentRounded';

const transaction = localStorage.getItem('TransactionAccess'); 

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href={"/" + transaction}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Transaction Control" />
    </ListItemButton>
    <ListItemButton href={"/TellerReports/" + transaction}>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
    <ListItemButton href="/SignInAccount" >
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </React.Fragment>
);