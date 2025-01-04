// /api/user/get_data/userId.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    const { userId } = req.query; // Get the windowId from the dynamic route
    try {
        // Query to fetch user data based on the userId
        const { data, error } = await supabase
          .from('tbl_quexpress_users')
          .select('*')
          .eq('user_id', userId)
          .single(); // Use .single() to get a single record
    
        if (error) {
          throw error;
        }
    
        // Send the result back to the client
        res.json(data);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}