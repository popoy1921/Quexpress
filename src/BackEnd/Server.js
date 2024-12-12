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
app.get('/customer/get', async (req, res) => {
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

app.get('/transaction_log/get/:transactionCode', async (req, res) => {
  const transactionCode = req.params.transactionCode + '%';

  try {
    const { data, error } = await supabase.rpc('transaction_log_query', {
      transaction_code: transactionCode,
    });

    if (error) {
      console.log(data)
      console.error('Supabase query error:', error);
      return res.status(500).send('Server Error');
    }

    if (!data || data.length === 0) {
      return res.json("Hello"); // Respond with `undefined` for null or no data
    }
      
    res.json(data[0]);
    
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/CSH/:transactionCode', async (req, res) => {
  const transactionCode = req.params.transactionCode;

  try {
    let query = supabase
      .from('tbl_quexpress_transaction_log')
      .select('*')
      .gte('transaction_datetime', new Date().toISOString().split('T')[0])
      .not('transaction_status', 'is', null);

    // Conditional query based on transactionCode
    if (transactionCode === 'CSH1') {
      query = query
        .or(
          `(
            (transaction_ref.ilike.BP% OR
             transaction_ref.ilike.MY% OR
             transaction_ref.ilike.WP% OR
             transaction_ref.ilike.BS% OR
             transaction_ref.ilike.BB% OR
             transaction_ref.ilike.BZ% OR
             transaction_ref.ilike.BF% OR
             transaction_ref.ilike.PO%) 
            AND transactions_queue.ilike.CSH%)
           OR transactions_queue.ilike.BPP% OR
           transactions_queue.ilike.POP% OR
           transactions_queue.ilike.MYP% OR
           transactions_queue.ilike.WPP% OR
           transactions_queue.ilike.BSP% OR
           transactions_queue.ilike.BBP% OR
           transactions_queue.ilike.BZP% OR
           transactions_queue.ilike.BFP%`
        )
        .eq('window_id', 14);
    } else if (transactionCode === 'CSH2') {
      query = query
        .or(
          `(
            (transaction_ref.ilike.BP% OR
             transaction_ref.ilike.MY% OR
             transaction_ref.ilike.WP% OR
             transaction_ref.ilike.BS% OR
             transaction_ref.ilike.BB% OR
             transaction_ref.ilike.BZ% OR
             transaction_ref.ilike.BF% OR
             transaction_ref.ilike.PO%) 
            AND transactions_queue.ilike.CSH%)
           OR transactions_queue.ilike.BPP% OR
           transactions_queue.ilike.POP% OR
           transactions_queue.ilike.MYP% OR
           transactions_queue.ilike.WPP% OR
           transactions_queue.ilike.BSP% OR
           transactions_queue.ilike.BBP% OR
           transactions_queue.ilike.BZP% OR
           transactions_queue.ilike.BFP%`
        )
        .eq('window_id', 15);
    } else if (transactionCode === 'CSH3') {
      query = query.ilike('transactions_queue', 'RPT%')
      .eq('window_id', 16);
    } else if (transactionCode === 'CSH4') {
      query = query.ilike('transactions_queue', 'RPT%')
      .eq('window_id', 17);
    } else if (transactionCode === 'CSH5') {
      query = query.or(
        'transactions_queue.ilike.CDL%,' +
        'transactions_queue.ilike.RTP%'
      )
      .eq('window_id', 18);
    } else if (transactionCode === 'CSH6') {
      query = query.or(
        'transactions_queue.ilike.CDL%,' +
        'transactions_queue.ilike.RTP%'
      )
      .eq('window_id', 19);
    } else if (transactionCode === 'CSH7') {
      query = query.or(
        `
        transaction_ref.ilike.LC% OR
        transaction_ref.ilike.LB% OR
        transaction_ref.ilike.LD% OR
        transaction_ref.ilike.LM% OR
        transactions_queue.ilike.VLP% OR
        transactions_queue.ilike.OTP% OR
        transactions_queue.ilike.LBP% OR
        transactions_queue.ilike.LDP% OR
        transactions_queue.ilike.LMP% OR
        transactions_queue.ilike.LCP%
        `
      )
      .eq('window_id', 20);
    } else if (transactionCode === 'CSH8') {
      query = query.or(
        `
        transaction_ref.ilike.LC% OR
        transaction_ref.ilike.LB% OR
        transaction_ref.ilike.LD% OR
        transaction_ref.ilike.LM% OR
        transactions_queue.ilike.VLP% OR
        transactions_queue.ilike.OTP% OR
        transactions_queue.ilike.LBP% OR
        transactions_queue.ilike.LDP% OR
        transactions_queue.ilike.LMP% OR
        transactions_queue.ilike.LCP%
        `
      )
      .eq('window_id', 21);
    }

    // Apply ordering and limit
    query = query.order('transaction_log_id', { ascending: false }).limit(1);

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).send('Server Error');
    }

    res.json(data[0] || undefined);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/get', async (req, res) => {
  const { transactionQueue, transactionRef, forClaim, forCashier } = req.query;

  try {
    let filters = [
      { transaction_datetime: { gte: new Date().toISOString().split('T')[0] } }, // Today's date
      { transaction_status: { isNot: null } }
    ];

    // Add filters based on query parameters
    if (transactionRef) {
      filters.push({ transaction_ref: transactionRef });
    } else if (transactionQueue) {
      filters.push({ transactions_queue: transactionQueue });
    }

    // Additional filters for 'forClaim' and 'forCashier'
    if (forClaim === 'true') {
      filters.push({ transactions_queue: { not: { ilike: 'CSH%' } } });
    } else if (forCashier === 'true') {
      filters.push({ transactions_queue: { ilike: 'CSH%' } });
    }

    // Query Supabase with filters and ordering
    const { data, error } = await supabase
      .from('tbl_quexpress_transaction_log')
      .select('*')
      .filter('transaction_datetime', 'gte', new Date().toISOString().split('T')[0])
      .filter('transaction_status', 'is', null) // Ensures it's not null
      .or(filters.map(filter => `${Object.keys(filter)[0]}.${Object.values(filter)[0]}`))
      .order('transaction_log_id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: 'No matching transaction log found' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/get_count', async (req, res) => {
  const { transactionQueue, transactionRef, forClaim, forCashier } = req.query;

  try {
    let filters = [
      { transaction_datetime: { gte: new Date().toISOString().split('T')[0] } }, // Filter by today's date
      { transaction_status: { in: ['cancelled', 'on going'] } } // Filter by specific statuses
    ];

    // Add filters for transactionQueue and transactionRef
    if (transactionRef) {
      filters.push({ transaction_ref: transactionRef });
    } else if (transactionQueue) {
      filters.push({ transactions_queue: transactionQueue });
    } else {
      // If no specific queue or reference, return a bad request error
      return res.status(400).json({ error: 'Transaction queue or reference must be provided' });
    }

    // Add filters for 'forClaim' and 'forCashier' query parameters
    if (forClaim === 'true') {
      filters.push({ transactions_queue: { not: { ilike: 'CSH%' } } });
    } else if (forCashier === 'true') {
      filters.push({ transactions_queue: { ilike: 'CSH%' } });
    }

    // Query Supabase to count the matching records
    const { count, error } = await supabase
      .from('tbl_quexpress_transaction_log')
      .select('transactions_queue', { count: 'exact' }) // Count option
      .filter('transaction_datetime', 'gte', new Date().toISOString().split('T')[0])
      .or(filters.map(filter => `${Object.keys(filter)[0]}.${Object.values(filter)[0]}`))
      .single(); // Returns a single record with the count

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ count: count || 0 });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server Error');
  }
});


// Route for Displaying QueueNumber
app.get('/transaction_log/get/:transactionCode/:transactionStatus', async (req, res) => {
  const { transactionCode, transactionStatus } = req.params;

  try {
    let filters = [
      { transaction_datetime: { gte: new Date().toISOString().split('T')[0] } } // Filter by today's date
    ];

    let transactionQueueCondition = '';
    let statusCondition = '';

    if (transactionStatus === 'toQueue') {
      statusCondition = { transaction_status: { is: null } };
    } else if (transactionStatus === 'notForQueue') {
      statusCondition = { transaction_status: { not: null } };
    }

    // Define the queue patterns based on transactionCode
    switch (transactionCode) {
      case 'BPLO1':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['BPI%', 'BPN%', 'BPR%', 'BPC%', 'POI%', 'POR%']
          }
        };
        break;
      case 'BPLO2':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['MYI%', 'MYR%', 'MYT%', 'WPI%', 'WPR%', 'WPT%']
          },
          transaction_ref: {
            ilike: ['MY%', 'WP%']
          }
        };
        filters.push({
          transactions_queue: {
            ilike: 'BTC%'
          }
        });
        break;
      case 'BPLO3':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['BPT%', 'BST%', 'BBT%', 'BZT%', 'BFT%', 'POT%']
          },
          transaction_ref: {
            ilike: ['BS%', 'BB%', 'BZ%', 'BF%', 'BP%', 'PO%']
          }      
        };
        filters.push({
          transactions_queue: {
            ilike: 'BTC%'
          }
        });
        break;
      case 'DTIM':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['DTI%', 'DTR%', 'DTP%', 'DTT%']
          }
        };
        break;
      case 'BPS':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['BSI%', 'BSR%']
          }
        };
        break;
      case 'BPB':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['BBI%', 'BBR%']
          }
        };
        break;
      case 'BPZ':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['BZI%', 'BZR%']
          }
        };
        break;
      case 'BPF':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['BFI%', 'BFR%']
          }
        };
        break;
      case 'LBC':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['LBI%', 'LBR%']
          }
        };
        break;
      case 'LDC':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['LDI%', 'LDR%']
          }
        };
        break;
      case 'LMC':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['LMI%', 'LMR%']
          }
        };
        break;
      case 'LCC':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['LCB%', 'LCD%', 'LCM%']
          }
        };
        break;
      case 'LCRT':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['LCT%', 'LBT%', 'LDT%', 'LMT%', 'LTC%']
          }
        };
        break;
      case 'CSH1':
      case 'CSH2':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['CSH%']
          },
          transaction_ref: {
            ilike: ['BP%', 'MY%', 'WP%', 'BS%', 'BB%', 'BZ%', 'BF%', 'PO%']
          }
        };
        break;
      case 'CSH3':
      case 'CSH4':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['RPT%']
          }
        };
        break;
      case 'CSH5':
      case 'CSH6':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['CDL%', 'RTP%']
          }
        };
        break;
      case 'CSH7':
      case 'CSH8':
        transactionQueueCondition = {
          transactions_queue: {
            ilike: ['CSH%']
          },
          transaction_ref: {
            ilike: ['LC%', 'LB%', 'LD%', 'LM%', 'VLP%', 'OTP%', 'LBP%', 'LDP%', 'LMP%', 'LCP%']
          }
        };
        break;
      default:
        transactionQueueCondition = {
          transactions_queue: {
            ilike: `${transactionCode}%`
          }
        };
        break;
    }

    // Query Supabase with filters
    const { data, error } = await supabase
      .from('tbl_quexpress_transaction_log')
      .select('*')
      .match(transactionQueueCondition)
      .filter('transaction_datetime', 'gte', new Date().toISOString().split('T')[0])
      .filter('transaction_status', statusCondition)
      .order('transaction_log_id', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send('Server Error');
  }
});

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
  console.log('Received windowId:', windowId);
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

