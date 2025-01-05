// /api/transactions_log/admin/report.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    try {
        // Using a raw SQL query with Supabase's `rpc` method to execute a complex query
        const { data, error } = await supabase
          .rpc('get_admin_report'); // You'd need to create this function in Supabase
    
        if (error) {
          throw new Error(error.message);
        }
    
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