import React from 'react';

const UniqueNumber = (): string => {
    const generateUniqueNumber = (): string => {
        const now = new Date();
        
        const year = now.getFullYear().toString().slice(-2); 
        const month = String(now.getMonth() + 1).padStart(2, '0'); 
        const day = String(now.getDate()).padStart(2, '0'); 

        
        const base = `${year}${month}${day}`;
        const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); 

        
        const uniqueNumber = (parseInt(base + randomPart, 10) % 1000000).toString().padStart(6, '0');
        
        return uniqueNumber;
    };

    return generateUniqueNumber();
};

export default UniqueNumber;
