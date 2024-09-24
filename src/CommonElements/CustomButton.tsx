import React from 'react';
import Button from '@mui/material/Button';
import { useMediaQuery } from 'react-responsive';


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

  const isMobile = useMediaQuery({ query: '(max-width: 600px)' });
  const isTablet = useMediaQuery({ query: '(min-width: 601px) and (max-width: 1024px)' });
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const getFontSize = () => {
    if (isMobile) return '10px';
    if (isTablet) return '20px';
    if (isDesktop) return '24px';
    return '20px'; // Default size if none of the conditions match
  };

  return (
    <Button
    style={{minWidth:'auto', minHeight:'auto', fontSize: getFontSize(), fontFamily:'serif'}}
    type="submit"
    fullWidth
    size='large'
    variant="contained"
    sx={{ mt: 1, mb: 1}}
    onClick={handleClick}>
        {children}
    </Button>
  );
};

export default CustomButton;
