'use server'

import { createReviewSchema, imageSchema, profileSchema, propertySchema, validateWithZodSchema } from "./schemas";
import db from './db'
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "./supabase";

const getAuthuser = async()=>{
    const user = await currentUser();
    if(!user){
        throw new Error('You must be logged in to access this route');
    }
    if(!user.privateMetadata.hasProfile) redirect('/profile/create');
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
    return { message: 'fetch user reviews' };
};

export const deleteReviewAction = async () => {
    return { message: 'delete  reviews' };
};