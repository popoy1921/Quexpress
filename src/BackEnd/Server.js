const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

const { Pool } = require('pg');
// Create a new Pool instance with database connection details
const pool = new Pool({
    user: 'postgres.ayhfyztprntbaftgrypt',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'postgres',
    password: 'mqbOcfznnBdoIudP',
    port: 6543, 
});

// Middleware
app.use(express.json());
app.use(cors());


// TABLE - TBL_QUEXPRESS_CUSTOMER

// Route to Customer
app.get('/customer/get', async (req, res) => {
  try {
    var queryString = 'SELECT * FROM quexpress.tbl_quexpress_customers'
    + ' ORDER BY customer_id ASC';

    const client = await pool.connect();
    const queryResult = await client.query(queryString);
    res.json(queryResult.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// TABLE - TBL_QUEXPRESS_WINDOW

// Route to windows
app.get('/window/get', async (req, res) => {
  try {
    var queryParameters = [];
    var queryString = 'SELECT a.window_id, a.window_desc, a.window_status, CASE'
    + ' WHEN MAX(b.transaction_ref) IS NOT NULL THEN MAX(b.transaction_ref)'
    + ' ELSE MAX(b.transactions_queue)'
    + ' END AS transactions_queue'
    + ' FROM quexpress.tbl_quexpress_window AS a'
    + ' LEFT JOIN quexpress.tbl_quexpress_transaction_log AS b'
    + ' ON a.window_id = b.window_id'
    + ' AND DATE(b.transaction_datetime) >= CURRENT_DATE'
    + ' AND (b.transaction_status is not null)'
    + ' GROUP BY a.window_id, a.window_desc'
    + ' ORDER BY a.window_id ASC';

    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    res.json(queryResult.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Window Online update
app.get('/window/updateOnline/:windowId', async (req, res) => {
  const windowId = req.params.windowId;
  var queryParameters = [];
  try {
    
    var queryString = 'UPDATE quexpress.tbl_quexpress_window'
    + ' SET window_status = \'online\''
    + ' WHERE window_id = $1'
    queryParameters.push(windowId);

    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    res.json(queryResult.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Window Offline update
app.get('/window/updateOffline/:windowId', async (req, res) => {
  const windowId = req.params.windowId;
  var queryParameters = [];
  try {
    
    var queryString = 'UPDATE quexpress.tbl_quexpress_window'
    + ' SET window_status = \'offline\''
    + ' WHERE window_id = $1'
    queryParameters.push(windowId);

    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    res.json(queryResult.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Window Status
app.get('/window/status/:windowId', async (req, res) => {
  const windowId = req.params.windowId;
  var queryParameters = [];
  try {
    
    var queryString = 'SELECT * FROM quexpress.tbl_quexpress_window'
    + ' WHERE window_id = $1'
    queryParameters.push(windowId);

    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    res.json(queryResult.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// TABLE - TBL_QUEXPRESS_USERS

// Route to create a new user
app.post('/users/create', async (req, res) => {
  const userDetails = req.body;
  const firstName = userDetails.firstName;
  const lastName  = userDetails.lastName;
  const access    = userDetails.access;
  const email     = userDetails.email;
  const password  = userDetails.password;
  const userRole  = userDetails.userRole;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO quexpress.tbl_quexpress_users (user_name, user_pass, access_id, user_first_name, user_last_name, window_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [email , password, access, firstName, lastName, userRole]);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/users/get/:email', async (req, res) => {
  const userName = req.params.email;
  try {
    var queryParameters = [];
    var queryString = 'SELECT a.user_id, a.user_name, a.access_id, a.user_first_name, a.user_last_name,'
    + ' a.window_id, a.user_pass, b.window_id AS b_window_id, b.window_desc FROM quexpress.tbl_quexpress_users AS a'
    + ' LEFT JOIN quexpress.tbl_quexpress_window AS b ON b.window_id = a.window_id'
    var result;
    if(userName !== 'all') {
      queryString += ' WHERE user_name = $1 ORDER BY a.user_id ASC'
      queryParameters.push(userName);
    } else {
      queryString += ' WHERE (access_id = 2 or access_id = 3) and (removed = 0 or (removed is null)) ORDER BY a.user_id ASC';
    }
    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    result = queryResult.rows;
    if(userName !== 'all') {
      result = result[0];
    }
    res.json(result);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to get user details
app.get('/users/get_data/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM quexpress.tbl_quexpress_users WHERE user_id = $1', [userId]);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to update users
app.put('/users/update/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userDetails = req.body;
  const firstName = userDetails.firstName;
  const lastName  = userDetails.lastName;
  const email     = userDetails.email;
  const password  = userDetails.password ?? '';
  const removed   = userDetails.removed ?? '0';
  const userRole  = userDetails.userRole;
  
  var transactionLogDetails = [
    email,
    firstName,
    lastName,
    removed,
    userId,
    password,
    userRole,
  ];
  try {
    var queryString = 'UPDATE quexpress.tbl_quexpress_users'
      + ' SET user_name = $1, user_first_name = $2'
      + ' ,user_last_name = $3, removed = $4, user_pass = $6, window_id = $7'
      + ' where user_id = $5'
      + ' RETURNING *';
    const client = await pool.connect();
    const result = await client.query(queryString, transactionLogDetails);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// TABLE - TBL_QUEXPRESS_CUSTOMERS

//route for customer registration
app.post('/customer/create', async (req, res) => {
  const userDetails   = req.body;
  const accountId     = userDetails.accountId;
  const firstName     = userDetails.firstName;
  const lastName      = userDetails.lastName;
  const mobileNumber  = userDetails.mobileNumber;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO quexpress.tbl_quexpress_customers (account_id, customer_first_name, customer_last_name, customer_number, enabled_datetime) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *', [accountId , firstName, lastName, mobileNumber]);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//route for customer login
app.get('/customer/get/:accountId', async (req, res) => {
  const accountId = req.params.accountId;

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM quexpress.tbl_quexpress_customers WHERE account_id = $1', [accountId]);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// TABLE - TBL_QUEXPRESS_TRANSACTIONS

// Route for transaction types
app.get('/transactions/get/:description', async (req, res) => {
  const description = req.params.description;
  let queryString = '';
  try {
    const client = await pool.connect();
    if (description === 'CEDULA' || description === 'REAL PROPERTY TAX') {
      queryString = await client.query('SELECT * FROM quexpress.tbl_quexpress_transactions WHERE transaction_desc = $1', [description]);
    } else {
      queryString = await client.query('SELECT * FROM quexpress.tbl_quexpress_transactions WHERE (transaction_desc || \' \' || sub_transaction_desc) = $1', [description]);
    }
    res.json(queryString.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// TABLE - TBL_QUEXPRESS_TRANSACTION_LOG

// Route to create a transaction
app.post('/transaction_log/create', async (req, res) => {
  const transactionData      = req.body;
  const transactionId        = transactionData.transactionId;
  const customerId           = transactionData.customerId;
  const customerAccountId    = transactionData.customerAccountId;
  const queueNumber          = transactionData.queueNumber;
  const windowId             = transactionData.windowId;
  const staffId              = transactionData.staffId ?? null;
  const date                 = transactionData.date;
  const startTime            = transactionData.startTime ?? null;
  const endTime              = transactionData.endTime ?? null;
  const refQueue             = transactionData.refQueueNumber ?? null;
  const transactionStatus    = transactionData.transactionStatus ?? null;
  const transactionPass      = transactionData.transactionPass ?? null;
  
  try {
    const queryString = 'INSERT INTO quexpress.tbl_quexpress_transaction_log (transaction_id,'
      + ' customer_id, customer_account_id, transactions_queue, window_id, staff_id, transaction_datetime,'
      + ' transaction_starttime, transaction_endtime, transaction_ref, transaction_status, transaction_pass) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
    const transactionLogDetails = [
      transactionId, 
      customerId,
      customerAccountId,
      queueNumber,
      windowId,
      staffId,
      date,
      startTime,
      endTime,
      refQueue,
      transactionStatus,
      transactionPass,
    ];
    const client = await pool.connect();
    const result = await client.query(queryString, transactionLogDetails);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Displaying QueueNumber to monitor
app.get('/transaction_log/get/:transactionCode', async (req, res) => {
  let transactionCode = req.params.transactionCode + '%';
  let queryParameters = [];
  try { 
    const baseQuery = 'SELECT * FROM quexpress.tbl_quexpress_transaction_log'
                    + ' WHERE transaction_datetime >= CURRENT_DATE'
                    + ' AND transaction_status IS NOT NULL'

    if (transactionCode === 'BPLO1%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'BPI%\' OR transactions_queue LIKE \'BPN%\' OR transactions_queue LIKE \'BPR%\''
      + ' OR transactions_queue LIKE \'BPC%\' OR transactions_queue LIKE \'POI%\' OR transactions_queue LIKE \'POR%\')';
    } else if (transactionCode === 'BPLO2%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'MYI%\' OR transactions_queue LIKE \'MYR%\' OR transactions_queue LIKE \'MYT%\''
      + ' OR transactions_queue LIKE \'WPI%\' OR transactions_queue LIKE \'WPR%\' OR transactions_queue LIKE \'WPT%\' OR ((transaction_ref LIKE \'WP%\' OR transaction_ref LIKE \'MY%\') AND transactions_queue LIKE \'BTC%\'))';
    } else if (transactionCode === 'BPLO3%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'BPT%\' OR transactions_queue LIKE \'BST%\''
      + ' OR transactions_queue LIKE \'BBT%\' OR transactions_queue LIKE \'BZT%\' OR transactions_queue LIKE \'BFT%\' OR transactions_queue LIKE \'POT%\''
      + ' OR (transaction_ref LIKE \'BP%\' OR transaction_ref LIKE \'BS%\' OR transaction_ref LIKE \'BB%\' OR transaction_ref LIKE \'BZ%\' OR transaction_ref LIKE \'BF%\' OR transaction_ref LIKE \'PO%\') AND transactions_queue LIKE \'BTC%\')'
    } else if (transactionCode === 'BPS%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'BSI%\' OR transactions_queue LIKE \'BSR%\')';
    } else if (transactionCode === 'BPB%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'BBI%\' OR transactions_queue LIKE \'BBR%\')';
    }  else if (transactionCode === 'BPZ%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'BZI%\' OR transactions_queue LIKE \'BZR%\')';
    } else if (transactionCode === 'BPF%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'BFI%\' OR transactions_queue LIKE \'BFR%\')';
    } else if (transactionCode === 'LBC%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'LBI%\' OR transactions_queue LIKE \'LBR%\')';
    } else if (transactionCode === 'LDC%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'LDI%\' OR transactions_queue LIKE \'LDR%\')';
    } else if (transactionCode === 'LMC%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'LMI%\' OR transactions_queue LIKE \'LMR%\')';
    } else if (transactionCode === 'LCC%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'LCB%\' OR transactions_queue LIKE \'LCD%\' OR transactions_queue LIKE \'LCM%\')';
    } else if (transactionCode === 'LCRT%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'LBT%\' OR transactions_queue LIKE \'LDT%\' OR transactions_queue LIKE \'LMT%\' OR transactions_queue LIKE \'LCT%\' OR transactions_queue LIKE \'LTC%\')';
    } else if (transactionCode === 'DTIM%') {
      var queryString = baseQuery + ' AND (transactions_queue LIKE \'DTI%\' OR transactions_queue LIKE \'DTR%\' OR transactions_queue LIKE \'DTP%\' OR transactions_queue LIKE \'DTT%\')';
    } else {
      var queryString = baseQuery + ' AND transactions_queue LIKE $1';

      queryParameters = [transactionCode];
    } 
    queryString += ' ORDER BY transaction_log_id desc limit 1'
    const client = await pool.connect();
    const result = await client.query(queryString, queryParameters);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for CSH Displaying QueueNumber to monitor
app.get('/transaction_log/CSH/:transactionCode', async (req, res) => {
  let transactionCode = req.params.transactionCode;
  let queryParameters = [];
  let queryString = '';

  try {
    // Base query with correctly closed subquery
    const baseQuery = 'SELECT * FROM quexpress.tbl_quexpress_transaction_log'
                    + ' WHERE transaction_datetime >= CURRENT_DATE'
                    + ' AND transaction_status IS NOT NULL'

    // Determine query based on transactionCode, making sure all parentheses match
    if (transactionCode === 'CSH1') {
      queryString = baseQuery + ' AND (((transaction_ref LIKE \'BP%\' OR transaction_ref LIKE \'MY%\' OR transaction_ref LIKE \'WP%\''
      + ' OR transaction_ref LIKE \'BS%\' OR transaction_ref LIKE \'BB%\' OR transaction_ref LIKE \'BZ%\' OR transaction_ref LIKE \'BF%\' OR transaction_ref LIKE \'PO%\') AND transactions_queue LIKE \'CSH%\')'
      + ' OR transactions_queue LIKE \'BPP%\' OR transactions_queue LIKE \'POP%\' OR transactions_queue LIKE \'MYP%\' OR transactions_queue LIKE \'WPP%\''
      + ' OR transactions_queue LIKE \'BSP%\' OR transactions_queue LIKE \'BBP%\' OR transactions_queue LIKE \'BZP%\' OR transactions_queue LIKE \'BFP%\') AND window_id = 14';
    } else if (transactionCode === 'CSH2') {
      queryString = baseQuery + ' AND (((transaction_ref LIKE \'BP%\' OR transaction_ref LIKE \'MY%\' OR transaction_ref LIKE \'WP%\''
      + ' OR transaction_ref LIKE \'BS%\' OR transaction_ref LIKE \'BB%\' OR transaction_ref LIKE \'BZ%\' OR transaction_ref LIKE \'BF%\' OR transaction_ref LIKE \'PO%\') AND transactions_queue LIKE \'CSH%\')'
      + ' OR transactions_queue LIKE \'BPP%\' OR transactions_queue LIKE \'POP%\' OR transactions_queue LIKE \'MYP%\' OR transactions_queue LIKE \'WPP%\''
      + ' OR transactions_queue LIKE \'BSP%\' OR transactions_queue LIKE \'BBP%\' OR transactions_queue LIKE \'BZP%\' OR transactions_queue LIKE \'BFP%\') AND window_id = 15';
    } else if (transactionCode === 'CSH3') {
      queryString = baseQuery + ' AND (transactions_queue LIKE \'RPT%\') AND window_id = 16';
    } else if (transactionCode === 'CSH4') {
      queryString = baseQuery + ' AND (transactions_queue LIKE \'RPT%\') AND window_id = 17';
    } else if (transactionCode === 'CSH5') {
      queryString = baseQuery + ' AND (transactions_queue LIKE \'CDL%\' OR transactions_queue LIKE \'RTP%\') AND window_id = 18';
    } else if (transactionCode === 'CSH6') {
      queryString = baseQuery + ' AND (transactions_queue LIKE \'CDL%\' OR transactions_queue LIKE \'RTP%\') AND window_id = 19';
    } else if (transactionCode === 'CSH7') {
      queryString = baseQuery + ' AND (transaction_ref LIKE \'LC%\' OR transaction_ref LIKE \'LB%\' OR transaction_ref LIKE \'LD%\' OR transaction_ref LIKE \'LM%\''
      + ' OR transactions_queue LIKE \'VLP%\' OR transactions_queue LIKE \'OTP%\' OR transactions_queue LIKE \'LBP%\' OR transactions_queue LIKE \'LDP%\''
      + ' OR transactions_queue LIKE \'LMP%\' OR transactions_queue LIKE \'LCP%\') AND window_id = 20';
    } else if (transactionCode === 'CSH8') {
      queryString = baseQuery + ' AND (transaction_ref LIKE \'LC%\' OR transaction_ref LIKE \'LB%\' OR transaction_ref LIKE \'LD%\' OR transaction_ref LIKE \'LM%\''
      + ' OR transactions_queue LIKE \'VLP%\' OR transactions_queue LIKE \'OTP%\' OR transactions_queue LIKE \'LBP%\' OR transactions_queue LIKE \'LDP%\''
      + ' OR transactions_queue LIKE \'LMP%\' OR transactions_queue LIKE \'LCP%\') AND window_id = 21';
    }
    // Execute query
    queryString += ' ORDER BY transaction_log_id desc limit 1'
    const client = await pool.connect();
    const result = await client.query(queryString, queryParameters);
    res.json(result.rows[0]);

    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Cancelled
app.get('/transaction_log/get', async (req, res) => {
  const transactionData = req.query;
  const transactionQueue = transactionData.transactionQueue;
  const transactionRef = transactionData.transactionRef ?? null; 
  const forClaim = transactionData.forClaim ?? null;
  const forCashier = transactionData.forCashier ?? null;
  let queryParameters = [];
  
  try {
    let queryString = 'SELECT * FROM quexpress.tbl_quexpress_transaction_log';

    if (transactionRef) {
      queryString += ' WHERE transaction_ref = $1';
      queryParameters.push(transactionRef);
    } else if (transactionQueue) {
      queryString += ' WHERE transactions_queue = $1';
      queryParameters.push(transactionQueue);
    }

    if (forClaim === true) {
      queryString += ' AND transactions_queue NOT LIKE \'CSH%\'';
    } else if (forCashier === true) {
      queryString += ' AND transactions_queue LIKE \'CSH%\'';
    }

    queryString += ' AND transaction_datetime >= CURRENT_DATE AND transaction_status IS NOT NULL'
    + ' ORDER BY transaction_log_id desc limit 1';

    const client = await pool.connect();
    const result = await client.query(queryString, queryParameters);
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/get_count', async (req, res) => {
  const transactionData = req.query;
  const transactionQueue = transactionData.transactionQueue;
  const transactionRef = transactionData.transactionRef ?? null; 
  const forClaim = transactionData.forClaim ?? null;
  const forCashier = transactionData.forCashier ?? null;
  let queryParameters = [];
  let queryString = '';

  try {
    if (!transactionRef) {
      queryString += 'SELECT COUNT(transactions_queue) AS finalcount FROM quexpress.tbl_quexpress_transaction_log'
      + ' WHERE transactions_queue = $1';
      queryParameters.push(transactionQueue);
    } else {
      queryString += 'SELECT COUNT(transaction_ref) AS finalcount FROM quexpress.tbl_quexpress_transaction_log'
      + ' WHERE transaction_ref = $1';
      queryParameters.push(transactionRef);
    }

    if (forClaim === 'true') {
      queryString += ' AND transactions_queue NOT LIKE \'CSH%\'';
    } else if (forCashier === 'true') {
      queryString += ' AND transactions_queue LIKE \'CSH%\'';
    }

    queryString += ' AND transaction_datetime >= CURRENT_DATE AND (transaction_status = \'cancelled\' OR transaction_status = \'on going\')'
    
    const client = await pool.connect();
    const result = await client.query(queryString, queryParameters);
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Displaying QueueNumber
app.get('/transaction_log/get/:transactionCode/:transactionStatus', async (req, res) => {
  let transactionCode = req.params.transactionCode;
  const transactionStatus = req.params.transactionStatus;
  try {
    var baseQuery = 'WITH latest_transactions AS (SELECT DISTINCT ON (transactions_queue) * FROM quexpress.tbl_quexpress_transaction_log AS A'
      + ' LEFT JOIN quexpress.tbl_quexpress_transactions AS B'
      + ' ON a.transaction_id = b.transaction_id'
      + ' LEFT JOIN quexpress.tbl_quexpress_customers AS C'
      + ' ON a.customer_id = c.customer_id';
      
    var queryParameters = [];
    if (transactionCode === 'BPLO1') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'BPI%\' OR transactions_queue LIKE \'BPN%\' OR transactions_queue LIKE \'BPR%\''
      + ' OR transactions_queue LIKE \'BPC%\' OR transactions_queue LIKE \'POI%\' OR transactions_queue LIKE \'POR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'BPLO2') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'MYI%\' OR transactions_queue LIKE \'MYR%\' OR transactions_queue LIKE \'MYT%\''
      + ' OR transactions_queue LIKE \'WPI%\' OR transactions_queue LIKE \'WPR%\' OR transactions_queue LIKE \'WPT%\''
      + ' OR ((transaction_ref LIKE \'MY%\' OR transaction_ref LIKE \'WP%\') AND transactions_queue LIKE \'BTC%\'))'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'BPLO3') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'BPT%\' OR transactions_queue LIKE \'BST%\' OR transactions_queue LIKE \'BBT%\' OR transactions_queue LIKE \'BZT%\' OR transactions_queue LIKE \'BFT%\''
      + '  OR transactions_queue LIKE \'POT%\' OR (transaction_ref LIKE \'BS%\' OR transaction_ref LIKE \'BB%\' OR transaction_ref LIKE \'BZ%\' OR transaction_ref LIKE \'BF%\' OR transaction_ref LIKE \'BP%\' OR transaction_ref LIKE \'PO%\') AND transactions_queue LIKE \'BTC%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'DTIM') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'DTI%\' OR transactions_queue LIKE \'DTR%\' OR transactions_queue LIKE \'DTP%\' OR transactions_queue LIKE \'DTT%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'BPS') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'BSI%\' OR transactions_queue LIKE \'BSR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'BPB') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'BBI%\' OR transactions_queue LIKE \'BBR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'BPZ') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'BZI%\' OR transactions_queue LIKE \'BZR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'BPF') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'BFI%\' OR transactions_queue LIKE \'BFR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'LBC') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'LBI%\' OR transactions_queue LIKE \'LBR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'LDC') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'LDI%\' OR transactions_queue LIKE \'LDR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'LMC') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'LMI%\' OR transactions_queue LIKE \'LMR%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'LCC') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'LCB%\' OR transactions_queue LIKE \'LCD%\' OR transactions_queue LIKE \'LCM%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'LCRT') {
      var queryString = baseQuery + ' where (transactions_queue LIKE \'LCT%\' OR transactions_queue LIKE \'LBT%\' OR transactions_queue LIKE \'LDT%\' OR transactions_queue LIKE \'LMT%\' OR transactions_queue LIKE \'LTC%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';

      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }

    } else if (transactionCode === 'CSH1' || transactionCode === "CSH2") {
      var queryString = baseQuery + ' WHERE (((transaction_ref LIKE \'BP%\' OR transaction_ref LIKE \'MY%\' OR transaction_ref LIKE \'WP%\' OR transaction_ref LIKE \'BP%\''
      + ' OR transaction_ref LIKE \'BS%\' OR transaction_ref LIKE \'BB%\' OR transaction_ref LIKE \'BZ%\' OR transaction_ref LIKE \'BF%\' OR transaction_ref LIKE \'PO%\') and transactions_queue like \'CSH%\')'
      + ' OR (transactions_queue LIKE \'BPP%\' OR transactions_queue LIKE \'POP%\' OR transactions_queue LIKE \'BSP%\' OR transactions_queue LIKE \'BBP%\' OR transactions_queue LIKE \'BZP%\' OR transactions_queue LIKE \'BFP%\' OR transactions_queue LIKE \'BBP%\' OR transactions_queue LIKE \'MYP%\' OR transactions_queue LIKE \'WPP%\'))'
      + ' and (transaction_datetime >= CURRENT_DATE';
      
      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }
    } else if (transactionCode === 'CSH3' || transactionCode === "CSH4") {
      var queryString = baseQuery + ' WHERE (transactions_queue LIKE \'RPT%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';
      
      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }
    } else if (transactionCode === 'CSH5' || transactionCode === "CSH6") {
      var queryString = baseQuery + ' WHERE (transactions_queue LIKE \'CDL%\' OR transactions_queue LIKE \'RTP%\')'
      + ' and (transaction_datetime >= CURRENT_DATE';
      
      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }
    } else if (transactionCode === 'CSH7' || transactionCode === "CSH8") {
      var queryString = baseQuery + ' WHERE (((transaction_ref LIKE \'LC%\' OR transaction_ref LIKE \'LB%\' OR transaction_ref LIKE \'LD%\' OR transaction_ref LIKE \'LM%\') and transactions_queue like \'CSH%\')'
      + ' OR (transactions_queue LIKE \'VLP%\' OR transactions_queue LIKE \'OTP%\''
      + ' OR transactions_queue LIKE \'LBP%\' OR transactions_queue LIKE \'LDP%\' OR transactions_queue LIKE \'LMP%\' OR transactions_queue LIKE \'LCP%\'))'
      + ' and (transaction_datetime >= CURRENT_DATE';
      
      if (transactionStatus === 'toQueue') {
        queryString += ') and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' or transaction_datetime <= CURRENT_DATE) and (transaction_status IS NOT NULL)';
      }
    } else {
      var queryString = baseQuery + ' where transactions_queue LIKE $1';
      transactionCode += '%';
      queryParameters.push(transactionCode);

      if (transactionStatus === 'toQueue') {
        queryString += ' and transaction_datetime >= CURRENT_DATE'
        + ' and (transaction_status IS NULL)';
        
      } else if (transactionStatus === 'notForQueue') {
        queryString += ' and (transaction_datetime <= CURRENT_DATE or transaction_datetime >= CURRENT_DATE)'
        + ' and (transaction_status IS NOT NULL)';
      } 
    }
    queryString += ' order by transactions_queue, transaction_log_id desc)'
    + ' SELECT * FROM latest_transactions'
    + ' order by transaction_log_id asc';
    const client = await pool.connect();
    const result = await client.query(queryString, queryParameters);
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/admin/report', async (req, res) => {
  try {
    var queryParameters = [];
    var queryString = 'WITH latest_transactions AS ('
    + ' SELECT DISTINCT ON (transactions_queue) *'
    + ' FROM quexpress.tbl_quexpress_transaction_log AS A'
    + ' LEFT JOIN quexpress.tbl_quexpress_transactions AS B'
    + ' ON A.transaction_id = B.transaction_id'
    + ' LEFT JOIN quexpress.tbl_quexpress_customers AS C'
    + ' ON A.customer_id = C.customer_id'
    + ' WHERE transaction_datetime <= CURRENT_DATE'
    + ' AND transaction_status IS NOT NULL'
    + ' ORDER BY transactions_queue, transaction_log_id DESC)'
    + ' SELECT * FROM latest_transactions'
    + ' ORDER BY transaction_log_id DESC';
    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    res.json(queryResult.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/admin/total', async (req, res) => {
  try {
    var queryParameters = [];
    var queryString = 'WITH latest_transactions AS ('
    + ' SELECT DISTINCT ON (transactions_queue) *'
    + ' FROM quexpress.tbl_quexpress_transaction_log AS A'
    + ' LEFT JOIN quexpress.tbl_quexpress_transactions AS B'
    + ' ON A.transaction_id = B.transaction_id'
    + ' LEFT JOIN quexpress.tbl_quexpress_customers AS C'
    + ' ON A.customer_id = C.customer_id'
    + ' WHERE transaction_datetime >= CURRENT_DATE'
    + ' AND transaction_status IS NOT NULL'
    + ' ORDER BY transactions_queue, transaction_log_id DESC)'
    + ' SELECT count(*) as total_count'
    + ' FROM latest_transactions';
    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    res.json(queryResult.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/transaction_log/admin/:windowId', async (req, res) => {
  let windowId = req.params.windowId;
  try {
    var queryParameters = [];
    var queryString = 'WITH latest_transactions AS ('
    + ' SELECT DISTINCT ON (transactions_queue) *'
    + ' FROM quexpress.tbl_quexpress_transaction_log AS A'
    + ' LEFT JOIN quexpress.tbl_quexpress_transactions AS B'
    + ' ON A.transaction_id = B.transaction_id'
    + ' LEFT JOIN quexpress.tbl_quexpress_customers AS C'
    + ' ON A.customer_id = C.customer_id'
    + ' WHERE transaction_datetime >= CURRENT_DATE'
    + ' AND window_id = $1'
    + ' AND transaction_status IS NOT NULL'
    + ' ORDER BY transactions_queue, transaction_log_id DESC)'
    + ' SELECT window_id, count(*) as total_count'
    + ' FROM latest_transactions'
    + ' GROUP BY window_id'
    + ' ORDER BY window_id';
    queryParameters.push(windowId)
    const client = await pool.connect();
    const queryResult = await client.query(queryString, queryParameters);
    res.json(queryResult.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
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
  const transactionPass = transactionData ?? null;

  try {
    let queryString = 'UPDATE quexpress.tbl_quexpress_transaction_log SET transaction_status = $1';
    let transactionLogDetails = [status];

    if (transactionStartTime !== null) {
      queryString += ', transaction_starttime = $2';
      transactionLogDetails.push(transactionStartTime);
    } else {
      queryString += ', transaction_endtime = $2';
      transactionLogDetails.push(transactionEndTime);
    }

    if (transactionRef) {
      queryString += ' WHERE transaction_ref = $3';
      transactionLogDetails.push(transactionRef);
    } else {
      queryString += ' WHERE transactions_queue = $3';
      transactionLogDetails.push(transactionQueue);
    }
    if(transactionLogId){
      queryString += ' AND transaction_log_id = $4 AND transaction_datetime >= CURRENT_DATE';
      transactionLogDetails.push(transactionLogId);
    } else {
      queryString += ' AND transaction_datetime >= CURRENT_DATE';
    }
    
    if (forClaim === true) {
      queryString += ' AND transactions_queue not like \'CSH%\'';
    }
    if (forCashier === true) {
      queryString += ' AND transactions_queue like \'CSH%\'';
    }
    queryString += ' RETURNING *';
    const client = await pool.connect();
    const result = await client.query(queryString, transactionLogDetails);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


// Route to update staff id 
app.put('/transaction_log/updateStaff', async (req, res) => {
  const transactionData    = req.body;
  const transactionLogId   = transactionData.transactionLogId;
  const staffId   = transactionData.staffId;
  
  try {
    var queryString = 'UPDATE quexpress.tbl_quexpress_transaction_log SET staff_id = $1 where transaction_log_id = $2 RETURNING *';
    var transactionLogDetails = [
      staffId,
      transactionLogId,
    ];

    const client = await pool.connect();
    const result = await client.query(queryString, transactionLogDetails);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/transaction_log/updateWindow', async (req, res) => {
  const transactionData    = req.body;
  const transactionLogId   = transactionData.transactionLogId;
  const windowId           = transactionData.windowId;
  
  try {
    var queryString = 'UPDATE quexpress.tbl_quexpress_transaction_log SET window_id = $1 where transaction_log_id = $2 RETURNING *';
    var transactionLogDetails = [
      windowId,
      transactionLogId,
    ];

    const client = await pool.connect();
    const result = await client.query(queryString, transactionLogDetails);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to admin dashboard

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
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
app.put('/users/updateAdvertisement', upload.single('file'), async(req, res) => {
  try {
    // File Upload
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`; // Adjust URL as needed
    res.json({ file: fileUrl });
    // END - File Upload

    // Update user table for advertisement
    var queryString = 'UPDATE quexpress.tbl_quexpress_users'
      + ' SET advertisement = $1'
      + ' where access_id = 1'
      + ' RETURNING *';
    var advertisement = [fileUrl]
    const client = await pool.connect();
    const result = await client.query(queryString, advertisement);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to get user details
app.get('/users/getAdvertisement', async (req, res) => {
  const userId = req.params.userId;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM quexpress.tbl_quexpress_users WHERE access_id = 1');
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for Announcement
app.put('/users/updateAnnouncement', async (req, res) => {
  const { announcement } = req.body;
  try {
    const queryString = 'UPDATE quexpress.tbl_quexpress_users SET announcement = $1 WHERE access_id = 1 RETURNING *';
    const transactionLogDetails = [announcement];

    const client = await pool.connect();
    const result = await client.query(queryString, transactionLogDetails);
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to get Announcement
app.get('/users/getAnnouncement', async (req, res) => {
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM quexpress.tbl_quexpress_users WHERE access_id = 1');
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for video ads upload
app.put('/transaction_log/updateBlink/:transactionLogId', async (req, res) => {
  try {
    const transactionLogId = req.params.transactionLogId;
    const requestBody    = req.body;
    const transactionBlink   = requestBody.blink;
    var queryString = 'UPDATE quexpress.tbl_quexpress_transactions'
      + ' SET blink = $1'
      + ' where transaction_code LIKE $2'
      + ' RETURNING *';
    var transactionData = [transactionBlink, transactionLogId];
    const client = await pool.connect();
    const result = await client.query(queryString, transactionData);
    res.json(true);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route for transaction types blink status
app.get('/transactions/getBlink/:transactionCode', async (req, res) => {
  const transactionCode = req.params.transactionCode;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM quexpress.tbl_quexpress_transactions WHERE transaction_code = $1', [transactionCode]);
    res.json(result.rows[0]);
    client.release();
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
// const bluetooth = require('node-bluetooth');

// const device = new bluetooth.DeviceINQ();

// device.listPairedDevices((devices) => {
//   console.log('Paired devices:', devices);
// });

// app.post('/api/print', (req, res) => {
//   const { textToPrint1, textToPrint2, textToPrint3 } = req.body;
//   const connection = new bluetooth.DeviceINQ();
//   connection.findSerialPortChannel('Printer-Name', (channel) => {
//     console.log('Channel found:', channel);

//     const printer = new bluetooth.SerialPort();
//     printer.connect('Printer-Address', channel, (err) => {
//       if (err) return console.error('Error connecting:', err);

//       console.log('Connected to printer!');
//       const escposCommands = `
//         \x1B\x40                // Initialize printer
//         \x1B\x61\x01            // Align center
//         ${textToPrint1}\x0A     // Print textToPrint1 (normal size, centered)
//         \x1B\x21\x30            // Set quadruple size (double height + double width)
//         \x1B\x45\x01            // Enable bold
//         ${textToPrint2}\x0A     // Print textToPrint2 (quadruple size, bold, centered)
//         \x1B\x21\x00            // Reset size to normal
//         \x1B\x45\x00            // Disable bold
//         ${textToPrint3}\x0A     // Print textToPrint3 (normal size, centered)
//         \x1D\x56\x00            // Full cut
//       `;
//       printer.write(Buffer.from(escposCommands), () => {
//         console.log('Data sent to printer.');
//         printer.close();
//       });
//     });
//   });  
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});