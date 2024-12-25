'use client';

import { useProperty } from "@/utils/store";
import { BookingSignInButton, SubmitButton } from "../form/Buttons";
import { useAuth } from "@clerk/nextjs";
import FormContainer from "../form/FormContainer";
import { createBookingAction } from "@/utils/actions";

function ConfirmBooking() {
  const {userId} = useAuth();
  const {range, propertyId} = useProperty((state) => state);
  const checkIn = range?.from as Date;
  const checkOut = range?.to as Date;
  if(!userId) return <BookingSignInButton />

  const createBooking = createBookingAction.bind(null, {propertyId, checkIn, checkOut});

  return <section>
    <FormContainer action={createBooking} >
      <SubmitButton text='Reserve' className="w-full" />
    </FormContainer>
  </section>
}

export default ConfirmBooking