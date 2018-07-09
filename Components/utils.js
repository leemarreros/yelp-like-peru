import { credentialGoogle } from "../keys";

export const generateLinkGoogle = (query, type, coords = {}, lat, long, radius = 300) => {

  const queryFixed = query.trim().replace(/  +/g, "+");
  if (type === "food") {
    // filter those resultst that don't have the place_id key within
    return `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${credentialGoogle}&location=${lat},${long}&radius=${radius}&language=es&input=${queryFixed}`;
  }
  if (type === "placeAuto") {
    let link = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${queryFixed}&location=${lat},${long}&radius=2000&language=es&key=${credentialGoogle}`;
    return link;
  }
  if (type === "placeDetails")
    return `https://maps.googleapis.com/maps/api/place/details/json?placeid=${query}&language=es&key=${credentialGoogle}`;

  if (type === "searchListFood")
    return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&types=restaurant&keyword=${queryFixed}&language=es&radius=3000&key=${credentialGoogle}`;
  // used to retrieve photos based on PHOTO_REFERENCE
  // "https://maps.googleapis.com/maps/api/place/photo?photoreference=PHOTO_REFERENCE&sensor=false&maxheight=MAX_HEIGHT&maxwidth=MAX_WIDTH&key=YOUR_API_KEY";

  if (type === "searchListFoodNoGeolocation")
    return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
      coords.lat
    },${
      coords.lng
    }&types=restaurant&keyword=${queryFixed}&language=es&radius=3000&key=${credentialGoogle}`;

  // use to retrieve next page results
  // https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${PAGE_TOKEN}
};
