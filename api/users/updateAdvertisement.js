import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadHandler = async (req, res) => {
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the files' });
      return;
    }

    const file = files.file; // Assuming the input name is 'file'
    console.warn('1. ' + file);
    const tempPath = file.Path; // Temporary path
    console.warn('2. ' + tempPath);
    const publicPath = path.join(process.cwd(), 'public/uploads', file.Original); // Destination path in public folder
    console.warn('3. ' + publicPath);
    // Move the file from temp to public folder
    fs.rename(tempPath, publicPath, (err) => {
      if (err) {
        res.status(500).json({ error: 'Error saving the file' });
        return;
      }

      res.status(200).json({ message: 'File uploaded successfully', filename: file.Original });
    });

    const fileUrl = `/uploads/${file.filename}`; // Adjust URL as needed

    // Update user table for advertisement
    const { data, error } = await supabase
      .from('tbl_quexpress_users')
      .update({ advertisement: fileUrl })
      .eq('access_id', 1)
      .select('*')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }
    console.log(fileUrl)
    res.json({ file: fileUrl, data });
  });
};

export default uploadHandler;