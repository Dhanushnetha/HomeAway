import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import { fetchProfile, fetchProfileImage, updateProfileAction, updateProfileImageAction } from '@/utils/actions';

const ProfilePage = async() => {
  const profile = await fetchProfile();
  
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">User profile</h1>
      <div className="border p-8 rounded-md">
        <ImageInputContainer action={updateProfileImageAction} image={profile?.profileImage} name={profile?.username} text='Update profile Image' />
        <FormContainer action={updateProfileAction}>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
                <FormInput name='firstName' type='text' label='First Name' placeholder='First name...' defaultValue={profile?.firstName} />
                <FormInput name='lastName' type='text' label='Last Name' placeholder='Last name...' defaultValue={profile?.lastName} />
                <FormInput name='username' type='text' label='User Name' placeholder='User name...' defaultValue={profile?.username} />
            </div>
            <SubmitButton key={'button'} text='Update Profile' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  )
}

export default ProfilePage