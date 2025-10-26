import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PopupDatePicker({ setDate }) {
  const [selectedDate, setselectedDate] = useState();
  return (
    <DatePicker
      selected={selectedDate ? selectedDate : ""}
      onChange={(date) => {
        setDate(date);
        setselectedDate(date);
      }} // returns the new date
      dateFormat="yyyy/MM/dd"
      placeholderText="Select a date"
    />
  );
}
