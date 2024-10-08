import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Background from '../Photos/BackgroundDesktop.jpg';
import DigitalClock from './DigitalClock';

const Ping = require('../Sounds/din-ding-89718.mp3');
const Logo = require('../Photos/coollogo_com-178391066.png');
const MLogo = require('../Photos/lingayen-seal.png');

const audio = new Audio(Ping);

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" fontFamily={"serif"} {...props}>
      {'Copyright © '}
        QuExpress
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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

function playSound() {
  if (audio) {
    audio.currentTime = 0; 
    audio.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  }
}

function useTransactionData(transactionCode: string) {
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        let queueNumber = '';
        if(transactionCode === 'CSH') {
          const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/CSH/${transactionCode}`);
          queueNumber = response.data.transaction_ref;
        } else {
          const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionCode}`);
          queueNumber = response.data.transactions_queue;
        }
        let nowServingContainer = document.getElementById('NowServing' + transactionCode);
        if (nowServingContainer) {
          const blinkResponse = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transactions/getBlink/${transactionCode}`);
          if (blinkResponse.data['blink'] === 1) {
            nowServingContainer.innerText = queueNumber;
            playSound();
            nowServingContainer.classList.add('animate');

            setTimeout(async() => {
              await axios.put(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/updateBlink/` + transactionCode, {'blink' : 0});
              if (nowServingContainer) {
                nowServingContainer.classList.remove('animate');
              }
            }, 2000);
          } else if (queueNumber === undefined) {
            nowServingContainer.innerText = transactionCode+'00000';
            nowServingContainer.style.opacity = '0';
          }
          else {
            nowServingContainer.innerText = queueNumber;
            nowServingContainer.style.opacity = '1';
          }
        }
      } catch (error) {
        console.error('Error fetching transaction status:', error);
      }
    }, 3000); 

    return () => clearInterval(interval); 
  }, [transactionCode]);
}

export default function DisplayMonitor() {
  const [videoUrl, setVideoUrl] = React.useState<string | null>('');
  const [vidKey, setVidKey] = React.useState<any>('');; 
  const [showVideoAd, setShowVideoAd] = React.useState(true);
  const [announcement, setAnnouncement] = React.useState<string>('');

  const handleVideoEnd = () => {
    setShowVideoAd(false); 
  };

  var currentAdvertisementLink = '';
  function updateDisplayedAdsLink () {
    var displayAsInterval = setInterval(async () => {
      axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/getAdvertisement`)
      .then(response => {
        if (currentAdvertisementLink !== response.data.advertisement) {
          currentAdvertisementLink = response.data.advertisement;
          setVideoUrl(currentAdvertisementLink);
          setVidKey(currentAdvertisementLink);
        }
      })
      .catch(err => {
        console.log(err);
      })
    }, 3000);
  }

  var currentAnnouncement = '';
  function updateDisplayedAnnouncement () {
    var displayAsInterval = setInterval(async () => {
      axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + '/users/getAnnouncement')
      .then(response => {
        if (currentAnnouncement !== response.data.announcement) {
          currentAnnouncement = response.data.announcement;
          setAnnouncement(currentAnnouncement);
        }
      })
      .catch(err => {
        console.log(err);
      })
    }, 3000);
  }

  React.useEffect(() => {
    updateDisplayedAdsLink();
    updateDisplayedAnnouncement();
  }, []);

  function callMe() {
    console.log(1);
  }

  useTransactionData('BPS');
  useTransactionData('BPB');
  useTransactionData('BPZ');
  useTransactionData('BPF');
  useTransactionData('LCB');
  useTransactionData('LCD');
  useTransactionData('LCM');
  useTransactionData('CDL');
  useTransactionData('RPT');
  useTransactionData('CSH');

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        {/* First part for the logo */}
        <Grid item xs={12} sm={6}>
          <center>
            <img src={Logo} width={550} alt="" />
            <Paper
              elevation={24}
              sx={{
                margin: 1,
                display: 'flex',
                flexDirection: 'column',
                p: 1.5,
                opacity: 0.95,
              }}
            >
              <center>
              <DigitalClock />
              {/* Show video advertisement if available, fallback to logo otherwise */}
                {showVideoAd && videoUrl ? (
                  <video key={vidKey} width={850} height={600} autoPlay loop muted onEnded={handleVideoEnd}>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img src={MLogo} width={600} height={600} alt="MLogo" />
                )}

                {/* Scrolling Announcement */}
                <div
                  style={{
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    marginTop: '20px',
                    position: 'relative',
                    height: '90px',
                    background: 'linear-gradient(135deg, #4CAF50, #228B22)',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Typography
                    variant="h3"
                    color="white"
                    sx={{
                      display: 'inline-block',
                      animation: 'scroll-text 30s linear 0s infinite forwards',
                      mt: 1,
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    {announcement || 'Have a wonderful day to everyone'}
                  </Typography>
                </div>

                {/* Scroll Animation CSS */}
                <style>
                  {`
                    @keyframes scroll-text {
                      0% { transform: translateX(100%); }
                      100% { transform: translateX(-100%); }
                    }
                  `}
                </style>

              </center>
            </Paper>
          </center>
          <Copyright sx={{ mt: 1 }} />
        </Grid>

        {/* Render transaction windows in two columns */}
        <Grid container item xs={12} sm={6}>
          {['BPS', 'BPB', 'BPZ', 'BPF', 'LCB', 'LCD', 'LCM', 'CDL', 'RPT', 'CSH'].map((transactionCode, index) => (
            <Grid item xs={12} sm={6} key={transactionCode}>
              <Paper
                elevation={24}
                sx={{
                  margin: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 0,
                  opacity: 0.95,
                }}
              >
                <Typography component="h1" variant="h3" align="center" fontFamily={"serif"} color={'primary'}>
                  {transactionCode === 'CSH' ? 'CASHIER' : `WINDOW ${index + 1}`}
                </Typography>
                <Typography component="h1" variant="h6" align="center" marginTop={0} marginBottom={0} fontFamily={"serif"} color={'grey'}>
                  NOW SERVING
                </Typography>
                <Typography component="h1" variant="h1" align="center" fontFamily={"serif"} color={'black'} marginTop={0} id={'NowServing' + transactionCode}>
                  {/* display queueNumber */}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
      </Box>
    </ThemeProvider>
  );
}
