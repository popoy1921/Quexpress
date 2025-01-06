// /api/transactions_log/get_queue.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    const { transactionCode, queue} = req.query;
  
        try {
            const { data, error } = await supabase
            .rpc('get_account_transaction_log', {
                r_transaction_code: transactionCode,
                r_transaction_status: queue,
            });

            if (error) {
            return res.status(500).json({ message: 'Error fetching transaction log', error });
            }
            res.json(data);
        } catch (err) {
            console.log(2);
            console.error('Unexpected Error:', err);
            res.status(500).json({ message: 'Unexpected error fetching transaction log' });
        }
    } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}