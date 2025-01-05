// /api/user/update/userId.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'PUT') {
    const userId = req.params.userId;
    const userDetails = req.body;
    const { firstName, lastName, email, password, removed, userRole } = userDetails;

        try {
            // Prepare data to be updated
            const updates = {
            user_name: email,
            user_first_name: firstName,
            user_last_name: lastName,
            removed: removed ?? '0',
            user_pass: password ?? '',
            window_id: userRole // Assuming `userRole` is intended to be mapped to `window_id`
            };

            // Update the record in the `tbl_quexpress_users` table
            const { data, error } = await supabase
            .from('tbl_quexpress_users')
            .update(updates)
            .eq('user_id', userId)
            .select('*') // Selects the updated record
            .single(); // Ensures only one record is returned

            if (error) {
            throw error;
            }

            res.json(data);
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