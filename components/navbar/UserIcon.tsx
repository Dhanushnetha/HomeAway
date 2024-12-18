import { fetchProfileImage } from '@/utils/actions'
import React from 'react'
import { LuUser2 } from 'react-icons/lu'


async function UserIcon() {
  const profileImg = await fetchProfileImage();
  return (
    <>
      {profileImg ? <img src={profileImg} className='w-6 h-6 rounded-full object-cover' /> : <LuUser2 className='w-6 h-6 bg-primary rounded-full text-white dark:bg-black' />}
    </>
  )
}

export default UserIcon