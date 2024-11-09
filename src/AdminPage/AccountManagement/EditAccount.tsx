import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Background from '../../Photos/BackgroundDesktop.jpg';
import { useEffect, useState } from 'react';

// Import the logo image
const Logo = require('../../Photos/coollogo_com-178391066.png');

// Define default theme
const defaultTheme = createTheme({
  typography: {
    fontFamily: 'serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `url(${Background})`,
          backgroundSize: 'cover',
          backgroundattachment: 'fixed',
        }
      }
    }
  },
  palette: {
    primary: {main: '#228B22'},
  }
});

const Copyright = (props: any) => (
  <Typography variant="body2" color="text.secondary" align="center" fontFamily={"serif"} {...props}>
    {'Copyright © '}
      QuExpress
    {new Date().getFullYear()}
    {'.'}
  </Typography>
);


export default function EditAccount() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setUserRole(event.target.value);
  };

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [accessId, setAccessId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  var userId = useParams().UserId;

  useEffect(() => {
    
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/get_data/${userId}`);
        const userData = response.data;
        setFirstName(userData.user_first_name || '');
        setLastName(userData.user_last_name || '');
        setEmail(userData.user_name || '');
        setAccessId(String(userData.access_id) || '');
        setUserRole(userData.user_role || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch user details');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Empty dependency array means this effect runs only once

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !email || !password || !userRole) {
      setError('All fields are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email format');
      return;
    }

    const hashedPassword = bcrypt.hashSync(password as string, 10);
    console.log('Hashed Password:', hashedPassword);
    
    const validatePassword = (password: string): boolean => {
      // Regular expressions for each condition
      const hasCapital = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const isMinimumLength = password.length >= 8;

      return hasCapital && hasLowercase && hasNumber && isMinimumLength;
    }

    if (!validatePassword(password)) {
      setError('Password does not meet the criteria');
      return;
    }

    const userDetails = {
      firstName : firstName,
      lastName  : lastName,
      email     : email,
      password  : hashedPassword,
      userRole  : userRole,
    };
    updateUser(userDetails);
  }

  async function updateUser(userDetails : Object)
  {
    try {
      await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/update/${userId}`, userDetails).then(
        function () {
          alert('Update Successful');
          navigate('/AdminAccountManagement');
        }
      );
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user details');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
          }}
        >
          <img src={Logo} width={500} alt="Logo" />
          <Typography component="h1" variant="h3" fontFamily={"serif"} color={'grey'}>
            Update Account
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="userRole-label">User Role</InputLabel>
                  <Select
                    labelId="userRole-label"
                    id="userRole"
                    value={userRole}
                    label="User Role"
                    onChange={handleRoleChange}
                  >
                    {accessId === '2'
                    ? [
                        <MenuItem key="1" value="1">BPLO RECEIVING</MenuItem>,
                        <MenuItem key="2" value="2">CLEARANCE/ WORK PERMIT</MenuItem>,
                        <MenuItem key="3" value="3">BPLO CLAIM</MenuItem>,
                        <MenuItem key="4" value="4">SANITARY</MenuItem>,
                        <MenuItem key="5" value="5">BUILDING PERMIT</MenuItem>,
                        <MenuItem key="6" value="6">ZONING</MenuItem>,
                        <MenuItem key="7" value="7">FIRE SAFETY INSPECTION CERTIFICATE</MenuItem>,
                        <MenuItem key="8" value="8">BIRTH CERTIFICATE</MenuItem>,
                        <MenuItem key="9" value="9">DEATH CERTIFICATE</MenuItem>,
                        <MenuItem key="10" value="10">MARRIAGE CERTIFICATE</MenuItem>,
                        <MenuItem key="11" value="11">CORRECTION</MenuItem>,
                        <MenuItem key="12" value="12">LCR TO CLAIM</MenuItem>,
                        <MenuItem key="13" value="13">DTI REGISTRATION</MenuItem>
                      ]
                    : [
                        <MenuItem key="14" value="14">Cashier1</MenuItem>,
                        <MenuItem key="15" value="15">Cashier2</MenuItem>,
                        <MenuItem key="16" value="16">Cashier3</MenuItem>,
                        <MenuItem key="17" value="17">Cashier4</MenuItem>,
                        <MenuItem key="18" value="18">Cashier5</MenuItem>,
                        <MenuItem key="19" value="19">Cashier6</MenuItem>,
                        <MenuItem key="20" value="20">Cashier7</MenuItem>,
                        <MenuItem key="21" value="21">Cashier8</MenuItem>
                      ]
                  }
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 1 }} />
      </Container>
    </ThemeProvider>
  );
}
