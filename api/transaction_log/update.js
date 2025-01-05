// /api/transaction_log/update.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'PUT') {
    try {
        const transactionData = req.body;
        console.log(transactionData.transactionLogId)
        if (!transactionData.transactionLogId) {
          return res.status(400).send('transactionLogId is required');
        }
    
        // Build query string
        const updateData = { transaction_status: transactionData.status };
    
        if (transactionData.transactionStartTime) {
          updateData.transaction_starttime = transactionData.transactionStartTime;
        } else {
          updateData.transaction_endtime = transactionData.transactionEndTime;
        }
    
        let query = supabase.from('tbl_quexpress_transaction_log').update(updateData);
    
        if (transactionData.transactionRef) {
          query = query.eq('transaction_ref', transactionData.transactionRef);
        } else if (transactionData.transactionQueue) {
          query = query.eq('transactions_queue', transactionData.transactionQueue);
        }
        
        query = query.eq('transaction_log_id', transactionData.transactionLogId);
    
        const currentDate = new Date().toISOString().split('T')[0];
        query = query.gte('transaction_datetime', currentDate);
     
        if (transactionData.forClaim) {
          query = query.not('transactions_queue', 'like', 'CSH%');
        } else if (transactionData.forCashier) {
          query = query.like('transactions_queue', 'CSH%');
        }
    
        // Execute query
        const { data, error } = await query.select('*');
        
        if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ error: 'Failed to update transaction log', details: error.message });
        }
    
        if (data.length === 0) {
          return res.status(404).json({ error: 'No matching records found to update' });
        }
        
        res.json(data[0]);
    
      } catch (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Server Error');
      }
    } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}