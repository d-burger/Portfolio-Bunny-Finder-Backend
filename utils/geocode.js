import axios from "axios";

//------------ GET GEOCODE FROM BING MAPS ----
const geocode = async (zip) => {
  const dataFetch = await axios(
    `http://dev.virtualearth.net/REST/v1/Locations/DE/${zip}?key=${process.env.BING_API_KEY}`
  );

  const coordinates =
    dataFetch.data.resourceSets[0].resources[0].point.coordinates;
  let latitude, longitude;
  [latitude, longitude] = coordinates;

  return { shelter_lat: latitude, shelter_lon: longitude };
};

export default geocode;
