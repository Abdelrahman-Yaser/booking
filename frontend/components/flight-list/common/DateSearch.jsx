'use client'

import React, { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

const DateSearch = ({ value, onChange, placeholder }) => {
  const [selectedDate, setSelectedDate] = useState(
    value ? new DateObject(value) : new DateObject()
  );

  useEffect(() => {
    if (value) {
      setSelectedDate(new DateObject(value));
    }
  }, [value]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange && date) {
      // Convert to YYYY-MM-DD format
      const formattedDate = date.format("YYYY-MM-DD");
      onChange(formattedDate);
    }
  };

  return (
    <div className="text-15 text-light-1 ls-2 lh-16">
      <DatePicker
        inputClass="custom_input-picker"
        containerClassName="custom_container-picker"
        value={selectedDate}
        onChange={handleDateChange}
        numberOfMonths={1}
        offsetY={10}
        format="MMMM DD"
        placeholder={placeholder || "اختر التاريخ"}
        calendarPosition="bottom-start"
      />
    </div>
  );
};

export default DateSearch;
