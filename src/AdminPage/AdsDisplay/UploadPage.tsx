import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography, Box, Grid, Paper } from '@mui/material';
import { useFileContext } from './FileContext';

const UploadPage: React.FC = () => {
  const { setUploadedFile } = useFileContext();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError(new Error("Please select a valid video file."));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.removeItem('Video');
    localStorage.removeItem('VideoUpload');
    if (!file) {
      setError(new Error("Please select a file."));
      return;
    }

    setLoading(true);
    const url = process.env.REACT_APP_OTHER_BACKEND_SERVER + `/users/updateAdvertisement`;
    const formData = new FormData();
    
    formData.append('file', file);

    try {
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Uploaded file URL:', response.data.file);
      setUploadedFile(response.data.file);
      setFile(null);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      bgcolor="#d3d3d3" // Light cyan background
      sx={{ 
        backgroundImage: 'url("/path/to/your/background.jpg")', // Add a background image
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Paper 
        elevation={24} 
        sx={{ 
          padding: 4, 
          width: 400, 
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom align="center" style={{fontFamily:'serif'}} color="primary" fontWeight="bold">
            Upload Video
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                type="file"
                accept="video/*"
                onChange={handleChange}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 8,
                  padding: '8px',
                  border: '2px dashed #228B22',
                  borderRadius: '8px',
                  transition: 'border-color 0.3s',
                  fontFamily:'serif',
                }}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
              </Button>
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error" variant="body1" align="center">
                  {error.message}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default UploadPage;
