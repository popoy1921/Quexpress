// /api/transactions_log/get_count.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    try {
        const transactionData = req.query;
        const transactionQueue = transactionData.transactionQueue;
        const transactionRef = transactionData.transactionRef ?? null;
    
        // Validate input
        if (!transactionQueue && !transactionRef) {
          return res.status(400).send('Either transactionQueue or transactionRef is required');
        }
        let query = ""
        if (transactionQueue) {
          query = await supabase
          .rpc('get_transaction_log_count', { queue_name: transactionQueue });
        } else {
          query = await supabase
          .rpc('get_transaction_log_count2', { queue_name: transactionRef });
        }
          
        let { data, error } = query;
    
        if (error) {
          console.error('Error executing query:', error.message);
          return res.status(500).send('Server Error');
        }
        console.log(data)
        res.json(data);
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Server Error');
      }
    } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}