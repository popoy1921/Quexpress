import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'uploads'); // Directory for temporary storage
  form.keepExtensions = true;

  // Ensure the upload directory exists
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir);
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'File upload failed.' });
    }

    const uploadedFile = files.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const fileName = `${Date.now()}-${uploadedFile.originalFilename}`;
    const filePath = path.join(form.uploadDir, fileName);

    fs.renameSync(uploadedFile.filepath, filePath); // Move file to uploads directory

    // Generate a public URL
    const fileUrl = `${process.env.HOST}/uploads/${fileName}`;

    // Update the advertisement in the database
    const { data, error } = await supabase
      .from('tbl_quexpress_users')
      .update({ advertisement: fileUrl })
      .eq('access_id', 1)
      .select('*')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ message: `Database error: ${error.message}` });
    }

    res.status(200).json({ file: fileUrl, data });
  });
};

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to allow file uploads
  },
};
