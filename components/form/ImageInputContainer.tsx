'use client'

import { actionFunction } from "@/utils/types";
import { useState } from "react";
import { LuUser2 } from "react-icons/lu";
import { Button } from "../ui/button";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";

type ImageInputContainerProps = {
    name: string | undefined;
    image: string | undefined;
    action: actionFunction;
    text: string;
    children?: React.ReactNode;
}


function ImageInputContainer(props: ImageInputContainerProps) {
    const {action, image, name,text, children} = props;
    const [isUpdateFormVisible, setUpdateFormVisible] = useState(false)

    const userIcon = (<LuUser2 className="w-24 h-24 bg-primary rounded text-white mb-4" />)

  return (
    <div>
        {image? <img src={image} alt={name} width={100} height={100} className="rounded object-cover mb-4 w-24 h-24" /> : userIcon}
        <Button variant='outline' size='sm' onClick={()=> setUpdateFormVisible((prev)=> !prev)}>
            {text}
        </Button>
        {isUpdateFormVisible && <div className="max-w-lg mt-4">
            <FormContainer action={action}>
                {children}
                <ImageInput />
                <SubmitButton size="sm" />
            </FormContainer>
        </div>}
    </div>
  )
}

export default ImageInputContainer