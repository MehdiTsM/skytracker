import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import Loading from '../components/Loading'

// Fix for default icon images missing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const API_KEY = 'df1f4649ac868b38b6c825be463dcc44';

const capitals = [
  { name: 'Kabul', coords: [34.5553, 69.2075] },
  { name: 'Algiers', coords: [36.7538, 3.0588] },
  { name: 'Andorra la Vella', coords: [42.5078, 1.5211] },
  { name: 'Luanda', coords: [-8.8390, 13.2894] },
  { name: 'Buenos Aires', coords: [-34.6037, -58.3816] },
  { name: 'Yerevan', coords: [40.1792, 44.4991] },
  { name: 'Canberra', coords: [-35.2809, 149.1300] },
  { name: 'Vienna', coords: [48.2082, 16.3738] },
  { name: 'Brussels', coords: [50.8503, 4.3517] },
  { name: 'Sofia', coords: [42.6977, 23.3219] },
  { name: 'Brasília', coords: [-15.7801, -47.9292] },
  { name: 'Ottawa', coords: [45.4215, -75.6972] },
  { name: 'Beijing', coords: [39.9042, 116.4074] },
  { name: 'Bogotá', coords: [4.6110, -74.0817] },
  { name: 'Bujumbura', coords: [-3.3614, 29.3599] },
  { name: 'Vientiane', coords: [17.9757, 102.6331] },
  { name: 'Riga', coords: [56.9496, 24.1059] },
  { name: 'Copenhagen', coords: [55.6761, 12.5683] },
  { name: 'Djibouti', coords: [11.8251, 42.5903] },
  { name: 'London', coords: [51.5074, -0.1278] },
  { name: 'Helsinki', coords: [60.1695, 24.9354] },
  { name: 'Paris', coords: [48.8566, 2.3522] },
  { name: 'Berlin', coords: [52.5200, 13.4050] },
  { name: 'Athens', coords: [37.9838, 23.7275] },
  { name: 'Budapest', coords: [47.4979, 19.0402] },
  { name: 'Reykjavík', coords: [64.1466, -21.9426] },
  { name: 'New Delhi', coords: [28.6139, 77.2090] },
  { name: 'Jakarta', coords: [-6.2088, 106.8456] },
  { name: 'Tehran', coords: [35.6892, 51.3890] },
  { name: 'Baghdad', coords: [33.3152, 44.3661] },
  { name: 'Rome', coords: [41.9028, 12.4964] },
  { name: 'Jerusalem', coords: [31.7683, 35.2137] },
  { name: 'Nairobi', coords: [-1.2864, 36.8172] },
  { name: 'Kampala', coords: [0.3476, 32.5825] },
  { name: 'Mexico City', coords: [19.4326, -99.1332] },
  { name: 'Moroni', coords: [-11.7111, 43.2540] },
  { name: 'Chisinau', coords: [47.0105, 28.8638] },
  { name: 'Monrovia', coords: [6.4281, -10.7854] },
  { name: 'Maputo', coords: [-25.9653, 32.5892] },
  { name: 'Wellington', coords: [-41.2865, 174.7762] },
  { name: 'Managua', coords: [12.6348, -86.1591] },
  { name: 'Lima', coords: [-12.0464, -77.0428] },
  { name: 'Ulaanbaatar', coords: [47.8864, 106.9057] },
  { name: 'Chengdu', coords: [30.5728, 104.0668] },
  { name: 'Singapore', coords: [1.3521, 103.8198] },
  { name: 'San Salvador', coords: [13.6929, -89.2182] },
  { name: 'Tbilisi', coords: [41.7151, 44.8271] },
  { name: 'Dili', coords: [-8.5569, 125.5276] },
  { name: 'Port Moresby', coords: [-9.4438, 147.1804] },
  { name: 'Lusaka', coords: [-15.3875, 28.3228] },
  { name: 'Kinshasa', coords: [-4.4419, 15.2663] },
  { name: 'Seoul', coords: [37.5665, 126.9780] },
  { name: 'Kuala Lumpur', coords: [3.139, 101.6869] },
  { name: 'Islamabad', coords: [33.6844, 73.0479] },
  { name: 'Hanoi', coords: [21.0285, 105.8542] },
  { name: 'Abuja', coords: [9.0579, 7.4951] },
  { name: 'Accra', coords: [5.6037, -0.1870] },
  { name: 'Asunción', coords: [-25.2637, -57.5759] },
  { name: 'Lima', coords: [-12.0464, -77.0428] },
  { name: 'Stockholm', coords: [59.3293, 18.0686] },
  { name: 'Bern', coords: [46.9481, 7.4474] },
  { name: 'Kigali', coords: [-1.9441, 30.0619] },
  { name: 'Santo Domingo', coords: [18.4861, -69.9312] },
  { name: 'Vilnius', coords: [54.6872, 25.2798] },
  { name: 'Warsaw', coords: [52.2297, 21.0122] },
  { name: 'Zagreb', coords: [45.8150, 15.9819] },
  { name: 'Pretoria', coords: [-25.7461, 28.1881] },
  { name: 'Cairo', coords: [30.0444, 31.2357] },
  { name: 'Oslo', coords: [59.9139, 10.7522] },
  { name: 'Helsinki', coords: [60.1695, 24.9354] },
  { name: 'Riga', coords: [56.9496, 24.1059] },
  { name: 'Minsk', coords: [53.9006, 27.5590] },
  { name: 'Nicosia', coords: [35.1667, 33.3667] },
  { name: 'Sana\'a', coords: [15.3694, 44.1910] },
  { name: 'Tunis', coords: [36.8065, 10.1815] },
  { name: 'Asunción', coords: [-25.2637, -57.5759] },
  { name: 'Lima', coords: [-12.0464, -77.0428] },
  { name: 'Vilnius', coords: [54.6872, 25.2798] },
  { name: 'Montevideo', coords: [-34.6037, -58.3816] },
  { name: 'Port-au-Prince', coords: [18.5944, -72.3074] },
  { name: 'Sofia', coords: [42.6977, 23.3219] },
  { name: 'Warsaw', coords: [52.2297, 21.0122] },
  { name: 'Zagreb', coords: [45.8150, 15.9819] },
  { name: 'Pretoria', coords: [-25.7461, 28.1881] },
  { name: 'Cairo', coords: [30.0444, 31.2357] },
  { name: 'Oslo', coords: [59.9139, 10.7522] },
  { name: 'Minsk', coords: [53.9006, 27.5590] },
  { name: 'Nicosia', coords: [35.1667, 33.3667] },
  { name: 'Sana\'a', coords: [15.3694, 44.1910] },
  { name: 'Tunis', coords: [36.8065, 10.1815] },
  { name: 'Alabama', capital: 'Montgomery', coords: [32.3777, -86.3000] },
  { name: 'Alaska', capital: 'Juneau', coords: [58.3019, -134.4197] },
  { name: 'Arizona', capital: 'Phoenix', coords: [33.4484, -112.0740] },
  { name: 'Arkansas', capital: 'Little Rock', coords: [34.7465, -92.2896] },
  { name: 'California', capital: 'Sacramento', coords: [38.5758, -121.4789] },
  { name: 'Colorado', capital: 'Denver', coords: [39.7392, -104.9903] },
  { name: 'Connecticut', capital: 'Hartford', coords: [41.7658, -72.6734] },
  { name: 'Delaware', capital: 'Dover', coords: [39.1582, -75.5244] },
  { name: 'Florida', capital: 'Tallahassee', coords: [30.4383, -84.2807] },
  { name: 'Georgia', capital: 'Atlanta', coords: [33.7490, -84.3880] },
  { name: 'Hawaii', capital: 'Honolulu', coords: [21.3069, -157.8583] },
  { name: 'Idaho', capital: 'Boise', coords: [43.6150, -116.2023] },
  { name: 'Illinois', capital: 'Springfield', coords: [39.7983, -89.6540] },
  { name: 'Indiana', capital: 'Indianapolis', coords: [39.7684, -86.1581] },
  { name: 'Iowa', capital: 'Des Moines', coords: [41.5868, -93.6250] },
  { name: 'Kansas', capital: 'Topeka', coords: [39.0483, -95.6780] },
  { name: 'Kentucky', capital: 'Frankfort', coords: [38.1867, -84.8753] },
  { name: 'Louisiana', capital: 'Baton Rouge', coords: [30.6954, -91.1626] },
  { name: 'Maine', capital: 'Augusta', coords: [44.3106, -69.7795] },
  { name: 'Maryland', capital: 'Annapolis', coords: [38.9784, -76.4922] },
  { name: 'Massachusetts', capital: 'Boston', coords: [42.3601, -71.0589] },
  { name: 'Michigan', capital: 'Lansing', coords: [42.7325, -84.5555] },
  { name: 'Minnesota', capital: 'Saint Paul', coords: [44.9537, -93.0900] },
  { name: 'Mississippi', capital: 'Jackson', coords: [32.2988, -90.1848] },
  { name: 'Missouri', capital: 'Jefferson City', coords: [38.5767, -92.1735] },
  { name: 'Montana', capital: 'Helena', coords: [46.5890, -112.0391] },
  { name: 'Nebraska', capital: 'Lincoln', coords: [40.8136, -96.7026] },
  { name: 'Nevada', capital: 'Carson City', coords: [39.1638, -119.7674] },
  { name: 'New Hampshire', capital: 'Concord', coords: [43.2081, -71.5376] },
  { name: 'New Jersey', capital: 'Trenton', coords: [40.2170, -74.7429] },
  { name: 'New Mexico', capital: 'Santa Fe', coords: [35.6869, -105.9378] },
  { name: 'New York', capital: 'Albany', coords: [42.6526, -73.7562] },
  { name: 'North Carolina', capital: 'Raleigh', coords: [35.7796, -78.6382] },
  { name: 'North Dakota', capital: 'Bismarck', coords: [46.8083, -100.7837] },
  { name: 'Ohio', capital: 'Columbus', coords: [39.9612, -82.9988] },
  { name: 'Oklahoma', capital: 'Oklahoma City', coords: [35.4676, -97.5164] },
  { name: 'Oregon', capital: 'Salem', coords: [44.9426, -123.0351] },
  { name: 'Pennsylvania', capital: 'Harrisburg', coords: [40.2737, -76.8844] },
  { name: 'Rhode Island', capital: 'Providence', coords: [41.8236, -71.4222] },
  { name: 'South Carolina', capital: 'Columbia', coords: [34.0007, -81.0348] },
  { name: 'South Dakota', capital: 'Pierre', coords: [44.3682, -100.3500] },
  { name: 'Tennessee', capital: 'Nashville', coords: [36.1627, -86.7816] },
  { name: 'Texas', capital: 'Austin', coords: [30.2672, -97.7431] },
  { name: 'Utah', capital: 'Salt Lake City', coords: [40.7608, -111.8910] },
  { name: 'Vermont', capital: 'Montpelier', coords: [44.2601, -72.5754] },
  { name: 'Virginia', capital: 'Richmond', coords: [37.5407, -77.4360] },
  { name: 'Washington', capital: 'Olympia', coords: [47.0379, -122.9007] },
  { name: 'West Virginia', capital: 'Charleston', coords: [38.3362, -81.6126] },
  { name: 'Wisconsin', capital: 'Madison', coords: [43.0731, -89.4012] },
  { name: 'Wyoming', capital: 'Cheyenne', coords: [41.1400, -104.8202] },
  { name: 'Moscow', coords: [55.7558, 37.6176] },
  { name: 'Saint Petersburg', coords: [59.9343, 30.3351] },
  { name: 'Novosibirsk', coords: [55.0084, 82.9357] },
  { name: 'Yekaterinburg', coords: [56.8389, 60.6057] },
  { name: 'Nizhny Novgorod', coords: [56.2965, 43.9361] },
  { name: 'Kazan', coords: [55.8304, 49.0661] },
  { name: 'Chelyabinsk', coords: [55.1644, 61.4368] },
  { name: 'Omsk', coords: [54.9885, 73.3242] },
  { name: 'Samara', coords: [53.2001, 50.15] },
  { name: 'Rostov-on-Don', coords: [47.2357, 39.7015] },
  { name: 'Ufa', coords: [54.7358, 55.9678] },
  { name: 'Krasnoyarsk', coords: [56.0096, 92.8677] },
  { name: 'Volgograd', coords: [48.7080, 44.5133] },
  { name: 'Voronezh', coords: [51.6640, 39.1872] },
  { name: 'Perm', coords: [58.0105, 56.2342] },
  { name: 'Khabarovsk', coords: [48.4833, 135.0667] },
  { name: 'Tolyatti', coords: [53.5232, 49.4103] },
  { name: 'Ijevsk', coords: [56.8519, 53.2114] },
  { name: 'Tyumen', coords: [57.1539, 65.5340] },
  { name: 'Magnitogorsk', coords: [53.4202, 58.9876] },
  { name: 'Saratov', coords: [51.5333, 46.0340] },
  { name: 'Kemerovo', coords: [55.3333, 86.0833] },
  { name: 'Novokuznetsk', coords: [53.7561, 87.1174] },
  { name: 'Kaliningrad', coords: [54.7104, 20.4522] },
  { name: 'Ulan-Ude', coords: [51.8333, 107.5833] },
  { name: 'Barnaul', coords: [53.3456, 83.7794] },
  { name: 'Arkhangelsk', coords: [64.5395, 40.5158] },
  { name: 'Vladivostok', coords: [43.1155, 131.8827] },
  { name: 'Makhachkala', coords: [42.9849, 47.5044] },
  { name: 'Syktyvkar', coords: [61.6682, 50.8180] },
  { name: 'Kostroma', coords: [57.7665, 40.9261] },
  { name: 'Oran', coords: [35.6978, -0.6336] },
  { name: 'Constantine', coords: [36.3650, 6.6140] },
  { name: 'Annaba', coords: [36.8972, 7.7599] },
  { name: 'Blida', coords: [36.4800, 2.8180] },
  { name: 'Bamako', coords: [12.6392, -8.0029] },
  { name: 'Ségou', coords: [13.4315, -6.2714] },
  { name: 'Kayes', coords: [14.4475, -11.4416] },
  { name: 'Tombouctou', coords: [16.7664, -3.0026] },
  { name: 'Gao', coords: [16.2728, -0.0483] },
  { name: 'Niamey', coords: [13.5128, 2.1128] },
  { name: 'Zinder', coords: [13.8072, 8.9917] },
  { name: 'Maradi', coords: [13.5044, 7.1144] },
  { name: 'Agadez', coords: [16.9691, 7.9890] },
  { name: 'Diffa', coords: [13.3658, 12.6214] },
  { name: 'Riyadh', coords: [24.7136, 46.6753] },
  { name: 'Jeddah', coords: [21.2854, 39.2376] },
  { name: 'Mecca', coords: [21.3891, 39.8579] },
  { name: 'Dammam', coords: [26.4344, 49.9777] },
  { name: 'Khobar', coords: [26.2790, 50.2052] },
  { name: 'Paris', coords: [48.8566, 2.3522] },
  { name: 'Marseille', coords: [43.2965, 5.3698] },
  { name: 'Lyon', coords: [45.7640, 4.8357] },
  { name: 'Toulouse', coords: [43.6047, 1.4442] },
  { name: 'Nice', coords: [43.7102, 7.2620] }

];

