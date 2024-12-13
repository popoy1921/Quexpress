// /api/sendOtp.js

import { createClient } from 'twilio';

// Initialize Twilio client
const accountSid = process.env.REACT_APP_TWILIO_ACCOUNTSID;
const authToken = process.env.REACT_APP_TWILIO_TOKEN;
const verifySid = process.env.REACT_APP_TWILIO_VERIFYSID;

if (!accountSid || !authToken || !verifySid) {
  console.error("Twilio credentials missing.");
}

const client = createClient(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required.' });
    }

    // Ensure the mobile number starts with '+63' (adjust based on your country code)
    if (!mobileNumber.startsWith('+63')) {
      mobileNumber = '+63' + mobileNumber.replace(/^\+63?/, '');
    }

    try {
      const verification = await client.verify.v2.services(verifySid)
        .verifications.create({ to: mobileNumber, channel: "sms" });

      console.log(`Verification sent to ${mobileNumber}: Status - ${verification.status}`);
      return res.json({ message: 'OTP sent successfully!' });
    } catch (err) {
      console.error('Error sending OTP:', err.message);
      return res.status(500).json({ message: 'Failed to send OTP.', error: err.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}