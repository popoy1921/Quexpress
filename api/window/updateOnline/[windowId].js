// /api/window/uppdateOnline/windowId.js

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
        // Use Supabase client to update the `window_status`
        const { data, error } = await supabase
          .from('tbl_quexpress_window') // Replace with your table name
          .update({ window_status: 'online' }) // Update window_status to 'online'
          .eq('window_id', BigInt(windowId)) // Apply WHERE clause: window_id = windowId
          .select(); // Add .select() to return the updated rows
          
        if (error) {
          console.error('Error updating window status:', error);
          return res.status(400).json({ error: error.message });
        }
    
        // Return success response with updated data
        res.json({ success: true, data });
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