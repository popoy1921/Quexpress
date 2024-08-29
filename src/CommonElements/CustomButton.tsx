import React from 'react';
import Button from '@mui/material/Button';
import { inherits } from 'util';

interface ButtonProps {
  details: any;
  destination: string;
  children: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({ details, destination, children}) => {
  const handleClick = (event : any) => {
    event.preventDefault();
    console.log(destination)
    navigateTo(destination, details);
    localStorage.setItem('TransactionType', details);
  };

  const navigateTo = (url: string, data: any) => {
    window.location.href = url; // Navigate to the destination page
    // You can also use other navigation methods here if you are using a routing library like react-router-dom
    // Example with react-router-dom:
    // history.push(url, data);
  };

  return (
    <Button
    style={{minWidth:500, minHeight:150, fontSize: 30, fontFamily:'serif'}}
    type="submit"
    fullWidth
    size='large'
    variant="contained"
    sx={{ mt: 3, mb: 2}}
    onClick={handleClick}>
        {children}
    </Button>
  );
};

export default CustomButton;
