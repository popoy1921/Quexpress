import React, { useState, useEffect } from 'react';
import { Button,  CircularProgress,  Typography,  Box,  Grid,  Paper, Card, } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import type { FileObject } from '@supabase/storage-js';
import { v4 as uuidv4 } from 'uuid';

const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<FileObject[]>([]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    const uniqueFileName = `${uuidv4()}.mp4`;

    try {
      const { error } = await supabase.storage
        .from('uploads')
        .upload(uniqueFileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: selectedFile.type,
        });

      if (error) {
        console.error('Error uploading file:', error.message);
        setError(error.message);
        return;
      }

      alert('File uploaded successfully!');
      setSelectedFile(null); // Reset the selected file
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpload();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#d3d3d3"
      sx={{
        backgroundImage: 'url("/path/to/your/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            style={{ fontFamily: 'serif' }}
            color="primary"
            fontWeight="bold"
          >
            Upload Video
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: 8,
                  padding: '8px',
                  border: '2px dashed #228B22',
                  borderRadius: '8px',
                  transition: 'border-color 0.3s',
                  fontFamily: 'serif',
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
                  fontFamily: 'serif',
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
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default UploadPage;
