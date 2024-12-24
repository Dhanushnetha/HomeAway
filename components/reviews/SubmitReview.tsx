'use client'

import { useState } from "react"
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import FormContainer from "../form/FormContainer";
import { createReviewAction } from "@/utils/actions";
import Rating from "../form/Rating";
import TextAreaInput from "../form/TextAreaInput";
import { SubmitButton } from "../form/Buttons";

function SubmitReview({propertyId}: {propertyId: string}) {
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);

  return (
    <div className="mt-8">
        <Button onClick={()=> setIsReviewFormVisible((prev)=>!prev)} >
            Leave a Review
        </Button>
        {isReviewFormVisible && <Card  className="mt-8 p-8">
            <FormContainer action={createReviewAction}>
                <input type="hidden" name="propertyId" value={propertyId} />
                <Rating name="rating" />
                <TextAreaInput name="comment" labelText="your thoughts on this property" defaultValue="Amazing place !!!" />
                <SubmitButton text="Submit" className="mt-4" />
            </FormContainer>
            </Card>}
    </div>
  )
}

export default SubmitReview