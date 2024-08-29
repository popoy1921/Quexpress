import React from 'react';

const UniqueNumber = (): string => {
  // Get current date and time
  const currentDateTime = new Date();

  // Extract year, month, day, hour, minute, second
    if((currentDateTime.getMonth() + 1) < 10){
        if(currentDateTime.getDate() < 10){
            const year = currentDateTime.getFullYear();
            const month = '0' + (currentDateTime.getMonth() + 1); // Month is zero-indexed, so add 1
            const day = '0' + currentDateTime.getDate();
            const hour = currentDateTime.getHours();
            const minute = currentDateTime.getMinutes();
            const second = currentDateTime.getSeconds();
            return year+''+month+''+day+''+hour+''+minute+''+second;
        }
        else
        {
            const year = currentDateTime.getFullYear();
            const month = '0' + (currentDateTime.getMonth() + 1); // Month is zero-indexed, so add 1
            const day =  currentDateTime.getDate();
            const hour = currentDateTime.getHours();
            const minute = currentDateTime.getMinutes();
            const second = currentDateTime.getSeconds();
            return year+''+month+''+day+''+hour+''+minute+''+second;
        }
    }
    else
    {
        if(currentDateTime.getDate() < 10){
            const year = currentDateTime.getFullYear();
            const month = (currentDateTime.getMonth() + 1); // Month is zero-indexed, so add 1
            const day = '0' + currentDateTime.getDate();
            const hour = currentDateTime.getHours();
            const minute = currentDateTime.getMinutes();
            const second = currentDateTime.getSeconds();
            return year+''+month+''+day+''+hour+''+minute+''+second;
        }
        else
        {
            const year = currentDateTime.getFullYear();
            const month = (currentDateTime.getMonth() + 1); // Month is zero-indexed, so add 1
            const day =  currentDateTime.getDate();
            const hour = currentDateTime.getHours();
            const minute = currentDateTime.getMinutes();
            const second = currentDateTime.getSeconds();
            return year+''+month+''+day+''+hour+''+minute+''+second;
        }
    }
};

export default UniqueNumber;
