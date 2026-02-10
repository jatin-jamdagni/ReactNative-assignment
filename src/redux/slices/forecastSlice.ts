import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchForecast, fetchForecastByCoords } from '../thunks/weatherThunks';
import { ForecastData } from '../../types/weather';

interface ForecastState {
  data: ForecastData | null;
  loading: boolean;
  error: string | null;
  days: number;
}

const initialState: ForecastState = {
  data: null,
  loading: false,
  error: null,
  days: 3,
};

const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    clearForecastError: state => {
      state.error = null;
    },
    setForecastDays: (state, action: PayloadAction<number>) => {
      state.days = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchForecast.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchForecastByCoords.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchForecastByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearForecastError, setForecastDays } = forecastSlice.actions;
export default forecastSlice.reducer;
