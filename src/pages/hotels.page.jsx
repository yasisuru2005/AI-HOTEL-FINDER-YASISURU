import { useSelector, useDispatch } from "react-redux";
import HotelListings from "@/components/HotelListings";
import { Button } from "@/components/ui/button";
import { clearSearch } from "@/lib/features/searchSlice";

const HotelsPage = () => {
  const dispatch = useDispatch();
  const searchMode = useSelector((state) => state.search.searchMode);
  const query = useSelector((state) => state.search.query);

  return (
    <main className="px-0">
      {searchMode && (
        <div className="bg-muted/40 border-b px-4">
          <div className="container mx-auto max-w-7xl py-3 flex items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing results for: <span className="font-medium text-foreground">{query}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => dispatch(clearSearch())}>
              Clear Search
            </Button>
          </div>
        </div>
      )}
      <HotelListings />
    </main>
  );
};

export default HotelsPage;