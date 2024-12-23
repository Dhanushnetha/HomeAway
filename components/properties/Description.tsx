'use client'

import { useState } from "react"
import Title from "./Title";
import { Button } from "../ui/button";

function Description({description}:{description:string}) {
    const [isFullDescriptionShown, setFullDescriptionShown] = useState(false);

    const words = description.split(' ');
    const isLongDescription = words.length > 100;

    const toggleDescription = ()=>{
        setFullDescriptionShown(!isFullDescriptionShown);
    }

    const displayedDiscription = isLongDescription && !isFullDescriptionShown ? words.splice(0,100).join(' ')+' ...' : description;

  return (
    <article className="mt-4">
        <Title text="Description" />
        <p className="text-muted-foreground font-light leading-loose">{displayedDiscription}</p>
        {isLongDescription && <Button variant='link' className="pl-0" onClick={toggleDescription}>
            {isFullDescriptionShown ? 'Show less' : 'Show more'}
            </Button>}
    </article>
  )
}

export default Description