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
    user: 'postgres',
    host: 'localhost',
    database: 'QuExpress',
    password: '497663',
    port: 5432, // Default PostgreSQL port
});

// Middleware
app.use(express.json());
app.use(cors());

// TABLE - TBL_QUEXPRESS_WINDOW

// Route to windows
app.get('/window/get', async (req, res) => {
  try {
    var queryParameters = [];
    var queryString = 'SELECT a.window_id, a.window_desc, MAX(b.transactions_queue) AS transactions_queue'
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

// TABLE - TBL_QUEXPRESS_USERS

// Route to create a new user
app.post('/users/create', async (req, res) => {
  const userDetails = req.body;
  const firstName = userDetails.firstName;
  const lastName  = userDetails.lastName;
  const access    = userDetails.access;
  const email     = userDetails.email;
  const password  = userDetails.password;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO quexpress.tbl_quexpress_users (user_name, user_pass, access_id, user_first_name, user_last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *', [email , password, access, firstName, lastName]);
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
    var queryString = 'SELECT * FROM quexpress.tbl_quexpress_users';
    var result;
    if(userName !== 'all') {
      queryString += ' WHERE user_name = $1'
      queryParameters.push(userName);
    } else {
      queryString += ' WHERE (access_id = 2 or access_id = 3) and (removed = 0 or (removed is null))';
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
  const removed  = userDetails.removed ?? '0';
  
  var transactionLogDetails = [
    email,
    firstName,
    lastName,
    removed,
    userId,
    password
  ];
  try {
    var queryString = 'UPDATE quexpress.tbl_quexpress_users'
      + ' SET user_name = $1, user_first_name = $2'
      + ' ,user_last_name = $3, removed = $4, user_pass = $6'
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
    const result = await client.query('INSERT INTO quexpress.tbl_quexpress_customers (account_id, customer_first_name, customer_last_name, customer_number) VALUES ($1, $2, $3, $4) RETURNING *', [accountId , firstName, lastName, mobileNumber]);
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
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM quexpress.tbl_quexpress_transactions WHERE sub_transaction_desc = $1', [description]);
    res.json(result.rows[0]);
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
  
  try {
    const queryString = 'INSERT INTO quexpress.tbl_quexpress_transaction_log (transaction_id,'
      + ' customer_id, customer_account_id, transactions_queue, window_id, staff_id, transaction_datetime,'
      + ' transaction_starttime, transaction_endtime, transaction_ref) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
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
  try {    
    var queryString = 'SELECT * FROM quexpress.tbl_quexpress_transaction_log'
      + ' WHERE transactions_queue = (SELECT MAX(transactions_queue) FROM quexpress.tbl_quexpress_transaction_log'
      + ' WHERE transactions_queue LIKE $1 AND transaction_datetime >= CURRENT_DATE AND transaction_status IS NOT NULL)'
      + ' AND transactions_queue LIKE $1 AND transaction_datetime >= CURRENT_DATE AND transaction_status IS NOT NULL';
    var queryParameters = [transactionCode];
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
  let transactionCode = req.params.transactionCode + '%';
  try {    
    var queryString = 'SELECT * FROM quexpress.tbl_quexpress_transaction_log'
      + ' WHERE transactions_queue = (SELECT MAX(transactions_queue) FROM quexpress.tbl_quexpress_transaction_log'
      + ' WHERE transactions_queue LIKE $1 AND transaction_datetime >= CURRENT_DATE AND transaction_status IS NOT NULL)'
      + ' AND transactions_queue LIKE $1 AND transaction_datetime >= CURRENT_DATE AND transaction_status IS NOT NULL';
    var queryParameters = [transactionCode];
    const client = await pool.connect();
    const result = await client.query(queryString, queryParameters);
    res.json(result.rows[0]);
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
    var queryParameters = [];
    if (!/^CSH/.test(transactionCode)) {
      var queryString = 'SELECT * FROM quexpress.tbl_quexpress_transaction_log';
      var transactionCodeIndex = 2;
      if (transactionCode === 'all') {
        // for admin reports
        queryString += ' where (transaction_datetime <= CURRENT_DATE';
        transactionCodeIndex = 1;
      } else if (transactionCode === 'today') {
        // for admin today reports
        queryString += ' where (transaction_datetime >= CURRENT_DATE';
        transactionCodeIndex = 1;
      }else {
        // for teller reports
        queryString += ' where transactions_queue LIKE $1';
        transactionCode += '%';
        queryParameters.push(transactionCode);
      }
      
      if (transactionStatus === 'toQueue') {
        queryString += ' and transaction_datetime >= CURRENT_DATE';
        if (transactionCode === 'all' || transactionCode === 'today') {
          queryString += ')';
        }
        queryString += ' and (transaction_status IS NULL)';
      } else if (transactionStatus === 'notForQueue') {
        if (transactionCode === 'all' || transactionCode === 'today') {
          queryString += ' or transaction_datetime >= CURRENT_DATE)';
        } else {
          queryString += ' and (transaction_datetime <= CURRENT_DATE or transaction_datetime >= CURRENT_DATE)';
        }
        queryString += ' and (transaction_status IS NOT NULL)';
      } else if (transactionStatus === 'all') {
        queryString += ')';
      } else if (transactionStatus === 'alldone') {
        queryString += ' or transaction_datetime >= CURRENT_DATE)';
        queryString += ' and (transaction_status IS NOT NULL)';
      } else {
        queryString += ') and transaction_status = $' + transactionCodeIndex;
        queryParameters.push(transactionStatus);
      }
    } else {
      var queryString = 'SELECT * FROM quexpress.tbl_quexpress_transaction_log'
      + ' where transactions_queue LIKE $1';
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
    
    queryString += ' order by transactions_queue asc';
    const client = await pool.connect();
    const result = await client.query(queryString, queryParameters);
    res.json(result.rows);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
    
});

// Route to update status and end time
app.put('/transaction_log/update', async (req, res) => {
  const transactionData = req.body;
  const transactionQueue = transactionData.transactionQueue;
  const status = transactionData.status;
  const transactionRef = transactionData.transactionRef ?? null; 
  const transactionEndTime = transactionData.transactionEndTime ?? null;
  const transactionStartTime = transactionData.transactionStartTime ?? null;

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

    queryString += ' AND transaction_datetime >= CURRENT_DATE RETURNING *';
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
      + ' where transaction_code = $2'
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});