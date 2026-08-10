export interface City {
  name: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
  timezoneOffsetMinutes: number; // IST = 330
}

export function formatPlaceLabel(c: City): string {
  return [c.name, c.state, c.country].filter(Boolean).join(", ");
}

/** Major Indian cities for offline geocoding */
export const INDIA_CITIES: City[] = [
  { name: "Mumbai", state: "Maharashtra", lat: 19.076, lon: 72.8777, timezoneOffsetMinutes: 330 },
  { name: "Delhi", state: "Delhi", lat: 28.6139, lon: 77.209, timezoneOffsetMinutes: 330 },
  { name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.209, timezoneOffsetMinutes: 330 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lon: 77.5946, timezoneOffsetMinutes: 330 },
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lon: 77.5946, timezoneOffsetMinutes: 330 },
  { name: "Hyderabad", state: "Telangana", lat: 17.385, lon: 78.4867, timezoneOffsetMinutes: 330 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lon: 72.5714, timezoneOffsetMinutes: 330 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lon: 80.2707, timezoneOffsetMinutes: 330 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lon: 88.3639, timezoneOffsetMinutes: 330 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lon: 73.8567, timezoneOffsetMinutes: 330 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lon: 75.7873, timezoneOffsetMinutes: 330 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lon: 80.9462, timezoneOffsetMinutes: 330 },
  { name: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lon: 80.3319, timezoneOffsetMinutes: 330 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lon: 79.0882, timezoneOffsetMinutes: 330 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lon: 75.8577, timezoneOffsetMinutes: 330 },
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lon: 77.4126, timezoneOffsetMinutes: 330 },
  { name: "Patna", state: "Bihar", lat: 25.5941, lon: 85.1376, timezoneOffsetMinutes: 330 },
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lon: 76.7794, timezoneOffsetMinutes: 330 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lon: 72.8311, timezoneOffsetMinutes: 330 },
  { name: "Vadodara", state: "Gujarat", lat: 22.3072, lon: 73.1812, timezoneOffsetMinutes: 330 },
  { name: "Rajkot", state: "Gujarat", lat: 22.3039, lon: 70.8022, timezoneOffsetMinutes: 330 },
  { name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lon: 76.9558, timezoneOffsetMinutes: 330 },
  { name: "Madurai", state: "Tamil Nadu", lat: 9.9252, lon: 78.1198, timezoneOffsetMinutes: 330 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673, timezoneOffsetMinutes: 330 },
  { name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lon: 76.9366, timezoneOffsetMinutes: 330 },
  { name: "Trivandrum", state: "Kerala", lat: 8.5241, lon: 76.9366, timezoneOffsetMinutes: 330 },
  { name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lon: 83.2185, timezoneOffsetMinutes: 330 },
  { name: "Vijayawada", state: "Andhra Pradesh", lat: 16.5062, lon: 80.648, timezoneOffsetMinutes: 330 },
  { name: "Mysuru", state: "Karnataka", lat: 12.2958, lon: 76.6394, timezoneOffsetMinutes: 330 },
  { name: "Mysore", state: "Karnataka", lat: 12.2958, lon: 76.6394, timezoneOffsetMinutes: 330 },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lon: 91.7362, timezoneOffsetMinutes: 330 },
  { name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lon: 85.8245, timezoneOffsetMinutes: 330 },
  { name: "Ranchi", state: "Jharkhand", lat: 23.3441, lon: 85.3096, timezoneOffsetMinutes: 330 },
  { name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lon: 81.6296, timezoneOffsetMinutes: 330 },
  { name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lon: 78.0322, timezoneOffsetMinutes: 330 },
  { name: "Shimla", state: "Himachal Pradesh", lat: 31.1048, lon: 77.1734, timezoneOffsetMinutes: 330 },
  { name: "Jammu", state: "Jammu and Kashmir", lat: 32.7266, lon: 74.857, timezoneOffsetMinutes: 330 },
  { name: "Srinagar", state: "Jammu and Kashmir", lat: 34.0837, lon: 74.7973, timezoneOffsetMinutes: 330 },
  { name: "Amritsar", state: "Punjab", lat: 31.634, lon: 74.8723, timezoneOffsetMinutes: 330 },
  { name: "Ludhiana", state: "Punjab", lat: 30.901, lon: 75.8573, timezoneOffsetMinutes: 330 },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lon: 82.9739, timezoneOffsetMinutes: 330 },
  { name: "Prayagraj", state: "Uttar Pradesh", lat: 25.4358, lon: 81.8463, timezoneOffsetMinutes: 330 },
  { name: "Allahabad", state: "Uttar Pradesh", lat: 25.4358, lon: 81.8463, timezoneOffsetMinutes: 330 },
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lon: 78.0081, timezoneOffsetMinutes: 330 },
  { name: "Meerut", state: "Uttar Pradesh", lat: 28.9845, lon: 77.7064, timezoneOffsetMinutes: 330 },
  { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lon: 77.391, timezoneOffsetMinutes: 330 },
  { name: "Gurugram", state: "Haryana", lat: 28.4595, lon: 77.0266, timezoneOffsetMinutes: 330 },
  { name: "Gurgaon", state: "Haryana", lat: 28.4595, lon: 77.0266, timezoneOffsetMinutes: 330 },
  { name: "Faridabad", state: "Haryana", lat: 28.4089, lon: 77.3178, timezoneOffsetMinutes: 330 },
  { name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lon: 73.0243, timezoneOffsetMinutes: 330 },
  { name: "Udaipur", state: "Rajasthan", lat: 24.5854, lon: 73.7125, timezoneOffsetMinutes: 330 },
  { name: "Goa", state: "Goa", lat: 15.2993, lon: 74.124, timezoneOffsetMinutes: 330 },
  { name: "Panaji", state: "Goa", lat: 15.4909, lon: 73.8278, timezoneOffsetMinutes: 330 },
  { name: "Nashik", state: "Maharashtra", lat: 19.9975, lon: 73.7898, timezoneOffsetMinutes: 330 },
  { name: "Aurangabad", state: "Maharashtra", lat: 19.8762, lon: 75.3433, timezoneOffsetMinutes: 330 },
  { name: "Mangalore", state: "Karnataka", lat: 12.9141, lon: 74.856, timezoneOffsetMinutes: 330 },
  { name: "Hubli", state: "Karnataka", lat: 15.3647, lon: 75.124, timezoneOffsetMinutes: 330 },
  { name: "Tiruchirappalli", state: "Tamil Nadu", lat: 10.7905, lon: 78.7047, timezoneOffsetMinutes: 330 },
  { name: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lon: 79.9864, timezoneOffsetMinutes: 330 },
  { name: "Gwalior", state: "Madhya Pradesh", lat: 26.2183, lon: 78.1828, timezoneOffsetMinutes: 330 },
  { name: "Jamshedpur", state: "Jharkhand", lat: 22.8046, lon: 86.2029, timezoneOffsetMinutes: 330 },
  { name: "Cuttack", state: "Odisha", lat: 20.4625, lon: 85.883, timezoneOffsetMinutes: 330 },
  { name: "Pondicherry", state: "Puducherry", lat: 11.9416, lon: 79.8083, timezoneOffsetMinutes: 330 },
  { name: "Puducherry", state: "Puducherry", lat: 11.9416, lon: 79.8083, timezoneOffsetMinutes: 330 },
  { name: "Firozabad", state: "Uttar Pradesh", lat: 27.1591, lon: 78.3957, timezoneOffsetMinutes: 330 },
  { name: "Aligarh", state: "Uttar Pradesh", lat: 27.8974, lon: 78.088, timezoneOffsetMinutes: 330 },
  { name: "Mathura", state: "Uttar Pradesh", lat: 27.4924, lon: 77.6737, timezoneOffsetMinutes: 330 },
  { name: "Ghaziabad", state: "Uttar Pradesh", lat: 28.6692, lon: 77.4538, timezoneOffsetMinutes: 330 },
  { name: "Bareilly", state: "Uttar Pradesh", lat: 28.367, lon: 79.4304, timezoneOffsetMinutes: 330 },
  { name: "Moradabad", state: "Uttar Pradesh", lat: 28.8386, lon: 78.7733, timezoneOffsetMinutes: 330 },
  { name: "Saharanpur", state: "Uttar Pradesh", lat: 29.968, lon: 77.5552, timezoneOffsetMinutes: 330 },
  { name: "Gorakhpur", state: "Uttar Pradesh", lat: 26.7606, lon: 83.3732, timezoneOffsetMinutes: 330 },
  { name: "Jhansi", state: "Uttar Pradesh", lat: 25.4484, lon: 78.5685, timezoneOffsetMinutes: 330 },
  { name: "Muzaffarnagar", state: "Uttar Pradesh", lat: 29.4727, lon: 77.7085, timezoneOffsetMinutes: 330 },
  { name: "Etawah", state: "Uttar Pradesh", lat: 26.7769, lon: 79.0216, timezoneOffsetMinutes: 330 },
  { name: "Mainpuri", state: "Uttar Pradesh", lat: 27.235, lon: 79.026, timezoneOffsetMinutes: 330 },
  { name: "Hathras", state: "Uttar Pradesh", lat: 27.5957, lon: 78.052, timezoneOffsetMinutes: 330 },
  { name: "Shikohabad", state: "Uttar Pradesh", lat: 27.114, lon: 78.58, timezoneOffsetMinutes: 330 },
  { name: "Ajmer", state: "Rajasthan", lat: 26.4499, lon: 74.6399, timezoneOffsetMinutes: 330 },
  { name: "Kota", state: "Rajasthan", lat: 25.2138, lon: 75.8648, timezoneOffsetMinutes: 330 },
  { name: "Bikaner", state: "Rajasthan", lat: 28.0229, lon: 73.3119, timezoneOffsetMinutes: 330 },
  { name: "Thane", state: "Maharashtra", lat: 19.2183, lon: 72.9781, timezoneOffsetMinutes: 330 },
  { name: "Kalyan", state: "Maharashtra", lat: 19.2403, lon: 73.1305, timezoneOffsetMinutes: 330 },
  { name: "Howrah", state: "West Bengal", lat: 22.5958, lon: 88.2636, timezoneOffsetMinutes: 330 },
  { name: "Siliguri", state: "West Bengal", lat: 26.7271, lon: 88.3953, timezoneOffsetMinutes: 330 },
  { name: "Warangal", state: "Telangana", lat: 17.9689, lon: 79.5941, timezoneOffsetMinutes: 330 },
  { name: "Tirupati", state: "Andhra Pradesh", lat: 13.6288, lon: 79.4192, timezoneOffsetMinutes: 330 },
  { name: "Guntur", state: "Andhra Pradesh", lat: 16.3067, lon: 80.4365, timezoneOffsetMinutes: 330 },
  { name: "Jalandhar", state: "Punjab", lat: 31.326, lon: 75.5762, timezoneOffsetMinutes: 330 },
  { name: "Patiala", state: "Punjab", lat: 30.3398, lon: 76.3869, timezoneOffsetMinutes: 330 },
  { name: "Hisar", state: "Haryana", lat: 29.1492, lon: 75.7217, timezoneOffsetMinutes: 330 },
  { name: "Panipat", state: "Haryana", lat: 29.3909, lon: 76.9635, timezoneOffsetMinutes: 330 },
  { name: "Solapur", state: "Maharashtra", lat: 17.6599, lon: 75.9064, timezoneOffsetMinutes: 330 },
  { name: "Kolhapur", state: "Maharashtra", lat: 16.705, lon: 74.2433, timezoneOffsetMinutes: 330 },
  { name: "Ujjain", state: "Madhya Pradesh", lat: 23.1765, lon: 75.7885, timezoneOffsetMinutes: 330 },
  { name: "Haridwar", state: "Uttarakhand", lat: 29.9457, lon: 78.1642, timezoneOffsetMinutes: 330 },
  { name: "Rishikesh", state: "Uttarakhand", lat: 30.0869, lon: 78.2676, timezoneOffsetMinutes: 330 },
  { name: "Siwan", state: "Bihar", lat: 26.219, lon: 84.3567, timezoneOffsetMinutes: 330 },
  { name: "Chapra", state: "Bihar", lat: 25.781, lon: 84.7428, timezoneOffsetMinutes: 330 },
  { name: "Muzaffarpur", state: "Bihar", lat: 26.1209, lon: 85.3647, timezoneOffsetMinutes: 330 },
  { name: "Gaya", state: "Bihar", lat: 24.7961, lon: 85.007, timezoneOffsetMinutes: 330 },
  { name: "Bhagalpur", state: "Bihar", lat: 25.2425, lon: 86.9842, timezoneOffsetMinutes: 330 },
  { name: "Darbhanga", state: "Bihar", lat: 26.1542, lon: 85.8918, timezoneOffsetMinutes: 330 },
];

function normalizePlaceQuery(query: string): string {
  // "Firozabad, Uttar Pradesh" → "firozabad"
  return query.split(",")[0].trim().toLowerCase();
}

export function findCity(query: string): City | null {
  const q = normalizePlaceQuery(query);
  if (!q) return null;
  const exact = INDIA_CITIES.find((c) => c.name.toLowerCase() === q);
  if (exact) return exact;
  const starts = INDIA_CITIES.find((c) => c.name.toLowerCase().startsWith(q));
  if (starts) return starts;
  const partial = INDIA_CITIES.find((c) => c.name.toLowerCase().includes(q));
  return partial || null;
}

export function searchCities(query: string, limit = 8): City[] {
  const q = query.trim().toLowerCase();
  if (!q) return INDIA_CITIES.slice(0, limit);
  return INDIA_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.state && c.state.toLowerCase().includes(q))
  ).slice(0, limit);
}
