import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BadgeIcon from '@mui/icons-material/BadgeRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/AssignmentRounded';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton href="/Admin">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton href="/AdminAccountManagement">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Account Management" />
    </ListItemButton>
    <ListItemButton href="/AdminStatusWindow">
      <ListItemIcon>
        <BadgeIcon />
      </ListItemIcon>
      <ListItemText primary="Status" />
    </ListItemButton>
    <ListItemButton href="/AdminReport">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
    <ListItemButton href="/AdminAds">
      <ListItemIcon>
        <PlayCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Ads Display" />
    </ListItemButton>
    <ListItemButton href="/AdminAnnouncement">
      <ListItemIcon>
        <AnnouncementIcon />
      </ListItemIcon>
      <ListItemText primary="Announcement" />
    </ListItemButton>
    <ListItemButton href="/SignInAdmin" >
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </React.Fragment>
);