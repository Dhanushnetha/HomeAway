'use client'
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "../ui/calendar";
import { defaultSelected, generateBlockedPeriods, generateDateRange, generateDisabledDates } from "@/utils/calendar";
import { useProperty } from "@/utils/store";
import { useToast } from "../ui/use-toast";

function BookingCalender() {
    const currentDate = new Date();
    const [range, setRange] = useState<DateRange | undefined>(defaultSelected);

    const bookings = useProperty((state)=> state.bookings);

    const {toast} = useToast();

    const blockedPeriods = generateBlockedPeriods({
      bookings, today: currentDate,
    })

    const unavailableDates = generateDisabledDates(blockedPeriods);

    useEffect(()=>{
      const selectedRange = generateDateRange(range);

      const isDisabledDateIncluded = selectedRange.some((date)=>{
        if(unavailableDates[date]){
          setRange(defaultSelected);
          toast({
            description: 'Some dates are booked. Please select again',
          });
          return true;
        }
        return false;
      }) ;
      
      useProperty.setState({range});
    
    },[range])

  return (
    <Calendar mode="range" disabled={blockedPeriods} defaultMonth={currentDate} selected={range} onSelect={setRange} className="mb-4" />
  )
}

export default BookingCalender