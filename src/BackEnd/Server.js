require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Supabase Client Initialization
const SUPABASE_URL = 'https://ayhfyztprntbaftgrypt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5aGZ5enRwcm50YmFmdGdyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjYxNDAsImV4cCI6MjA0ODcwMjE0MH0.krmujGeIdEwo_zfrnLLMw1aWQniR-OXnxTG4ZVBPnM4'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// TABLE - TBL_QUEXPRESS_CUSTOMER

// Route to Customer
app.get('/customer/get_data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_customers') // Table name in Supabase
      .select('*') // Fetch all columns
      .order('customer_id', { ascending: true }); // Order by `customer_id` ASC

    if (error) {
      throw error; // Throw error to handle it in the catch block
    }

    res.json(data); // Send data as the response
  } catch (err) {
    console.error('Error fetching customers:', err.message);
    res.status(500).send('Server Error');
  }
});

// TABLE - TBL_QUEXPRESS_WINDOW

// Route to windows
app.get('/window/get', async (req, res) => {
  try {
    const querystring = `
      SELECT 
        a.window_id, 
        a.window_desc, 
        a.window_status, 
        CASE
          WHEN MAX(b.transaction_ref) IS NOT NULL THEN MAX(b.transaction_ref)
          ELSE MAX(b.transactions_queue)
        END AS transactions_queue
      FROM public.tbl_quexpress_window AS a
      LEFT JOIN public.tbl_quexpress_transaction_log AS b
        ON a.window_id = b.window_id
        AND DATE(b.transaction_datetime) >= CURRENT_DATE
        AND (b.transaction_status IS NOT NULL)
      GROUP BY a.window_id, a.window_desc
      ORDER BY a.window_id ASC
    `;

  let { data, error } = await supabase
    .rpc('windowget', {
      querystring
    })
  if (error) console.error(error)
  else console.log(data)

    res.json(data);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).send('Server Error');
  }
});


