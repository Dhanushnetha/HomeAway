'use client'

import { useSearchParams } from 'next/navigation'
import {loadStripe} from '@stripe/stripe-js'
import { useCallback } from 'react';
import axios from 'axios';
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from '@stripe/react-stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function CheckOut() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const fetchClientSecret = useCallback(async ()=>{
    const response = await axios.post('/api/payment',{bookingId: bookingId});
    return response.data.clientSecret;
  },[]);

  const options = {fetchClientSecret};

  return (
    <div id='checkout'>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}

export default CheckOut