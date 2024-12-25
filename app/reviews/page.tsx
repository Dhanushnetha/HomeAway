import { IconButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import EmptyList from '@/components/home/EmptyList';
import Title from '@/components/properties/Title';
import ReviewCard from '@/components/reviews/ReviewCard';
import { deleteReviewAction, fetchPropertyReviewsByUser } from '@/utils/actions';
import React from 'react'



const ReviewsPage = async () => {
  // await new Promise(resolve => setTimeout(resolve, 3 * 1000));
  const reviews = await fetchPropertyReviewsByUser();
  
  if(reviews.length == 0) return <EmptyList />
  return (
    <>
        <Title text="Your Reviews" />
        <section className="grid md:grid-cols-2 gap-8 mt-4">
            {reviews.map((review)=>{
                const {comment, rating, property:{name, image}} = review;
                // const {firstName: name, profileImage: image} = review.profile;
                const reviewInfo = {comment, rating, name , image};
                const deleteAction = deleteReviewAction.bind(null, {
                  reviewId: review.id
                })
                return (
                  <ReviewCard key={review.id} reviewInfo={reviewInfo}>
                    <FormContainer action={deleteAction}>
                        <IconButton actionType='delete' />
                    </FormContainer>
                  </ReviewCard>)
            })}
        </section>
    </>
  )
}

export default ReviewsPage