// Route for Window Online update
app.get('/window/updateOnline/:windowId', async (req, res) => {
  const { windowId } = req.params;

  try {
    // Use Supabase client to update the `window_status`
    const { data, error } = await supabase
      .from('tbl_quexpress_window') // Replace with your table name
      .update({ window_status: 'online' }) // Update window_status to 'online'
      .eq('window_id', BigInt(windowId)) // Apply WHERE clause: window_id = windowId
      .select(); // Add .select() to return the updated rows
      
    if (error) {
      console.error('Error updating window status:', error);
      return res.status(400).json({ error: error.message });
    }

    // Return success response with updated data
    res.json({ success: true, data });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for Window Offline update
app.get('/window/updateOffline/:windowId', async (req, res) => {
  const { windowId } = req.params;

  try {
    // Use Supabase client to update the `window_status`
    const { data, error } = await supabase
      .from('tbl_quexpress_window') // Replace with your table name
      .update({ window_status: 'offline' }) // Update window_status to 'offline'
      .eq('window_id', BigInt(windowId)) // Apply WHERE clause: window_id = windowId
      .select(); // Add .select() to return the updated rows
      
    if (error) {
      console.error('Error updating window status:', error);
      return res.status(400).json({ error: error.message });
    }

    // Return success response with updated data
    res.json({ success: true, data });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for Window Status
app.get('/window/status/:windowId', async (req, res) => {
  const windowId = req.params.windowId;

  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_window')
      .select('*')
      .eq('window_id', windowId)
      .single();

    if (error) {
      console.error('Error fetching window status:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'Window not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Server Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// TABLE - TBL_QUEXPRESS_USERS

// Route to create a new user
app.post('/users/create', async (req, res) => {
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
});

app.get('/users/get/:email', async (req, res) => {
  const userName = req.params.email;

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

    if (userName !== 'all') {
      query = query.eq('user_name', userName).order('user_id', { ascending: true });
    } else {
      query = query
        .or('access_id.eq.2,access_id.eq.3')
        .or('removed.eq.0,removed.is.null')
        .order('user_id', { ascending: true });
    }
    console.log((await query).data);
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (userName !== 'all') {
      res.json(data[0]);
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/users/get_data/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Query to fetch user data based on the userId
    const { data, error } = await supabase
      .from('tbl_quexpress_users')
      .select('*')
      .eq('user_id', userId)
      .single(); // Use .single() to get a single record

    if (error) {
      throw error;
    }

    // Send the result back to the client
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/users/update/:userId', async (req, res) => {
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
});

app.post('/customer/create', async (req, res) => {
  const userDetails = req.body;
  const { accountId, firstName, lastName, mobileNumber } = userDetails;

  try {
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

    res.json(data[0]); // Respond with the inserted record
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/customer/get/:accountId', async (req, res) => {
  const accountId = req.params.accountId;

  try {
    // Query to get customer data based on accountId
    const { data, error } = await supabase
      .from('tbl_quexpress_customers')
      .select('*')
      .eq('account_id', accountId)
      .single(); // Use .single() if you expect only one record

    if (error) {
      throw error;
    }

    res.json(data); // Send the retrieved customer data
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Transactions
app.get('/transactions/get/:description', async (req, res) => {
  const description = req.params.description;

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
});

app.post('/transaction_log/create', async (req, res) => {
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
});

app.get('/transaction_log/get_ref/:transactionLogId', async (req, res) => {
  const transactionLogId = req.params.transactionLogId;

  try {
    const { data, error } = await supabase
    .from('tbl_quexpress_transaction_log')
    .select('*')
    .eq('transaction_log_id', transactionLogId);
    
    if (error) {
      throw error;
    }

    res.json(data[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

app.get('/transaction_log/get/:transactionCode', async (req, res) => {
  const transactionCode = req.params.transactionCode + '%';
  
  try {
    const { data, error } = await supabase.rpc('get_monitor_transaction_log', { r_transaction_code: transactionCode });
    if (error) {
      throw error;
    }

    res.json(data[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

app.get('/transaction_log/CSH/:transactionCode', async (req, res) => {
  const transactionCode = req.params.transactionCode + '%';
  
  try {
    const { data, error } = await supabase.rpc('get_monitor_csh_transaction_log', { r_transaction_code: transactionCode });
    if (error) {
      throw error;
    }

    res.json(data[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
});

// app.get('/transaction_log/get', async (req, res) => {
//   const { transactionQueue, transactionRef, forClaim, forCashier } = req.query;

//   try {
//     let filters = [
//       { transaction_datetime: { gte: new Date().toISOString().split('T')[0] } }, // Today's date
//       { transaction_status: { isNot: null } }
//     ];

//     // Add filters based on query parameters
//     if (transactionRef) {
//       filters.push({ transaction_ref: transactionRef });
//     } else if (transactionQueue) {
//       filters.push({ transactions_queue: transactionQueue });
//     }

//     // Additional filters for 'forClaim' and 'forCashier'
//     if (forClaim === 'true') {
//       filters.push({ transactions_queue: { not: { ilike: 'CSH%' } } });
//     } else if (forCashier === 'true') {
//       filters.push({ transactions_queue: { ilike: 'CSH%' } });
//     }

//     // Query Supabase with filters and ordering
//     const { data, error } = await supabase
//       .from('tbl_quexpress_transaction_log')
//       .select('*')
//       .filter('transaction_datetime', 'gte', new Date().toISOString().split('T')[0])
//       .filter('transaction_status', 'is', null) // Ensures it's not null
//       .or(filters.map(filter => `${Object.keys(filter)[0]}.${Object.values(filter)[0]}`))
//       .order('transaction_log_id', { ascending: false })
//       .limit(1);

//     if (error) {
//       console.error('Supabase error:', error);
//       return res.status(400).json({ error: error.message });
//     }

//     if (data.length === 0) {
//       return res.status(404).json({ message: 'No matching transaction log found' });
//     }

//     res.status(200).json(data[0]);
//   } catch (err) {
//     console.error('Server error:', err);
//     res.status(500).send('Server Error');
//   }
// });

app.get('/transaction_log/get_count', async (req, res) => {
  try {
    const transactionData = req.query;
    const transactionQueue = transactionData.transactionQueue;
    const transactionRef = transactionData.transactionRef ?? null;

    // Validate input
    if (!transactionQueue && !transactionRef) {
      return res.status(400).send('Either transactionQueue or transactionRef is required');
    }
    let query = ""
    if (transactionQueue) {
      query = await supabase
      .rpc('get_transaction_log_count', { queue_name: transactionQueue });
    } else {
      query = await supabase
      .rpc('get_transaction_log_count2', { queue_name: transactionRef });
    }
      
    let { data, error } = query;

    if (error) {
      console.error('Error executing query:', error.message);
      return res.status(500).send('Server Error');
    }
    console.log(data)
    res.json(data);
  } catch (err) {
    console.error('Error executing query:', err.message);
    res.status(500).send('Server Error');
  }
});

// Route for Displaying QueueNumber
app.get('/transaction_log/get_queue', async (req, res) => {
  const { transactionCode, queue} = req.query;
  
  try {
    const { data, error } = await supabase
      .rpc('get_account_transaction_log', {
        r_transaction_code: transactionCode,
        r_transaction_status: queue,
      });

    if (error) {
      return res.status(500).json({ message: 'Error fetching transaction log', error });
    }
    res.json(data);
  } catch (err) {
    console.log(2);
    console.error('Unexpected Error:', err);
    res.status(500).json({ message: 'Unexpected error fetching transaction log' });
  }
});

// app.get('/transaction_log/get/toQueue/:transactionCode', async (req, res) => {
//   const { transactionCode } = req.params;

//   try {
//     const { data, error } = await supabase
//       .rpc('get_account_transaction_log', {
//         r_transaction_code: transactionCode,
//         r_transaction_status: 'toQueue',
//       });

//     if (error) {
//       return res.status(500).json({ message: 'Error fetching transaction log', error });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Unexpected Error:', err);
//     res.status(500).json({ message: 'Unexpected error fetching transaction log' });
//   }
// });

// app.get('/transaction_log/get/notForQueue/:transactionCode', async (req, res) => {
//   const { transactionCode } = req.params;

//   try {
//     const { data, error } = await supabase
//       .rpc('get_account_transaction_log', {
//         r_transaction_code: transactionCode,
//         r_transaction_status: 'notForQueue',
//       });

//     if (error) {
//       return res.status(500).json({ message: 'Error fetching transaction log', error });
//     }
//     res.json(data);
//   } catch (err) {
//     console.error('Unexpected Error:', err);
//     res.status(500).json({ message: 'Unexpected error fetching transaction log' });
//   }
// });


app.get('/transaction_log/admin/report', async (req, res) => {
  try {
    // Using a raw SQL query with Supabase's `rpc` method to execute a complex query
    const { data, error } = await supabase
      .rpc('get_admin_report'); // You'd need to create this function in Supabase

    if (error) {
      throw new Error(error.message);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }

});

app.get('/transaction_log/admin/total', async (req, res) => {
  try {
    const query = `
      WITH latest_transactions AS (
        SELECT DISTINCT ON (transactions_queue) *
        FROM public.tbl_quexpress_transaction_log AS A
        LEFT JOIN public.tbl_quexpress_transactions AS B
          ON A.transaction_id = B.transaction_id
        LEFT JOIN public.tbl_quexpress_customers AS C
          ON A.customer_id = C.customer_id
        WHERE transaction_datetime >= CURRENT_DATE
          AND transaction_status IS NOT NULL
        ORDER BY transactions_queue, transaction_log_id DESC
      )
      SELECT count(*) as total_count
      FROM latest_transactions;
    `;

    // Execute the query using Supabase
    const { data, error } = await supabase.rpc('execute_raw_query', { query });

    if (error) {
      console.error('Supabase RPC error:', error);
      return res.status(500).send('Database query error');
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/admin/:windowId', async (req, res) => {
  const windowId = req.params.windowId;
  try {
    const query = `
      WITH latest_transactions AS (
      SELECT DISTINCT ON (transactions_queue) *
      FROM public.tbl_quexpress_transaction_log AS A
      LEFT JOIN public.tbl_quexpress_transactions AS B
        ON A.transaction_id = B.transaction_id
      LEFT JOIN public.tbl_quexpress_customers AS C
        ON A.customer_id = C.customer_id
      WHERE transaction_datetime >= CURRENT_DATE
        AND window_id = $1
        AND transaction_status IS NOT NULL
      ORDER BY transactions_queue, transaction_log_id DESC
    )
    SELECT count(*) as total_count
    FROM latest_transactions
    `;
    console.log('Query before execution:', query.replace('$1', BigInt(windowId)));
    // Execute the query using Supabase
    const { data, error } = await supabase.rpc('execute_raw_query', {
      query: query.replace('$1', BigInt(windowId)),
    }).select();

    if (error) {
      console.error('Supabase RPC error:', error);
      return res.status(500).send('Database query error');
    }
    
    if (!data || data.length === 0) {
      console.log('No records found for the given query.');
      return res.status(404).send('No data found');
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server Error');
  }
});

// Route to update transaction log
app.put('/transaction_log/update', async (req, res) => {
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
});

// Route to update staff id
app.put('/transaction_log/updateStaff', async (req, res) => {
  const transactionData = req.body;
  const transactionLogId = transactionData.transactionLogId;
  const staffId = transactionData.staffId;
  
  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_transaction_log')
      .update({ staff_id: staffId })
      .eq('transaction_log_id', transactionLogId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to update window id
app.put('/transaction_log/updateWindow', async (req, res) => {
  const transactionData = req.body;
  const transactionLogId = transactionData.transactionLogId;
  const windowId = transactionData.windowId;

  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_transaction_log')
      .update({ window_id: windowId })
      .eq('transaction_log_id', transactionLogId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to admin dashboard

// Route to admin dashboard

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'uploads/'); // Ensure this directory exists
    cb(null, '../../public/uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
  },
  
});

const upload = multer({ storage });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files
app.use('../../public/uploads/', express.static(uploadsDir));

// Route for video ads upload
app.put('/users/updateAdvertisement', upload.single('file'), async (req, res) => {
  try {
    // File Upload
    if (!req.file) { 
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const fileUrl = `http://localhost:${process.env.PORT || 3000}/uploads/${req.file.filename}`; // Adjust URL as needed

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
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/users/updateAdvertisementx', upload.single('file'), async (req, res) => {
  const x = require('formidable');
  const IncomingForm = x.IncomingForm;
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    console.log(1)
  });
});

// Route to get user details
app.get('/users/getAdvertisement', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_users')
      .select('*')
      .eq('access_id', 1)
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Announcement
app.put('/users/updateAnnouncement', async (req, res) => {
  const { announcement } = req.body;
  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_users')
      .update({ announcement })
      .eq('access_id', 1)
      .select('*')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(data || undefined);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to get Announcement
app.get('/users/getAnnouncement', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_users')
      .select('*')
      .eq('access_id', 1)
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(data || undefined);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Route for video ads upload
app.put('/transaction_log/updateBlink/:transactionId', async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const requestBody = req.body;
    const transactionBlink = requestBody.blink;

    const { data, error } = await supabase
      .from('tbl_quexpress_transactions')
      .update({ blink: transactionBlink })
      .eq('transaction_id', transactionId)
      .select('*')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for video ads upload
app.put('/transaction_log/updateBlink1/:transactionCode', async (req, res) => {
  try {
    const transactionCode = req.params.transactionCode;
    const requestBody = req.body;
    const transactionBlink = requestBody.blink;

    const { data, error } = await supabase
      .from('tbl_quexpress_transactions')
      .update({ blink: transactionBlink })
      .eq('transaction_code', transactionCode)
      .select('*')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for transaction types blink status
app.get('/transactions/getBlink/:transactionCode', async (req, res) => {
  const transactionCode = req.params.transactionCode;
  
  try {
    // Query the Supabase database
    const { data, error } = await supabase
      .from('tbl_quexpress_transactions') // Replace with your table name
      .select('*')
      .eq('transaction_code', transactionCode);
    if (transactionCode === 'CSH1') {
      console.log([data, error]);
    }
    if (error) {
      if (transactionCode === 'CSH1') {
        console.error(error);
        return res.status(500).send('Server Error');
      } 
    }

    // Send the response
    if (data !== null && data.length > 0) {
      res.json(data[0]);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Route for OTP
const bodyParser = require('body-parser');
const crypto = require('crypto');

const otps = new Map();
const users = new Map();

app.use(bodyParser.json());

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

const accountSid = process.env.REACT_APP_TWILIO_ACCOUNTSID;
const authToken = process.env.REACT_APP_TWILIO_TOKEN;
const verifySid = process.env.REACT_APP_TWILIO_VERIFYSID;

if (!accountSid || !authToken || !verifySid) {
  console.error("Twilio credentials missing.");
}

const client = require("twilio")(accountSid, authToken);

app.post('/send-otp', (req, res) => {
  let { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required.' });
  }

  // Ensure the mobile number starts with '+63' (adjust based on your country code)
  if (!mobileNumber.startsWith('+63')) {
    mobileNumber = '+63' + mobileNumber.replace(/^\+63?/, '');
  }

  client.verify.v2
    .services(verifySid)
    .verifications.create({ to: mobileNumber, channel: "sms" })
    .then((verification) => {
      console.log(`Verification sent to ${mobileNumber}: Status - ${verification.status}`);
      return res.json({ message: 'OTP sent successfully!' });
    })
    .catch((err) => {
      console.error('Error sending OTP:', err.message);
      return res.status(500).json({ message: 'Failed to send OTP.', error: err.message });
    });
});
  
// 2. Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
  let { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required.' });
  }

  if (!mobileNumber.startsWith('+63')) {
    mobileNumber = '+63' + mobileNumber.replace(/^\+63?/, '');
  }

  client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: mobileNumber, code: otp })
    .then((verification_check) => {
      if (verification_check.status === 'approved') {
        return res.json({ message: 'OTP verified successfully!' });
      } else {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
      }
    })
    .catch((err) => {
      console.error('Error verifying OTP:', err.message);
      return res.status(500).json({ message: 'Failed to verify OTP.', error: err.message });
    });
});

// printer
app.get('/print', (req, res) => {
  const { text1, text2, text3 } = req.query;
  
  const jsonObject = {
    printContent1:
    {
      type: 0, 
      content: text1, 
      bold: 1, 
      align: 1, 
      format: 0 
    },
    printContent2:
    {
      type: 0, 
      content: text2, 
      bold: 1, 
      align: 1, 
      format: 2 
    },
    printContent3:
    {
      type: 0, 
      content: "", 
      bold: 0, 
      align: 1, 
      format: 0 
    },
    printContent4:
    {
      type: 0, 
      content: text3, 
      bold: 0, 
      align: 1, 
      format: 0 
    }
  };
  
  console.log('Sending JSON response:', JSON.stringify(jsonObject));
  res.json(jsonObject);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});