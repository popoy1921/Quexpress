import React from 'react';
import { format } from 'date-fns';

interface MyDateTime {
  date: string;
  time: string;
}

function returnDateTime() {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd hh:mm:ss");
  const formattedTime = format(currentDate, "hh:mm:ss");

  return { formattedDate, formattedTime };
};

export default returnDateTime;
