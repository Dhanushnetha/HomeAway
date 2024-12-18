import React, { Children } from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import {creatProfileAction} from '@/utils/actions'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

async function CreateProfile() {
    const user = await currentUser();
    if(user?.privateMetadata.hasProfile) redirect('/');
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">new user</h1>
      <div className="border p-8 rounded-md">
        <FormContainer action={creatProfileAction}>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormInput name='firstName' type='text' label='First Name' placeholder='First name...' />
                <FormInput name='lastName' type='text' label='Last Name' placeholder='Last name...'/>
                <FormInput name='username' type='text' label='User Name' placeholder='User name...'/>
            </div>
            <SubmitButton key={'button'} text='Create Profile' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  )
}

export default CreateProfile