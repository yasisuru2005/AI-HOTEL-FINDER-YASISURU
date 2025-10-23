import EnhancedHero from "../components/EnhancedHero";
import HotelListings from "../components/HotelListings";    
import Hero from "../components/Hero";

function HomePage() {

  // const count = useSelector((state) => state.counter);
  // console.log(count);

  // const dispatch = useDispatch();

  return (
    <main>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>
      <Hero />
      <EnhancedHero />
      <HotelListings />
    </main>
  );
}

export default HomePage;
