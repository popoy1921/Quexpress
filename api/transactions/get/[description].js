// /api/transactions/get/description.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    const description = req.query.description;

        try {
            let query;

            if (description === 'CEDULA' || description === 'REAL PROPERTY TAX') {
            // Query for transactions with a specific description
            console.log(1)
            query = await supabase
                .from('tbl_quexpress_combined')
                .select('*')
                .like('full_description', `${description}%`);
            } else {
            // Query for transactions with a combined description and sub-description
            console.log(2);
            query = await supabase
                .from('tbl_quexpress_combined')
                .select('*')
                .eq('full_description', description);
            }
            console.log(query)
            const { data, error } = query;

            if (error) {
            console.error('Supabase error:', error);
            throw error;
            }

            if (!data || data.length === 0) {
            console.log('No matching transactions found.');
            res.status(404).send('No matching transactions found.');
            return;
            }

            // Return the first result if it exists
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