const Map = () => {
  const { t } = useTranslation();

  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const bounds = L.latLngBounds([
    [90, -180],
    [-90, 180]   
  ]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const weatherPromises = capitals.map(async (city) => {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${API_KEY}&units=metric`
          );
          return { ...response.data, coords: city.coords };
        });

        const weatherResults = await Promise.all(weatherPromises);
        setWeatherData(weatherResults);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data for capitals');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

    const handleSearch = async (query) => {
      if (query.trim() === '') {
        setSearchResults([]);
        setSelectedCity(null);
        return;
      }
  
      const result = capitals.find(city => city.name.toLowerCase().includes(query.toLowerCase()));
  
      if (result) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${result.name}&appid=${API_KEY}&units=metric`);
          const data = { ...response.data, coords: result.coords };
          setSearchResults([data]);
          setSelectedCity(data);
        } catch (err) {
          console.error('Error fetching weather data for search:', err);
          setError('Failed to fetch weather data for searched city');
          setSearchResults([]);
          setSelectedCity(null);
        }
      } else {
        console.log(`City "${query}" not found in capitals.`);
        setSearchResults([]);
        setSelectedCity(null);
      }
    };
  
    const handleChange = (event) => {
      const query = event.target.value;
      setSearchQuery(query);
      handleSearch(query); 
    };

  return (
    <div className="relative bg-gray-800 min-h-screen animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-r from-customColor2 via-gray-700 to-customColor2 dark:bg-gradient-to-r dark:from-customColor4 dark:via-gray-400 dark:to-customColor4" />
      <div className="min-h-screen relative container mx-auto max-w-screen-lg p-4 bg-gray-700 shadow-lg z-10 border-l-4 border-r-4 border-gray-700 border-opacity-75 shadow-2xl dark:bg-customColor4 dark:border-customColor4">
        <h1 className="dark:text-customColor2 text-customColor4 text-3xl font-bold p-4 text-center">{t('Map')}</h1>
        
        <div className="flex justify-center mb-4 flex-col items-center">
          <div className='relative flex items-center w-full max-w-[750px]'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleChange}
              
              className='transition duration-300 p-3 pl-3 pr-12 rounded-full border border-gray-400 focus:border-customColor1 focus:outline-none w-full'
              placeholder={t('Search')}
            />
            <SearchIcon
              className='absolute right-2 text-customColor1 cursor-pointer'
              fontSize="small"
              onClick={handleSearch}
            />
          </div>
            <div className="mb-4 relative top-4 w-full max-w-[450px] ">
              {searchResults.length > 0 && (
                <div className="bg-customColor2 rounded-full relative bottom-4 bg-gradient-to-br from-customColor2 via-gray-700 to-customColor1 shadow-xl dark:bg-gradient-to-br dark:from-customColor1 dark:via-gray-200 dark:to-gray-300">
                  {searchResults.map((city) => (
                    <div key={city.id} className="flex items-center mb-2">
                      <div className="rounded-full p-6 flex items-center justify-between w-full text-customColor4 text-xl font-bold cursor-pointer hover:bg-customColor2 hover:bg-opacity-50 rounded-full transition hover:bg-opacity-15 dark:text-customColor2">
                        <h2 className="text-lg font-semibold">{city.name}</h2>
                        <p>{Math.round(city.main.temp)}°C</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {loading ? (
          <Loading />
        ) : (
          <>

            <MapContainer
              className='relative border-4 border-customColor1 rounded-2xl'
              center={[20.0, 0.0]} 
              zoom={2}
              minZoom={2}
              maxZoom={10}
              style={{ height: '600px', width: '100%' }}
              bounds={bounds}
              boundsOptions={{ padding: [50, 50] }} // Optional: Adds padding around the bounds
              maxBounds={bounds}  // Set the maximum bounds for the map
              maxBoundsViscosity={1.0} // Optional: Control the resistance to panning outside bounds
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {weatherData.map((data) => (
                <Marker key={data.id} position={data.coords}>
                    <Popup>
                      <div className="flex items-center ">

                        <div className=" ">
                          <h2 className="text-lg font-semibold">{data.name}</h2>
                          <p className='font-bold'>{Math.round(data.main.temp)}°C</p>
                          <p className='text-xl'>{data.weather[0].description}</p>
                        </div>
                      </div>
                    </Popup>
                </Marker>
              ))}
              {selectedCity && (
                <Marker position={selectedCity.coords}>
                  <Popup>
                    <div className="flex items-center ">
                      <img
                        src={`http://openweathermap.org/img/wn/${selectedCity.weather[0].icon}@2x.png`}
                        alt={selectedCity.weather[0].description}
                        className="w-12 h-12"
                      />
                      <div className="">
                        <h2 className="text-lg font-semibold">{selectedCity.name}</h2>
                        <p>{Math.round(selectedCity.main.temp)}°C</p>
                        <p>{selectedCity.weather[0].description}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default Map;
