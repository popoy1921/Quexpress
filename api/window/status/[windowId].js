// /api/window/status/windowId.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    const { windowId } = req.query; // Get the windowId from the dynamic route
    try {
        const { data, error } = await supabase
          .from('tbl_quexpress_window')
          .select('*')
          .eq('window_id', windowId)
          .single();
    
        if (error) {
          console.error('Error fetching window status:', error);
          return res.status(400).json({ error: error.message });
        }
    
        if (!data) {
          return res.status(404).json({ message: 'Window not found' });
        }
    
        res.json(data);
      } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).send('Server Error');
      }
    } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}