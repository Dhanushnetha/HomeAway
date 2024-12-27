import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Label } from '../ui/label'
import { formattedContries } from '@/utils/countries';
import Flag from 'react-world-flags'

const name = 'country';

function CountriesInput({defaultValue}: {defaultValue?: string}) {    
  return (
    <div className='mb-2'>
        <Label htmlFor={name} className='capitalize'>Categories</Label>
        <Select defaultValue={defaultValue || formattedContries[0].code} name={name} required>
            <SelectTrigger id={name}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {formattedContries.map((country)=>{
                    return (
                        <SelectItem key={country.code} value={country.code}>
                            <span className='flex items-center gap-2'>
                                <Flag code={country.code} style={{ width: 20, height: 20 }} /> {country.name}
                            </span>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    </div>
  )
}

export default CountriesInput