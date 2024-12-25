'use client'
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "../ui/calendar";
import { defaultSelected } from "@/utils/calendar";
import { useProperty } from "@/utils/store";

function BookingCalender() {
    const currentDate = new Date();
    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

    useEffect(()=>{
        useProperty.setState({
            range
        });
    },[range])

  return (
    <Calendar mode="range" defaultMonth={currentDate} selected={range} onSelect={setRange} className="mb-4" />
  )
}

export default BookingCalender