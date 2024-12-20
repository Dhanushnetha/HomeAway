import CategoriesList from "@/components/home/CategoriesList";
import PropertiesContainer from "@/components/home/PropertiesContainer";
import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button"

const HomePage = ({searchParams}:{searchParams: {category?: string, search?: string}}) => {
  
  return <section>
    <CategoriesList category={searchParams.category} search={searchParams.search} />
    <PropertiesContainer category={searchParams.category} search={searchParams.search} />
  </section>;
};


export default HomePage;
