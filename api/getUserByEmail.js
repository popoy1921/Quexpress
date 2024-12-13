// /api/getUserByEmail .js
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    const { email } = req.query; // Get the email from the query parameters

    try {
      let query = supabase
        .from('tbl_quexpress_users')
        .select(`
          user_id,
          user_name,
          access_id,
          user_first_name,
          user_last_name,
          window_id,
          user_pass,
          tbl_quexpress_window!inner(
            window_id,
            window_desc
          )
        `);

      if (email !== 'all') {
        query = query.eq('user_name', email).order('user_id', { ascending: true });
      } else {
        query = query
          .or('access_id.eq.2,access_id.eq.3')
          .or('removed.eq.0,removed.is.null')
          .order('user_id', { ascending: true });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Return the appropriate response based on the email parameter
      if (email !== 'all') {
        res.status(200).json(data[0]);
      } else {
        res.status(200).json(data);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}