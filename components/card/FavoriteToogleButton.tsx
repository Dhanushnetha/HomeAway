import {FaHeart} from 'react-icons/fa'
import { Button } from '../ui/button'
import { auth } from '@clerk/nextjs/server'
import { CardSignInButton } from '../form/Buttons';
import { fetchFavoriteId } from '@/utils/actions';
import FavoriteToggleForm from './FavoriteToggleForm';

async function FavoriteToogleButton({propertyId}: {propertyId: string}) {
  const {userId} = auth();
  if(!userId) return <CardSignInButton />
  const favId = await fetchFavoriteId({propertyId});
  return (
    <FavoriteToggleForm favoriteId = {favId} propertyId={propertyId} />
  )
}

export default FavoriteToogleButton