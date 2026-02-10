import { createAsyncThunk } from '@reduxjs/toolkit';
import { weatherService } from '../../services/weatherService';
import { addRecentSearch } from '../slices/weatherSlice';
import { saveToCache, getFromCache } from '../../utils/storage';
import { CurrentWeather, ForecastData } from '../../types/weather';

export const fetchCurrentWeather = createAsyncThunk<
  CurrentWeather,
  string,
  { rejectValue: string }
>(
  'weather/fetchCurrentWeather',
  async (city, { dispatch, rejectWithValue }) => {
    try {
      const cachedData = await getFromCache<CurrentWeather>(`weather_${city}`);
      if (cachedData) {
        console.log('[v0] Using cached weather data for', city);
        return cachedData;
      }

      const data = await weatherService.getCurrentWeather(city);

      await saveToCache(`weather_${city}`, data);

      dispatch(addRecentSearch(city));

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch weather';
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchForecast = createAsyncThunk<
  ForecastData,
  { city: string; days: number },
  { rejectValue: string }
>('weather/fetchForecast', async ({ city, days }, { rejectWithValue }) => {
  try {
    const cachedData = await getFromCache<ForecastData>(
      `forecast_${city}_${days}`,
    );
    if (cachedData) {
      console.log('[v0] Using cached forecast data for', city);
      return cachedData;
    }

    const data = await weatherService.getForecast(city, days);

    await saveToCache(`forecast_${city}_${days}`, data);

    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch forecast';
    return rejectWithValue(errorMessage);
  }
});

export const fetchCitySuggestions = createAsyncThunk<
  Array<{ name: string; region: string; country: string }>,
  string,
  { rejectValue: string }
>('weather/fetchCitySuggestions', async (query, { rejectWithValue }) => {
  try {
    if (query.length < 2) {
      return [];
    }

    const suggestions = await weatherService.searchCities(query);
    return suggestions;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch suggestions';
    return rejectWithValue(errorMessage);
  }
});

export const fetchWeatherByCoords = createAsyncThunk<
  CurrentWeather,
  { lat: number; lon: number },
  { rejectValue: string }
>('weather/fetchWeatherByCoords', async ({ lat, lon }, { rejectWithValue }) => {
  try {
    const data = await weatherService.getCurrentWeatherByCoords(lat, lon);
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch weather';
    return rejectWithValue(errorMessage);
  }
});

export const fetchForecastByCoords = createAsyncThunk<
  ForecastData,
  { lat: number; lon: number; days: number },
  { rejectValue: string }
>(
  'weather/fetchForecastByCoords',
  async ({ lat, lon, days }, { rejectWithValue }) => {
    try {
      const data = await weatherService.getForecastByCoords(lat, lon, days);
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch forecast';
      return rejectWithValue(errorMessage);
    }
  },
);
