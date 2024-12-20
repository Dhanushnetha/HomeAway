import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { categories } from '@/utils/categories'
import { Label } from '../ui/label'

const name = 'category';

function CategoriesInput({defaultValue}: {defaultValue?: string}) {
  return (
    <div className='mb-2'>
        <Label htmlFor={name} className='capitalize'>Categories</Label>
        <Select defaultValue={defaultValue || categories[0].label} name={name} required>
            <SelectTrigger id={name}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {categories.map((category)=>{
                    return (
                        <SelectItem key={category.label} value={category.label}>
                            <span className='flex items-center gap-2'>
                                <category.icon />{category.label}
                            </span>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    </div>
  )
}

export default CategoriesInput