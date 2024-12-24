import { FaRegStar, FaStar } from "react-icons/fa"


function Rating({rating}: {rating: number}) {
  //const stars = Array.from({length: 5}, (_,i) => i+1 <= rating); 
  return (
    <div className="flex items-center gap-x-1">
      {[1,2,3,4,5].map((item, i)=>{
        if(item <= rating){
          return <FaStar className="w-3 h-3 text-primary" key={i} />
        }else{
          return <FaRegStar className="w-3 h-3 text-gray-400" key={i} />
        }
      })}
    </div>
  )
}

export default Rating