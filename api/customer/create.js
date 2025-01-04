
// /customer/create API

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const userDetails = req.body;
        const { accountId, firstName, lastName, mobileNumber } = userDetails;

        // Insert a new customer record into the `tbl_quexpress_customers` table
        const { data, error } = await supabase
        .from('tbl_quexpress_customers')
        .insert([
            {
            account_id: accountId,
            customer_first_name: firstName,
            customer_last_name: lastName,
            customer_number: mobileNumber,
            enabled_datetime: new Date().toISOString().split('T')[0] // Sets the current date in YYYY-MM-DD format
            }
        ])
        .select('*'); // Selects the inserted record

        if (error) {
            throw error;
        }
        res.json(data[0]);
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}