import { CurrentWeather, ForecastData, CitySuggestion } from '../types/weather';
import { API_KEY, API_BASE_URL } from '../utils/constants';

class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = API_BASE_URL;
  }

  async getCurrentWeather(city: string): Promise<CurrentWeather> {
    try {
      const url = `${this.baseUrl}/current.json?key=${
        this.apiKey
      }&q=${encodeURIComponent(city)}&aqi=yes`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key.');
        }
        if (response.status === 400) {
          throw new Error('City not found. Please check the spelling.');
        }
        if (response.status === 403) {
          throw new Error('API key has been disabled or is invalid.');
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: CurrentWeather = await response.json();
      return data;
    } catch (error) {
      console.log('Error fetching current weather:', error);
      throw error;
    }
  }

  async getCurrentWeatherByCoords(
    lat: number,
    lon: number,
  ): Promise<CurrentWeather> {
    try {
      const url = `${this.baseUrl}/current.json?key=${this.apiKey}&q=${lat},${lon}&aqi=yes`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: CurrentWeather = await response.json();
      return data;
    } catch (error) {
      console.log('Error fetching weather by coords:', error);
      throw error;
    }
  }

  async getForecast(city: string, days: number): Promise<ForecastData> {
    try {
      const forecastDays = Math.min(days, 10);
      const url = `${this.baseUrl}/forecast.json?key=${
        this.apiKey
      }&q=${encodeURIComponent(city)}&days=${forecastDays}&aqi=yes`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('City not found. Please check the spelling.');
        }
        if (response.status === 403) {
          throw new Error('Invalid API key.');
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: ForecastData = await response.json();
      return data;
    } catch (error) {
      console.log('Error fetching forecast:', error);
      throw error;
    }
  }

  async getForecastByCoords(
    lat: number,
    lon: number,
    days: number,
  ): Promise<ForecastData> {
    try {
      const forecastDays = Math.min(days, 10);
      const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${lat},${lon}&days=${forecastDays}&aqi=yes`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: ForecastData = await response.json();
      return data;
    } catch (error) {
      console.log('Error fetching forecast by coords:', error);
      throw error;
    }
  }

  async searchCities(
    query: string,
  ): Promise<Array<{ name: string; region: string; country: string }>> {
    try {
      if (query.length < 2) {
        return [];
      }

      const url = `${this.baseUrl}/search.json?key=${
        this.apiKey
      }&q=${encodeURIComponent(query)}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.log('Error searching cities:', response.status);
        return [];
      }

      const data: CitySuggestion[] = await response.json();

      return data.map(city => ({
        name: city.name,
        region: city.region,
        country: city.country,
      }));
    } catch (error) {
      console.log('Error in searchCities:', error);
      return [];
    }
  }
}

export const weatherService = new WeatherService();
