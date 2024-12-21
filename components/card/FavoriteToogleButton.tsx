import {FaHeart} from 'react-icons/fa'
import { Button } from '../ui/button'
import { auth } from '@clerk/nextjs/server'
import { CardSignInButton } from '../form/Buttons';

function FavoriteToogleButton({propertyId}: {propertyId: string}) {
  const {userId} = auth();
  if(!userId) return <CardSignInButton />
  return (
    <Button size={'icon'} variant={'outline'} className='p-2 cursor-pointer'>
      <FaHeart />
    </Button>
  )
}

export default FavoriteToogleButton