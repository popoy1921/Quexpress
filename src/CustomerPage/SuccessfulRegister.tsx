import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import Link from '@mui/material/Link';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import CustomButton from '../CommonElements/CustomButton'

const Logo = require('../Photos/coollogo_com-178391066.png');

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" fontFamily={"serif"} {...props}>
      {'Copyright © '}
      
      <Link color='inherit' href={'/'}>
        QuExpress
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUpCustomer() {
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  var accountId = useParams().AccountId;
  
  async function displayDetails(){
    console.log(1);
    if (!accountId) {
      console.error('Account ID not found');
      return;
    }
    const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/customer/get/${accountId}`)
    .then(function (response) {
      let CustomerAccountIdContainer = document.getElementById('CustomerAccountId') ?? document as unknown as HTMLElement;
      CustomerAccountIdContainer.innerText = 'Account ID: ' + accountId;
      let CustomerNameContainer = document.getElementById('CustomerName') ?? document as unknown as HTMLElement;
      CustomerNameContainer.innerText = 'Customer Name: ' + response.data.customer_first_name + ' ' + response.data.customer_last_name;
      let CustomerEmailContainer = document.getElementById('CustomerEmail') ?? document as unknown as HTMLElement;
      CustomerEmailContainer.innerText = 'Customer Email: ' + response.data.customer_email;
    })
    .catch(function (error) {
      setErrorMessage('Server Error');
      alert(' ' + error);
    });
  }

  displayDetails();
      // Send a request to your backend to retrieve user info based on the email
     
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" >
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
          <img src={Logo} width={500} alt="" />
          <Typography component="h1" variant="h5" fontFamily={"serif"} color={'grey'}>
            You have successfully registered!
            Please save information below
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} id='CustomerAccountId'>
                
              </Grid>
              <Grid item xs={12} sm={6} id='CustomerName'>
                
              </Grid>
              <Grid item xs={12} id='CustomerEmail'>
                
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} id='CustomerName'>
              <CustomButton
                details= {''}
                destination='/'
              >
                Return to Home Page
              </CustomButton>
            </Grid>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}