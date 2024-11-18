import React from 'react';
import Button from '@mui/material/Button';
import { useMediaQuery } from 'react-responsive';


interface ButtonProps {
  details: any;
  destination: string;
  windowId: number[];
  children: React.ReactNode;
  disabled?: boolean; // Add a prop to handle button state
}

const CustomButton: React.FC<ButtonProps> = ({ details, destination, windowId, children, disabled = false }) => {
  const handleClick = (event : any) => {
    event.preventDefault();
    if(!disabled){
      console.log(destination)
      navigateTo(destination, details);
      localStorage.setItem('TransactionType', details);
    }
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
    if (isTablet) return '15px';
    if (isDesktop) return '23px';
    return '20px'; // Default size if none of the conditions match
  };

  return (
    <Button
    style={{minWidth:'auto', minHeight:'auto', fontSize: getFontSize(), fontFamily:'serif'}}
    type="submit"
    fullWidth
    size='large'
    variant="contained"
    disabled={disabled}
    sx={{ 
      mt: 1,
      mb: 1,
      borderRadius: '20px',
      fontFamily:'serif',
      transition: 'background-color 0.3s, transform 0.3s',
      backgroundColor: disabled ? '#d3d3d3' : '#4caf50', // Different background if disabled
        '&:hover': {
          backgroundColor: disabled ? '#d3d3d3' : '#228B22',
          transform: disabled ? 'none' : 'scale(1.05)',
        },
      }}
    onClick={handleClick}>
        {children}
    </Button>
  );
};

export default CustomButton;
