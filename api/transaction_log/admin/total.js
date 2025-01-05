// /api/transactions_log/admin/total.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    try {
        const query = `
          WITH latest_transactions AS (
            SELECT DISTINCT ON (transactions_queue) *
            FROM public.tbl_quexpress_transaction_log AS A
            LEFT JOIN public.tbl_quexpress_transactions AS B
              ON A.transaction_id = B.transaction_id
            LEFT JOIN public.tbl_quexpress_customers AS C
              ON A.customer_id = C.customer_id
            WHERE transaction_datetime >= CURRENT_DATE
              AND transaction_status IS NOT NULL
            ORDER BY transactions_queue, transaction_log_id DESC
          )
          SELECT count(*) as total_count
          FROM latest_transactions;
        `;
    
        // Execute the query using Supabase
        const { data, error } = await supabase.rpc('execute_raw_query', { query });
    
        if (error) {
          console.error('Supabase RPC error:', error);
          return res.status(500).send('Database query error');
        }
    
        res.json(data[0]);
      } catch (err) {
        console.error('Server error:', err);
        res.status(500).send('Server Error');
      }
    
    } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}