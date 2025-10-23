import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Link } from "react-router";

const EnhancedHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/20 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main heading with gradient text */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          Discover Your
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Perfect Stay
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Experience luxury accommodations in the world's most beautiful
          destinations. From city centers to beachfront retreats, find your
          ideal escape.
        </p>

        {/* Search Card */}
        <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-md border-border/50 shadow-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Where to?"
                  className="pl-10 h-12 text-lg border-border/50 focus:border-primary transition-colors"
                />
              </div>

              {/* Check-in */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Check-in"
                  className="pl-10 h-12 text-lg border-border/50 focus:border-primary transition-colors"
                />
              </div>

              {/* Check-out */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Check-out"
                  className="pl-10 h-12 text-lg border-border/50 focus:border-primary transition-colors"
                />
              </div>

              {/* Search Button */}
              <Button
                size="lg"
                className="h-12 btn-primary text-lg font-semibold"
                asChild
              >
                <Link to="/hotels">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-sunset flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Locations</h3>
            <p className="text-muted-foreground">
              Handpicked hotels in the world's most sought-after destinations
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-ocean flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p className="text-muted-foreground">
              Seamless reservation process with instant confirmation
            </p>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-muted-foreground">
              Round-the-clock assistance for your perfect stay
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;
