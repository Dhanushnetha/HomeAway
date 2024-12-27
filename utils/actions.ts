'use server'

import { createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema } from "./schemas";
import db from './db'
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "./supabase";
import { calculateTotals } from "./calculateTotals";

const getAuthuser = async()=>{
    const user = await currentUser();
    if(!user){
        throw new Error('You must be logged in to access this route');
    }
    if(!user.privateMetadata.hasProfile) redirect('/profile/create');
    return user;
}

const getAdminUser = async()=>{
    const user = await getAuthuser();
    if(user.id !== process.env.ADMIN_USERID) redirect('/');
    return user;
}

const renderError = (error:unknown):{message: string}=>{
    return {message: error instanceof Error ? error.message : 'An error occured'}
}

export const creatProfileAction = async(prevState: any, formData: FormData)=>{
    try{
        const user = await currentUser();
        if(!user) throw new Error('Please login to create a profile');
        // await new Promise(resolve => setTimeout(resolve, 2 * 1000));
        const rawData = Object.fromEntries(formData);
        const validatedData = validateWithZodSchema(profileSchema, rawData);
        await db.profile.create({
            data:{
                clerkId: user?.id,
                email: user.emailAddresses[0].emailAddress,
                profileImage: user.imageUrl ?? '',
                ...validatedData
            }
        });
        await clerkClient.users.updateUserMetadata(user.id, {
            privateMetadata:{
                hasProfile: true
            },
        })
        // console.log(rawData, 'bbj');
        // return {message: 'Profile created'};
    }
    catch (error) {
        return renderError(error);
    }
    redirect('/');
    // const firstName = formData.get('firstName') as string;
    // console.log(firstName);
    // const form = Object.fromEntries(formData);
    // console.log(form, 'from utils');
    
    // return {message: 'Profile Created'};
}

export const fetchProfileImage = async()=>{
    try{
        const user = await currentUser();
        if(!user) return null;

        const profile = await db.profile.findUnique({
            where:{
                clerkId: user.id
            },
            select:{
                profileImage: true,
            }
        });
        return profile?.profileImage;
    }
    catch(error){

    }
}

export const fetchProfile = async ()=>{
    const user = await getAuthuser();
        if(!user) return null;

    const profile = await db.profile.findUnique({
        where: {
            clerkId: user.id,
        }
    })
    if(!profile) redirect('/profile/create');
    return profile;
}

export const updateProfileAction = async(prevState: any, formData:FormData): Promise<{message: string}>=>{
    const user = await getAuthuser();
    
    try{
        const rawData = Object.fromEntries(formData);
        const validatedData = validateWithZodSchema(profileSchema, rawData);
        await db.profile.update({
            where: {
                clerkId: user.id
            },
            data: validatedData
            
        })
        revalidatePath('/profile')
    
        return {message: 'Updated successfully'};
    }
    catch(error){
        return renderError(error);
    }
}

export const updateProfileImageAction = async(prevState: any, formData: FormData): Promise<{message: string}>=>{

    const user = await getAuthuser();
    try{
        const image = formData.get('image') as File;
        const validatedFields = validateWithZodSchema(imageSchema, {image});

        const fullPath = await uploadImage(validatedFields.image);

        await db.profile.update({
            where:{
                clerkId: user.id
            },
            data:{
                profileImage: fullPath
            }
        });
        revalidatePath('/profile');
        return {message: 'Profile Image updated successfully'};
    }catch(error){
        return renderError(error);
    }

}

export const createPropertyAction = async (prevState:any, formData:FormData): Promise<{message: string}>=>{
    const user = await getAuthuser();
    try{
        const rawData = Object.fromEntries(formData);
        const file = formData.get('image') as File;

        const validatedFields = validateWithZodSchema(propertySchema, rawData);
        const validateFile = validateWithZodSchema(imageSchema, {image: file});
        const fullPath = await uploadImage(validateFile.image);

        await db.property.create({
            data: {
                ...validatedFields,
                image: fullPath,
                profileId: user.id
            },
        })

        // return {message: 'property created successfully'}
    }catch(error){
        return renderError(error);
    }
    redirect('/');
}

export const fetchProperties = async({search='', category}:{search?: string, category?: string})=>{
    const properties = await db.property.findMany({
        where:{
            category,
            OR:[
                {name: {contains: search, mode: 'insensitive'}},
                {tagline: {contains: search, mode:'insensitive'}}
            ]
        },
        select:{
            id: true,
            name:true,
            tagline: true,
            country: true,
            price: true,
            image: true
        },
        orderBy:{
            createdAt: 'desc'
        }
    });
    return properties;
}

