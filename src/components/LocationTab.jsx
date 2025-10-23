function LocationTab(props) {
  const { onClick, location, selectedLocation } = props;
  
  const handleClick = () => {
    onClick(location);
  };

  if (location._id === selectedLocation) {
    return (
      <div
        className="text-base bg-gray-200 border rounded-full px-2 py-1 cursor-pointer"
        onClick={handleClick}
      >
        {location.name}
      </div>
    );
  }

  return (
    <div
      className="text-base  border rounded-full px-2 py-1 cursor-pointer"
      onClick={handleClick}
    >
      {location.name}
    </div>
  );
}

export default LocationTab;
