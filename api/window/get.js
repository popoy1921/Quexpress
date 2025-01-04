// /api/window/get.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    try {
        const querystring = `
          SELECT 
            a.window_id, 
            a.window_desc, 
            a.window_status, 
            CASE
              WHEN MAX(b.transaction_ref) IS NOT NULL THEN MAX(b.transaction_ref)
              ELSE MAX(b.transactions_queue)
            END AS transactions_queue
          FROM public.tbl_quexpress_window AS a
          LEFT JOIN public.tbl_quexpress_transaction_log AS b
            ON a.window_id = b.window_id
            AND DATE(b.transaction_datetime) >= CURRENT_DATE
            AND (b.transaction_status IS NOT NULL)
          GROUP BY a.window_id, a.window_desc
          ORDER BY a.window_id ASC
        `;
    
      let { data, error } = await supabase
        .rpc('windowget', {
          querystring
        })
      if (error) console.error(error)
      else console.log(data)
    
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