// Route to update status and end time
app.put('/transaction_log/update', async (req, res) => {
  const transactionData = req.body;
  const transactionLogId = transactionData.transactionLogId;
  const transactionQueue = transactionData.transactionQueue;
  const status = transactionData.status;
  const transactionRef = transactionData.transactionRef ?? null; 
  const transactionEndTime = transactionData.transactionEndTime ?? null;
  const transactionStartTime = transactionData.transactionStartTime ?? null;
  const forClaim = transactionData.forClaim ?? null;
  const forCashier = transactionData.forCashier ?? null;

  try {
    let query = supabase
      .from('tbl_quexpress_transaction_log')
      .update({ transaction_status: status })
      .eq('transaction_datetime', '>= CURRENT_DATE');

    if (transactionStartTime !== null) {
      query = query.update({ transaction_starttime: transactionStartTime });
    } else if (transactionEndTime !== null) {
      query = query.update({ transaction_endtime: transactionEndTime });
    }

    if (transactionRef) {
      query = query.eq('transaction_ref', transactionRef);
    } else {
      query = query.eq('transactions_queue', transactionQueue);
    }

    if (transactionLogId) {
      query = query.eq('transaction_log_id', transactionLogId);
    }

    if (forClaim === true) {
      query = query.not('transactions_queue', 'like', 'CSH%');
    }

    if (forCashier === true) {
      query = query.like('transactions_queue', 'CSH%');
    }

    const { data, error } = await query.select('*').single();

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
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


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
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to admin dashboard

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
app.use('/uploads', express.static(uploadsDir));

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
app.put('/transaction_log/updateBlink/:transactionLogId', async (req, res) => {
  try {
    const transactionLogId = req.params.transactionLogId;
    const requestBody = req.body;
    const transactionBlink = requestBody.blink;

    const { data, error } = await supabase
      .from('tbl_quexpress_transactions')
      .update({ blink: transactionBlink })
      .like('transaction_code', transactionLogId)
      .select('*')
      .single();

    if (error) {
      console.error(error);
      return res.status(500).send('Database Error: ' + error.message);
    }

    res.json(true);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for transaction types blink status
app.get('/transactions/getBlink/:transactionCode', async (req, res) => {
  const transactionCode = req.params.transactionCode;

  try {
    const { data, error } = await supabase
      .from('tbl_quexpress_transactions')
      .select('*')
      .eq('transaction_code', transactionCode)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).send('Failed to fetch transaction.');
    }

    if (!data) {
      return res.status(404).send('Transaction not found.');
    }

    res.json(data);
  } catch (err) {
    console.error('Server error:', err);
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