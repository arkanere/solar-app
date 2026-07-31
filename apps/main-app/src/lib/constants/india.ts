// Indian states for form selection
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// API endpoints for location data.
// districts/cities are the unified [country]/api routes; they are GET with
// query params and return { name, slug } objects.
//
// A function rather than a const object because all three now live under
// [country]/api (stage 12) and the caller knows its own country. The only
// consumer is BusinessForm.svelte, which takes a `country` prop.
import type { CountryCode } from "$lib/countries";

export function locationEndpoints(country: CountryCode) {
  return {
    districts: `/${country}/api/getLevel2s`,
    cities: `/${country}/api/getCities`,
    submitBusiness: `/${country}/api/submitBusiness`,
  };
}
