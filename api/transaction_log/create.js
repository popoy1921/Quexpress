
// /transaction_log/create API

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const transactionData = req.body;

        try {
            const { 
            transactionId, 
            customerId, 
            customerAccountId, 
            queueNumber, 
            windowId, 
            staffId = null, 
            date, 
            startTime = null, 
            endTime = null, 
            refQueueNumber = null, 
            transactionStatus = null, 
            transactionPass = null 
            } = transactionData;

            const { data, error } = await supabase
            .from('tbl_quexpress_transaction_log')
            .insert([{
                transaction_id: transactionId,
                customer_id: customerId,
                customer_account_id: customerAccountId,
                transactions_queue: queueNumber,
                window_id: windowId,
                staff_id: staffId,
                transaction_datetime: date,
                transaction_starttime: startTime,
                transaction_endtime: endTime,
                transaction_ref: refQueueNumber,
                transaction_status: transactionStatus,
                transaction_pass: transactionPass,
            }])
            .select(); // Use `.select()` to return the inserted row

            if (error) {
            console.error(error);
            return res.status(400).json({ error: error.message });
            }

            res.status(201).json(data[0]); // Send the inserted row as response
        } catch (err) {
            console.error(err);
            res.status(500).send('Server Error');
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}