export const fetchFavoriteId = async({propertyId}:{propertyId: string})=>{
    const user = await getAuthuser();
    const favorite = await db.favorite.findFirst({
        where:{
            propertyId,
            profileId: user.id,
        },
        select:{
            id: true,
        },
    });
    return favorite?.id || null;
}

export const toggleFavoriteAction = async (prevState:{
    propertyId:string;
    favoriteId: string | null;
    pathname: string;
})=>{
    const user = await getAuthuser();
    const {favoriteId, pathname, propertyId} = prevState;
    try{
        if(favoriteId){
            await db.favorite.delete({
                where:{
                    id: favoriteId
                }
            });
        }
        else{
            await db.favorite.create({
                data:{
                    propertyId,
                    profileId: user.id
                }
            });
        }
        revalidatePath(pathname);
        return {message: favoriteId ? 'Removed from Favs': 'Added to Favs'};
    }catch(error){
        return renderError(error);
    }
}

export const fetchFavorites = async ()=>{
    const user = await getAuthuser();
    const favorites = await db.favorite.findMany({
        where:{
            profileId: user.id
        },
        select:{
            property: {
                select:{
                    id: true,
                    name: true,
                    tagline: true,
                    country: true,
                    price: true,
                    image: true
                }
            }
        }
    });
    return favorites.map((favorite)=> favorite.property);
}

export const fetchPropertyDetails = (id:string)=>{
    return db.property.findUnique({
        where:{
            id
        },
        include:{
            profile: true,
            bookings:{
                select: {
                    checkIn: true,
                    checkOut: true,
                }
            }
        }
    })
}

export const createReviewAction = async (prevState:any, formData:FormData) => {
    const user= await getAuthuser();
    try{
        const rawData = Object.fromEntries(formData);
        const validatedData = validateWithZodSchema(createReviewSchema, rawData);

        await db.review.create({
            data:{
                ...validatedData,
                profileId: user.id,
            },
        });
        revalidatePath(`/properties/${validatedData.propertyId}`)
        return { message: 'Review submitted successfully' };
    }catch(error){
        return renderError(error);
    }
};

export const fetchPropertyReviews = async (propertyId:string) => {
    const reviews = await db.review.findMany({
        where: {
            propertyId,
        },
        select:{
            id: true,
            rating: true,
            comment: true,
            profile:{
                select:{
                    firstName: true,
                    profileImage: true,
                }
            }
        },
        orderBy:{
            createdAt: "desc",
        }
    })
    return reviews;
};

export const fetchPropertyReviewsByUser = async () => {
    const user = await getAuthuser();
    const reviews = await db.review.findMany({
        where:{
            profileId: user.id
        },
        select:{
            id: true,
            rating: true,
            comment: true,
            property:{
                select:{
                    name: true,
                    image: true
                }
            }
        }
    })
    return reviews;
};

export const deleteReviewAction = async (prevState:{reviewId:string}) => {
    const {reviewId} = prevState;
    const user = await getAuthuser();

    try{
        await db.review.delete({
            where:{
                id: reviewId,
                profileId: user.id
            }
        });
        revalidatePath('/reviews');
        return { message: 'Review deleted successfully'};
    }catch(error){
        return renderError(error);
    }

};

export async function fetchPropertyRating(propertyId:string){
    const result = await db.review.groupBy({
        by: ['propertyId'],
        _avg: {
            rating:true,
        },
        _count: {
            rating: true,
        },
        where:{
            propertyId,
        },
    });
    return {rating: result[0]?._avg.rating?.toFixed() ?? 0, count: result[0]?._count.rating ?? 0};
}

export const findExisitingReview = async (userId: string, propertyId: string)=>{
    return db.review.findFirst({
        where:{
            profileId: userId,
            propertyId,
        }
    })
}

export const createBookingAction = async(prevState:{propertyId: string, checkIn: Date, checkOut:Date})=>{    
    const user = await getAuthuser();
    const {checkIn, checkOut, propertyId} = prevState;
    const property = await db.property.findUnique({
        where: {
            id: propertyId,
        },
        select:{
            price: true,
        }
    });
    if(!property) return {message: "Property not found"};

    const {orderTotal, totalNights} = calculateTotals({
        checkIn, checkOut, price:property.price
    });

    try{
        const booking = await db.booking.create({
            data:{
                checkIn, checkOut, orderTotal, totalNights, profileId: user.id, propertyId
            }
        });
    }
    catch(error){
        return renderError(error);
    }
    redirect('/bookings');
}

