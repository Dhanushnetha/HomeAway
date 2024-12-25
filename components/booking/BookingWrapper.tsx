'use client'

import { useProperty } from "@/utils/store";
import { Booking } from "@/utils/types";
import { useEffect } from "react";
import BookingCalender from "./BookingCalender";
import BookingContainer from "./BookingContainer";


type BookingWrapperProps = {
    propertyId: string;
    price: number;
    bookings: Booking[]; 
}

function BookingWrapper({bookings, price, propertyId}:BookingWrapperProps) {
    useEffect(()=>{
        useProperty.setState({
            propertyId,
            price,
            bookings
        });
    }, [])
  return (
    <>
    <BookingCalender />
    <BookingContainer/>
    </>
  )
}

export default BookingWrapper