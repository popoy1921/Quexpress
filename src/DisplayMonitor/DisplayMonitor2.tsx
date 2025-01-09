import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Background from '../Photos/BackgroundDesktop.jpg';
import DigitalClock from './DigitalClock';
import { createClient } from '@supabase/supabase-js';
import type { FileObject } from '@supabase/storage-js';
import { useEffect, useState } from 'react';

const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CDNURL = 'https://ayhfyztprntbaftgrypt.supabase.co/storage/v1/object/public/uploads/'

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

function useTransactionData(transactionConfigs: {transactionCode: string; windowId: number}[]) {
  const [statuses, setStatuses] = React.useState<Record<string, string>>({});
  const [windows, setWindows] = React.useState<Record<string, string>>({});
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const newStatuses: Record<string, string> = {};
      const newWindows: Record<string, string> = {};
      for (const { transactionCode, windowId } of transactionConfigs) {
        try {
          const isOnlineResponse = await axios.get(
            process.env.REACT_APP_OTHER_BACKEND_SERVER + `/window/status/${windowId}`
          );
          newStatuses[transactionCode] = isOnlineResponse.data.window_status; // 'online' or other status
          newWindows[transactionCode] = isOnlineResponse.data.window_id;
          let queueNumber = '';
          let currentTransactionId = '';
          if(transactionCode.startsWith('CSH')) {
            const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/CSH/${transactionCode}`);
            queueNumber = response.data.transaction_ref !== null 
            ? response.data.transaction_ref 
            : response.data.transactions_queue;
            currentTransactionId = response.data.transaction_id;
          } else if(transactionCode.startsWith('BPLO3')) {
            const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionCode}`);
            queueNumber = response.data.transaction_ref !== null 
            ? response.data.transaction_ref 
            : response.data.transactions_queue;
            currentTransactionId = response.data.transaction_id;
          } else if(transactionCode.startsWith('LCRT')) {
            const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionCode}`);
            queueNumber = response.data.transaction_ref !== null 
            ? response.data.transaction_ref 
            : response.data.transactions_queue;
            currentTransactionId = response.data.transaction_id;
          } else {
            const response = await axios.get(process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transaction_log/get/${transactionCode}`);
            queueNumber = response.data.transactions_queue;
            currentTransactionId = response.data.transaction_id;
          }     

          const nowServingContainer = document.getElementById('NowServing' + transactionCode);
          if (nowServingContainer) {
            const blinkResponse = await axios.get(
              process.env.REACT_APP_OTHER_BACKEND_SERVER + `/transactions/getBlink/${currentTransactionId}`
            );
            if (blinkResponse.data['blink'] === 1) {
              nowServingContainer.innerText = queueNumber;
              playSound();
              nowServingContainer.classList.add('animate');

              setTimeout(async () => {
                await axios.put(
                  process.env.REACT_APP_OTHER_BACKEND_SERVER +
                    `/transaction_log/updateBlink/` +
                    currentTransactionId,
                  { blink: 0 }
                );
                if (nowServingContainer) {
                  nowServingContainer.classList.remove('animate');
                }
              }, 2000);
            } 
            
            if (isOnlineResponse.data.window_status === 'online') {
              if (queueNumber === undefined) {
                nowServingContainer.innerText = transactionCode;
                nowServingContainer.style.opacity = '0';
              } else {
                nowServingContainer.innerText = queueNumber;
                nowServingContainer.style.opacity = 'initial';
              }
            } else {
              nowServingContainer.innerText = 'Not Available';
              nowServingContainer.style.opacity = 'initial';
            }
          }
        } catch (error) {
          console.error(`Error fetching transaction status for ${transactionCode}:`, error);
          newStatuses[transactionCode] = 'offline'; // Default to offline on error
          newWindows[transactionCode] = '0';
        }
      }
      setStatuses(newStatuses);
      setWindows(newWindows);
    }, 3000);

    return () => clearInterval(interval);
  }, [transactionConfigs]);

  return { statuses, windows };
}

export default function DisplayMonitor2() {
  const [announcement, setAnnouncement] = React.useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<FileObject[]>([]);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  let cshIndex = 1;
  
  function updateDisplayedAdsLink () {
    var displayAsInterval = setInterval(async() => {
    const { data, error } = await supabase.storage
      .from('uploads')
      .list('', { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });
  
    if (data !== null && data.length > 0) {
      setVideo([data[0]]); // Set only the latest video
      
    } else {
      setVideo([])
      console.error('Error grabbing file:', error?.message);
      setError(error?.message || 'Failed to fetch video.');
    }
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
    }, 2000);
  }

  useEffect(() => {
    updateDisplayedAdsLink();
    updateDisplayedAnnouncement();
    
  }, []);

  const transactionConfigs = React.useMemo(
    () => [
      { transactionCode: 'BPLO3', windowId: 7 },
      { transactionCode: 'LCRT', windowId: 12 },
      { transactionCode: 'CSH1', windowId: 14 },
      { transactionCode: 'CSH2', windowId: 15 },
      { transactionCode: 'CSH3', windowId: 16 },
      { transactionCode: 'CSH4', windowId: 17 },
      { transactionCode: 'CSH5', windowId: 18 },
      { transactionCode: 'CSH6', windowId: 19 },
      { transactionCode: 'CSH7', windowId: 20 },
      { transactionCode: 'CSH8', windowId: 21 },
    ],
 []);
 const { statuses, windows } = useTransactionData(transactionConfigs);

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
                {video && video.length > 0 ? (
                  video.map((video) => (
                    <video key={CDNURL + video.name} width={850} height={600} autoPlay loop muted>
                      <source src={CDNURL + video.name} type="video/mp4" />
                    </video>
                  ))
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
          {transactionConfigs.map(({ transactionCode }, index) => (
            <Grid item xs={12} sm={6} key={transactionCode}>
              <Paper
                elevation={24}
                sx={{
                  margin: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  p: 0,
                  opacity: 0.95,
                  backgroundColor: statuses[transactionCode] === 'online' ? '#3EB489' : '#B44E3E', // Green if online
                  border: statuses[transactionCode] === 'online' ? '4px solid #2E8565' : '4px solid #8B0000',
                  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                }}
              >
                <Typography component="h1" variant="h4" align="center" fontFamily={"serif"} color={'white'} sx={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)' }}>
                {transactionCode.startsWith('CSH') 
                  ? `CASHIER ${cshIndex++}` 
                  : `WINDOW ${windows[transactionCode]}`
                }
                </Typography>
                <Typography component="h1" variant="h6" align="center" marginTop={0} marginBottom={0} fontFamily={"serif"} color={'white'} sx={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)' }}>
                  NOW SERVING
                </Typography>
                <Typography component="h1" variant="h2" align="center" fontFamily={"serif"} color={'black'} marginTop={0} id={'NowServing' + transactionCode} sx={{fontSize: '3rem', color: statuses[transactionCode] === 'online' ? '#000' : '#FFD700', textShadow: '3px 3px 8px rgba(0, 0, 0, 0.7)'}}>
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
