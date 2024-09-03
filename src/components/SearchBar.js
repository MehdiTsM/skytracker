import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

const API_KEY = 'df1f4649ac868b38b6c825be463dcc44';

function SearchBar({ onSearch, onSelectCity }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [tempData, setTempData] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length > 2) {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${API_KEY}&units=metric`);
          const cities = response.data.list;
          setResults(cities);

          // Fetch temperatures for all cities in the search results
          const tempPromises = cities.map(async (city) => {
            const tempResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${API_KEY}&units=metric`);
            return { id: city.id, temp: tempResponse.data.main.temp };
          });

          const tempResults = await Promise.all(tempPromises);
          const tempDataMap = tempResults.reduce((acc, cur) => {
            acc[cur.id] = cur.temp;
            return acc;
          }, {});
          setTempData(tempDataMap);

        } catch (error) {
          console.error(t('errorFetching'), error);
        }
      } else {
        setResults([]);
        setTempData({});
      }
    };

    fetchResults();
  }, [query, t]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSelect = (city) => {
    setQuery('');
    setResults([]);
    setTempData({});
    onSelectCity(city);
  };

  return (
    <div className='relative flex justify-center animate-fadeIn'>
      <div className='relative flex items-center w-full max-w-[750px] m-10'>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          className='transition duration-300 p-3 pl-3 pr-12 rounded-full border border-gray-400 focus:border-customColor1 focus:outline-none w-full'
          placeholder={t('searchPlaceholder')}
        />
        <SearchIcon
          className='absolute right-2 text-customColor1'
          fontSize="small"
        />
      </div>
      {results.length > 0 && (
        <div className='w-full max-w-[300px] absolute z-50 top-[74px] bg-gradient-to-br from-customColor1 via-gray-700 to-customColor2 shadow-2xl rounded-3xl p-6 m-4 w-64 transform transition-all hover:shadow-2xl'>
          {results.map((result) => (
            <div
              key={result.id}
              className='flex items-center justify-between p-3 cursor-pointer hover:bg-customColor2 hover:bg-opacity-50 rounded-full transition'
              onClick={() => handleSelect(result.name)}
            >
              <span className='text-customColor4 font-bold text-xl'>{result.name}</span>
              <span className='text-customColor4 text-xl font-bold'>{tempData[result.id] ? `${Math.round(tempData[result.id])}°C` : t('loading')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onSelectCity: PropTypes.func.isRequired,
};

export default SearchBar;
