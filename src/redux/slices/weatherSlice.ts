import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCurrentWeather,
  fetchCitySuggestions,
  fetchWeatherByCoords,
} from '../thunks/weatherThunks';
import { CurrentWeather } from '../../types/weather';

interface WeatherState {
  current: CurrentWeather | null;
  loading: boolean;
  error: string | null;
  suggestions: Array<{ name: string; region: string; country: string }>;
  suggestionsLoading: boolean;
  selectedCity: string;
  recentSearches: string[];
}

const initialState: WeatherState = {
  current: null,
  loading: false,
  error: null,
  suggestions: [],
  suggestionsLoading: false,
  selectedCity: '',
  recentSearches: [],
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearSuggestions: state => {
      state.suggestions = [];
    },
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const city = action.payload.trim();
      if (city && !state.recentSearches.includes(city)) {
        state.recentSearches = [city, ...state.recentSearches].slice(0, 5);
      }
    },
    clearRecentSearches: state => {
      state.recentSearches = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCurrentWeather.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchWeatherByCoords.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchCitySuggestions.pending, state => {
        state.suggestionsLoading = true;
      })
      .addCase(fetchCitySuggestions.fulfilled, (state, action) => {
        state.suggestionsLoading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchCitySuggestions.rejected, state => {
        state.suggestionsLoading = false;
        state.suggestions = [];
      });
  },
});

export const {
  clearError,
  clearSuggestions,
  setSelectedCity,
  addRecentSearch,
  clearRecentSearches,
} = weatherSlice.actions;
export default weatherSlice.reducer;
