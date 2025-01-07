// /api/transaction_log/updateblink1/transactionCode.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'PUT') {
    try {
        const transactionCode = req.query.transactionCode;
        const requestBody = req.body;
        const transactionBlink = requestBody.blink;
    
        const { data, error } = await supabase
          .from('tbl_quexpress_transactions')
          .update({ blink: transactionBlink })
          .eq('transaction_code', transactionCode)
          .select('*')
          .single();
    
        if (error) {
          console.error(error);
          return res.status(500).send('Database Error: ' + error.message);
        }
    
        res.json(data[0]);
      } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
      }
    } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}