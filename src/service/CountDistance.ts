function CountDistance(lat1: number, lon1: number, lat2: number, lon2: number) :number
{
  const R = 6371; 
  const dLat:number = toRad(lat2-lat1);
  const dLon:number = toRad(lon2-lon1);

  const a:number = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)); 
  const c:number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

// Converts numeric degrees to radians
function toRad(Value: number): number
{
    return Value * Math.PI / 180;
}

export default CountDistance