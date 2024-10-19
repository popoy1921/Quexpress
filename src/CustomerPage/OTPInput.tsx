import React, { useEffect, useState } from 'react';
import { TextField, Grid, createTheme, ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';

interface OTPInputProps {
  length: number; // Length of the OTP
  onChange: (otp: string) => void; // Callback for when the OTP changes
}

// Create a custom MUI theme to apply green styling
const theme = createTheme({
  palette: {
    primary: {main: '#228B22'},
  }
});

const OTPInput: React.FC<OTPInputProps> = ({ length, onChange }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    // Move to the next input field if a digit is entered
    if (value && index < length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }

    // Move back to the previous input field if deleted
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }

    setOtp(newOtp);
    onChange(newOtp.join(''));
  };

  useEffect(() => {
    // Automatically focus on the first input when the component mounts
    const firstInput = document.getElementById(`otp-input-0`);
    if (firstInput) {
      (firstInput as HTMLInputElement).focus();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={1} justifyContent="center">
        {otp.map((digit, index) => (
          <Grid item xs={1.5} key={index}>
            <TextField
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onFocus={(e) => e.target.select()}
              inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '24px', color: green[700], width: 15 } }}
              variant="outlined"
              size="small"
              color="primary" // Apply green color to border and focus
            />
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
};

export default OTPInput;
