// /api/customer/get.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('tbl_quexpress_customers') // Table name in Supabase
        .select('*') // Fetch all columns
        .order('customer_id', { ascending: true }); // Order by `customer_id` ASC

      if (error) {
        throw error; // Handle Supabase errors
      }

      res.status(200).json(data); // Return the fetched data
    } catch (err) {
      console.error('Error fetching customers:', err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}