import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Label } from '../ui/label'
import { formattedContries } from '@/utils/countries';

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
                                {country.flag} {country.name}
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