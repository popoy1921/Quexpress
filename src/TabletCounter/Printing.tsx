import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const responseUrl = process.env.REACT_APP_OTHER_BACKEND_SERVER + '/print'; // Ensure this is accessible and returning valid JSON
const printLink = `my.bluetoothprint.scheme://${responseUrl}`;

const Printing: React.FC = () => {
    const navigate = useNavigate();

    const handlePrintClick = () => {
        window.open(printLink, '_blank', 'noopener,noreferrer'); // Opens the link in a new tab
        alert('Print initiated');
        navigate("/");
    };

    return (
        <button 
            onClick={handlePrintClick} 
            style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
            Print
        </button>
    );
};

export default Printing;
