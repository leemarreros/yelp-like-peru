import {_API_KEY_GOOGLE_} from 'react-native-dotenv';

export const generateLinkGoogle = (query, type, coords = {}, lat, long, radius = 300) => {

  const queryFixed = query.trim().replace(/  +/g, "+");
  if (type === "food") {
    // filter those resultst that don't have the place_id key within
    return `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${_API_KEY_GOOGLE_}&location=${lat},${long}&radius=${radius}&language=es&input=${queryFixed}`;
  }
  if (type === "placeAuto") {
    let link = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${queryFixed}&location=${lat},${long}&radius=2000&language=es&key=${_API_KEY_GOOGLE_}`;
    return link;
  }
  if (type === "placeDetails")
    return `https://maps.googleapis.com/maps/api/place/details/json?placeid=${query}&language=es&key=${_API_KEY_GOOGLE_}`;

  if (type === "searchListFood")
    return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&types=restaurant&keyword=${queryFixed}&language=es&radius=3000&key=${_API_KEY_GOOGLE_}`;
  // used to retrieve photos based on PHOTO_REFERENCE
  // "https://maps.googleapis.com/maps/api/place/photo?photoreference=PHOTO_REFERENCE&sensor=false&maxheight=MAX_HEIGHT&maxwidth=MAX_WIDTH&key=YOUR_API_KEY";

  if (type === "searchListFoodNoGeolocation")
    return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
      coords.lat
    },${
      coords.lng
    }&types=restaurant&keyword=${queryFixed}&language=es&radius=3000&key=${_API_KEY_GOOGLE_}`;

  // use to retrieve next page results
  // https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${PAGE_TOKEN}
};
