import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_users')
      .select('*')
      .eq('access_id', 1)
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: `Database error: ${error.message}` });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};