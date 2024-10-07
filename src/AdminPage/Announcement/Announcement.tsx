import React, { useState } from 'react';
import { Typography, Button, TextField, Paper, Box } from '@mui/material';

const AnnouncementPage: React.FC = () => {
  const [announcement, setAnnouncement] = useState<string>("Announcement text goes here.");
  const [inputText, setInputText] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSave = async () => {
    if (inputText.trim() !== "") {
      try {
        // Make a PUT request to the backend to save the announcement
        const response = await fetch(process.env.REACT_APP_OTHER_BACKEND_SERVER + '/users/updateAnnouncement', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ announcement: inputText }),
        });

        const data = await response.json();

        if (response.ok) {
          // Update the local state with the new announcement from the response
          setAnnouncement(data.announcement);
          setInputText("");
        } else {
          console.error('Failed to update announcement:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={24} sx={{ padding: '20px', width: '100%', maxWidth: '600px', borderRadius: '12px' }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Update Announcement
        </Typography>
        <TextField
          label="Enter your announcement"
          variant="outlined"
          fullWidth
          value={inputText}
          onChange={handleInputChange}
          sx={{ marginBottom: '10px' }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          sx={{ 
            width: '100%', 
            height: 48,
            borderRadius: '20px',
            fontFamily:'serif',
            transition: 'background-color 0.3s, transform 0.3s',
            '&:hover': {
              backgroundColor: '#228B22',
              transform: 'scale(1.05)',
            },
          }}
        >
          Save Announcement
        </Button>
      </Paper>

      {/* Scrolling Announcement */}
      <Paper 
        elevation={24}
        sx={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          width: '100%',
          marginTop: '20px',
          height: '90px',
          background: 'linear-gradient(135deg, #4CAF50, #228B22)',
          borderRadius: '8px',
          padding: '10px 20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          color="white"
          sx={{
            display: 'inline-block',
            animation: 'scroll-text 30s linear 0s infinite forwards',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          {announcement}
        </Typography>
      </Paper>

      {/* Scroll Animation CSS */}
      <style>
        {`
          @keyframes scroll-text {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </Box>
  );
};

export default AnnouncementPage;
