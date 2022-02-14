import haversine from "haversine";

//------------ GET GEOCODE FROM BING MAPS ----
const distance = (req, shelt) => {
  const start = {
    latitude: req.shelter_lat,
    longitude: req.shelter_lon,
  };
  const end = {
    latitude: shelt.shelter_lat,
    longitude: shelt.shelter_lon,
  };
  const calcDistance = Math.floor(haversine(start, end, { unit: "kilometer" }));

  return calcDistance;
};

export default distance;
