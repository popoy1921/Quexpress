import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems } from '../ListItems';
import Queue from './Queued';
import Served from './Served';
import Cancel from './Cancel';
import TotalServed from './TotalServed';
import { useNavigate } from 'react-router-dom';

const Logo = require('../../Photos/coollogo_com-178391066.png');
const mLogo = require('../../Photos/lingayen-seal.png');

const userInfo = localStorage.getItem('User');
const Username = localStorage.getItem('Username');

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      QuExpress
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const defaultTheme = createTheme({
  typography: {
    fontFamily: 'serif',
  },
  palette: {
    primary: { main: '#228B22' },
  },
});

export default function Dashboard() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem('UserEmail')) {
      navigate('/SignInAdmin'); 
    }
  }, [navigate]);

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
              DASHBOARD
            </Typography>
            {Username && (
              <Typography variant="body1" color="inherit" sx={{ marginLeft: 2 }}>
                Welcome, {Username}
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <img src={Logo} width={180} alt="Logo" />
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Total Served - Larger and on its own row */}
              <Grid item xs={6}>
                <Paper
                  elevation={24}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '290px', // Set a fixed height for consistency
                    borderRadius: 2,
                  }}
                >
                  <TotalServed />
                </Paper>
              </Grid>

              {/* Second row with Queued, Served, and Cancelled */}
              <Grid container item spacing={3}>
                {/* Queued */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={24}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '290px',
                      borderRadius: 2,
                    }}
                  >
                    <Queue />
                  </Paper>
                </Grid>
                {/* Served */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={24}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '290px',
                      borderRadius: 2,
                    }}
                  >
                    <Served />
                  </Paper>
                </Grid>
                {/* Cancelled */}
                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={24}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '290px',
                      borderRadius: 2,
                    }}
                  >
                    <Cancel />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
            <div className="logo-container">
              <img 
                src={mLogo} 
                width={100} 
                alt="" 
              />
            </div>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
