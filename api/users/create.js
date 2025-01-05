
// /users/create API

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { firstName, lastName, access, email, password, userRole } = req.body;

        try {
            // Insert new user into the table using Supabase
            const { data, error } = await supabase
            .from('tbl_quexpress_users') // Replace with your table name
            .insert([
                {
                user_name: email,
                user_pass: password,
                access_id: access,
                user_first_name: firstName,
                user_last_name: lastName,
                window_id: userRole, // Assuming `userRole` maps to `window_id`
                },
            ])
            .select(); // Return the inserted row

            if (error) {
            console.error('Error creating user:', error);
            return res.status(400).json({ error: error.message });
            }

            // Return the created user data
            res.json(data[0]);
        } catch (err) {
            console.error('Server Error:', err.message);
            res.status(500).send('Server Error');
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}