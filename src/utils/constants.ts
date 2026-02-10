import Config from 'react-native-config';

export const API_KEY = Config.WEATHER_API_KEY || '';
export const API_BASE_URL =
  Config.WEATHER_BASE_URL || 'https://api.weatherapi.com/v1';

export const TEMPERATURE_UNITS = {
  CELSIUS: 'C',
  FAHRENHEIT: 'F',
};

export const DEFAULT_TEMPERATURE_UNIT = TEMPERATURE_UNITS.CELSIUS;
export const DEFAULT_FORECAST_DAYS = 3;
export const MAX_FORECAST_DAYS = 10;

export const COLORS = {
  primary: '#2196F3',
  secondary: '#FF9800',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#212121',
  textSecondary: '#666666',
  border: '#E0E0E0',
};

export const WEATHER_CONDITIONS = {
  SUNNY: 'Sunny',
  CLOUDY: 'Cloudy',
  RAINY: 'Rainy',
  SNOWY: 'Snowy',
  WINDY: 'Windy',
  FOGGY: 'Foggy',
  HAIL: 'Hail',
  THUNDERSTORM: 'Thunderstorm',
};
