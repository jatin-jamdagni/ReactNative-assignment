import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import forecastReducer from './slices/forecastSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    forecast: forecastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