export const fetchBookings = async ()=>{
    const user = await getAuthuser();
    const bookings = await db.booking.findMany({
        where:{
            profileId: user.id,
        },
        include:{
            property:{
                select:{
                    id: true,
                    name: true,
                    country: true
                }
            }
        },
        orderBy:{
            createdAt: 'desc'
        }
    });
    return bookings;
}

export const deleteBookingAction = async(prevState:{bookingId: string})=>{
    const {bookingId} = prevState;
    const user = await getAuthuser();

    try{
        const result = await db.booking.delete({
            where:{
                id: bookingId,
                profileId: user.id
            }
        })
        revalidatePath('/bookings');
        return {message: 'Booking deleted successfully!'};
    }catch(error){
        return renderError(error);
    }
}

export const deleteRentalAction = async (prevState:{propertyId: string})=>{
    const {propertyId} = prevState;
    const user = await getAuthuser();
    try {
        await db.property.delete({
            where:{
                id: propertyId,
                profileId: user.id,
            }
        });
        revalidatePath('/rentals');
        return {message: 'Rental deleted successfully'};
    } catch (error) {
        return renderError(error);
    }
}

export const fetchRentals = async()=>{
    const user = await getAuthuser();
    const rentals = await db.property.findMany({
        where:{
            profileId: user.id,
        },
        select:{
            id: true,
            name: true,
            price: true,
            bookings:{
                select:{
                    orderTotal: true,
                    totalNights: true,
                }
            }
        }
    });
    const rentalsWithTotals = rentals.map((rental) => ({
        ...rental,
        orderTotalSum: rental.bookings.reduce((sum, booking) => sum + booking.orderTotal, 0),
        totalNightsSum: rental.bookings.reduce((sum, booking)=> sum + booking.totalNights, 0),
    }));
    return rentalsWithTotals;
    // console.log(rentalsWithTotals, 'loggg');

}

export const fetchRentalDetails = async(propertyId: string)=>{
    const user = await getAuthuser();
    const rentalDetails = await db.property.findUnique({
        where:{
            id: propertyId,
            profileId: user.id,
        }
    })
    return rentalDetails;
}

export const updatePropertyAction = async (prevState:any, formData:FormData): Promise<{message: string}>=>{
    const user = await getAuthuser();
    const propertyId = formData.get('id') as string;
    try {
        const rawData = Object.fromEntries(formData);
        const validatedData = validateWithZodSchema(propertySchema, rawData);
        await db.property.update({
            where:{
                id: propertyId,
                profileId: user.id,
            },
            data: {
                ...validatedData,
            }
        });
        revalidatePath(`/rentals/${propertyId}/edit`);
        return {message: 'Property updated successfully'};
    } catch (error) {
        return renderError(error);
    }
}

export const updatePropertyImageAction = async (prevState:any, formData:FormData): Promise<{message: string}>=>{
    const user = await getAuthuser();
    const propertyId = formData.get('id') as string;

    try {
        const file = formData.get('image') as File;

        const validateFile = validateWithZodSchema(imageSchema, {image: file});
        const fullPath = await uploadImage(validateFile.image);
        await db.property.update({
            where:{
                profileId: user.id,
                id: propertyId,
            },
            data:{
                image: fullPath,
            }
        });
        revalidatePath(`rentals/${propertyId}/edit`);
        return {message: 'Property Image updated successfully'};
    } catch (error) {
        return renderError(error);
    };
}

export const fetchReservations = async()=>{
    const user = await getAuthuser();

    const reservations = await db.booking.findMany({
        where:{
            property:{
                profileId: user.id,
            }
        },
        orderBy:{
            createdAt: 'desc'
        },
        include:{
            property:{
                select:{
                    id: true,
                    name: true,
                    price: true,
                    country: true,
                }
            }
        }
    });
    return reservations;
}

export const fetchStats = async()=>{
    await getAdminUser();
    const usersCount = await db.profile.count();
    const propertiesCount = await db.property.count();
    const bookingsCount = await db.booking.count();

    return {usersCount, propertiesCount, bookingsCount};
}