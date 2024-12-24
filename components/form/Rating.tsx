import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label"
  
function Rating({name, labelText}:{name:string, labelText?: string}) {
  return (
    <div className="mb 2 max-w-xs">
        <Label htmlFor={name} className="capitalize">
            {labelText || name}
        </Label>
        <Select defaultValue="5" name={name} required>            
            <SelectTrigger id={name}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
            { ['5','4','3','2','1'].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
  )
}

export default Rating