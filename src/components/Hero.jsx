import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchMode, setSearchQuery, setSearchResults } from "@/lib/features/searchSlice";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

const heroImages = [
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/608273980.jpg?k=c7df20ffb25ae52b6a17037dc13f5e15b94a0fe253a9b9d0b656f6376eabec7d&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/606303798.jpg?k=514943d0025704b27396faf82af167468d8b50b98f311668f206f79ca36cb53d&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/60307464.jpg?k=67ae35316203e2ec82d8e02e0cef883217cce9c436da581528b94ad6dee8e393&o=&hp=1",
  "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308794596.jpg?k=76bbd047a4f3773844efb15819a637f10fb98671244760fcd69cf26d1073b797&o=&hp=1",
];

export default function Hero() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logic for animating slides
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index) => {
      if (index === currentSlide || isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
    },
    [currentSlide, isTransitioning]
  );

  useEffect(() => {
    let transitionTimeout;
    if (isTransitioning) {
      transitionTimeout = setTimeout(() => setIsTransitioning(false), 500);
    }
    return () => clearTimeout(transitionTimeout);
  }, [isTransitioning]);

  useEffect(() => {
    let intervalId;
    if (!isTransitioning) {
      intervalId = setInterval(() => {
        const nextSlide = (currentSlide + 1) % heroImages.length;
        goToSlide(nextSlide);
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [currentSlide, isTransitioning, goToSlide]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (!q) return;
    dispatch(setSearchMode(true));
    dispatch(setSearchQuery(q));
    dispatch(setSearchResults([]));
    navigate("/hotels");
  };

  return (
    <div className="relative h-[500px] md:h-[600px] py-3 mx-4 overflow-hidden rounded-3xl z-0">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-500",
            currentSlide === index ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-white justify-center h-full px-4 sm:px-8 z-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          Find Your Best Staycation
        </h1>
        <p className="text-base md:text-lg mb-8 text-center max-w-2xl">
          Describe your dream destination and experience, and we&apos;ll find the
          perfect place for you.
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full max-w-md">
          <div className="relative flex items-center bg-card/80 backdrop-blur-md border border-border/50 rounded-full shadow-lg">
            <div className="relative flex-grow">
              <Input
                type="text"
                name="search"
                placeholder="Describe your dream destination..."
                className="bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground border-0 rounded-full py-6 pl-4 pr-12 sm:pr-32 w-full transition-all focus:ring-0 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="absolute right-2 h-[80%] my-auto btn-primary rounded-full px-2 sm:px-4 flex items-center gap-x-2 transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Search</span>
            </button>
          </div>
        </form>

        {/* Pagination dots */}
        <div className="absolute bottom-6 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-3 transition-all rounded-full",
                currentSlide === index
                  ? "bg-white w-8"
                  : "bg-white/50 w-3 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
