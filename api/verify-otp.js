import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.REACT_APP_TWILIO_ACCOUNTSID;
const authToken = process.env.REACT_APP_TWILIO_TOKEN;
const verifySid = process.env.REACT_APP_TWILIO_VERIFYSID;

if (!accountSid || !authToken || !verifySid) {
  console.error("Twilio credentials missing.");
}

const client = twilio(accountSid, authToken); // Correct way to create the client

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }

    // Ensure the mobile number starts with '+63' (adjust based on your country code)
    if (!mobileNumber.startsWith('+63')) {
      mobileNumber = '+63' + mobileNumber.replace(/^\+63?/, '');
    }

    try {
      const verification_check = await client.verify.v2.services(verifySid)
        .verificationChecks.create({ to: mobileNumber, code: otp });

      if (verification_check.status === 'approved') {
        return res.json({ message: 'OTP verified successfully!' });
      } else {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
      }
    } catch (err) {
      console.error('Error verifying OTP:', err.message);
      return res.status(500).json({ message: 'Failed to verify OTP.', error: err.message });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}