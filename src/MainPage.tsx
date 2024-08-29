import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper } from '@mui/material';
import Link from '@mui/material/Link';
import { Navigate, useNavigate } from 'react-router-dom';


const Logo = require('./Photos/coollogo_com-178391066.png');
const MLogo = require('./Photos/lingayen-seal.png');



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


export default function MainPage() {
    
    const navigate = useNavigate();

    const proceedRegistration = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate('/SignUpCustomer');
    }
    
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
            <img src={MLogo} width={450} alt="" />
          <Box component="form" noValidate onSubmit={proceedRegistration} sx={{ mt: 3 }}>
            <Typography component="h1" variant="h5" fontFamily={"serif"} color={'grey'}>
              <center>A Queue Management System</center>
            </Typography>
            <Typography component="h1" variant="h5" fontFamily={"serif"} color={'grey'}>
              <center>for the Municipality of</center>
            </Typography>
            <Typography component="h1" variant="h3" fontFamily={"serif"} color={'grey'}>
              <center>LINGAYEN</center>
            </Typography>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Online Registration
            </Button>
          </Box>
        </Paper>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}