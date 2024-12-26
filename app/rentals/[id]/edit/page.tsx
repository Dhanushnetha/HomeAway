import AmenitiesInput from '@/components/form/AmenitiesInput';
import { SubmitButton } from '@/components/form/Buttons';
import CategoriesInput from '@/components/form/CategoriesInput';
import CounterInput from '@/components/form/CounterInput';
import CountriesInput from '@/components/form/CountriesInput';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import PriceInput from '@/components/form/PriceInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import ImageContainer from '@/components/properties/ImageContainer';
import { fetchRentalDetails, updatePropertyAction, updatePropertyImageAction } from '@/utils/actions'
import { Amenity } from '@/utils/amenities';
import { redirect } from 'next/navigation';
import React from 'react'

async function EditRental({params}:{params: {id:string}}) {
    const property = await fetchRentalDetails(params.id);
    
    if(!property) redirect('/');

    const defaultAmenities: Amenity[] = JSON.parse(property.amenities);
  return (
    <section>
        <h1 className="text-2xl font-semibold mb-8 capitalize">
            Edit property
        </h1>
        <div className="border p-8 rounded">
            <ImageInputContainer image={property.image} name={property.name} text={'Update Image'} action={updatePropertyImageAction}>
                <input type='hidden' name='id' value={property.id}/>
            </ImageInputContainer>
            <FormContainer action={updatePropertyAction}>
                <input type='hidden' name='id' value={property.id}/>
                <div className="grid md:grid-cols-2 gap-8 mb-4 mt-8">
                    <FormInput name='name' type='text' label='Name (20 limit)' defaultValue={property.name} />
                    <FormInput name='tagline' type='text' label='Tagline (30 limit)' defaultValue={property.tagline} />
                    <PriceInput defaultValue={property.price} />
                    <CategoriesInput defaultValue={property.category} />
                    <CountriesInput defaultValue={property.country} />
                </div>
                <TextAreaInput name='description' labelText='Description (10- 1000 words)' defaultValue={property.description} />
                <h3 className='text-lg mt-8 mb-4 font-medium'>
                    Accommodation Details
                </h3>
                <CounterInput detail='guests' defaultValue={property.guests} />
                <CounterInput detail='bedrooms' defaultValue={property.bedrooms} />
                <CounterInput detail='beds' defaultValue={property.beds} />
                <CounterInput detail='baths' defaultValue={property.baths} />
                <h3 className='text-lg mt-10 mb-6 font-medium'>Amenities</h3>
                <AmenitiesInput defaultValue={defaultAmenities} />
                <SubmitButton text='Update property' className='mt-12' />
            </FormContainer>
        </div>
    </section>
  )
}

export default EditRental