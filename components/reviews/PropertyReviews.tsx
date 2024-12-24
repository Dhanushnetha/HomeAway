import { fetchPropertyReviews } from "@/utils/actions"
import Title from "../properties/Title";
import ReviewCard from "./ReviewCard";

async function PropertyReviews({propertyId}: {propertyId:string}) {
    const reviews = await fetchPropertyReviews(propertyId);
    if(reviews.length < 1)return null;
    
  return (
    <div className="mt-8">
        <Title text="Reviews" />
        <div className="grid md:grid-cols-2 gap-8 mt-4">
            {reviews.map((review)=>{
                const {comment, rating, profile:{firstName: name, profileImage: image}} = review;
                // const {firstName: name, profileImage: image} = review.profile;
                const reviewInfo = {comment, rating, name , image};
                return <ReviewCard key={review.id} reviewInfo={reviewInfo} />
            })}
        </div>
    </div>
  )
}

export default PropertyReviews