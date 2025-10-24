import { MapPin, Star, Heart } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function HotelCard(props) {
  const { hotel } = props;
  // let num = 1;
  //   const handleClick = () => {
  //     console.log("I was clicked")
  //     console.log("Inside handleclick", num)
  //     num = num + 1;
  //   }
  //   console.log("Outside handleclick", num)
//   const [num, setNum] = useState(0);

//   const handleClick = () => {
//     setNum(5);
//     console.log(num);
//     console.log("Hey");
//   };

  return (
    <Card className="group card-enhanced overflow-hidden">
      <Link to={`/hotels/${hotel._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-110 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Favorite button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-muted-foreground hover:text-destructive transition-all duration-200 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite logic here
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{hotel.location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">
                {hotel?.rating ?? "No rating"}
              </span>
              <span className="text-muted-foreground text-sm">
                ({hotel.reviews?.length ?? "No"} reviews)
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">${hotel.price}</span>
              <span className="text-sm text-muted-foreground block">per night</span>
            </div>
          </div>
          
          <Button 
            className="w-full btn-primary mt-2" 
            asChild
          >
            <Link to={`/hotels/${hotel._id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default HotelCard;
