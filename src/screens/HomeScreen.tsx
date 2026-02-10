import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert,
  Platform,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import {
  fetchCurrentWeather,
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
} from '../redux/thunks/weatherThunks';
import { setForecastDays } from '../redux/slices/forecastSlice';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import ForecastCard from '../components/ForecastCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { COLORS, DEFAULT_FORECAST_DAYS } from '../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);

  const {
    current,
    loading: weatherLoading,
    error: weatherError,
  } = useSelector((state: RootState) => state.weather);
  const {
    data: forecast,
    loading: forecastLoading,
    error: forecastError,
    days,
  } = useSelector((state: RootState) => state.forecast);

  const handleSearch = useCallback(
    (city: string) => {
      if (city.trim()) {
        dispatch(fetchCurrentWeather(city));
        dispatch(fetchForecast({ city, days: DEFAULT_FORECAST_DAYS }));
      }
    },
    [dispatch],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (current?.location.name) {
      await dispatch(fetchCurrentWeather(current.location.name));
      await dispatch(fetchForecast({ city: current.location.name, days }));
    }
    setRefreshing(false);
  }, [current, days, dispatch]);

  const handleForecastDayChange = useCallback(
    (newDays: number) => {
      dispatch(setForecastDays(newDays));
      if (current?.location.name) {
        dispatch(fetchForecast({ city: current.location.name, days: newDays }));
      }
    },
    [current, dispatch],
  );

  const handleForecastPress = useCallback(
    (index: number) => {
      if (forecast?.forecast.forecastday[index]) {
        navigation.navigate('Detail', {
          day: forecast.forecast.forecastday[index],
          city: forecast.location.name,
        });
      }
    },
    [forecast, navigation],
  );

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocationWeather = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location permission is required to fetch weather for your current position.',
        [{ text: 'OK', style: 'default' }],
      );
      return;
    }

    try {
      Geolocation.getCurrentPosition(
        (position: any) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchWeatherByCoords({ lat: latitude, lon: longitude }));
          dispatch(
            fetchForecastByCoords({
              lat: latitude,
              lon: longitude,
              days: DEFAULT_FORECAST_DAYS,
            }),
          );
        },
        (error: any) => {
          console.log('Geolocation error:', error);
          handleSearch('Delhi');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error) {
      console.log('Geolocation error:', error);
      handleSearch('Delhi');
    }
  }, [dispatch, handleSearch]);

  useEffect(() => {
    getCurrentLocationWeather();
  }, [getCurrentLocationWeather]);

  const isLoading = weatherLoading || forecastLoading;
  const error = weatherError || forecastError;

  const getWeatherGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <Feather name="cloud-drizzle" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.greetingText}>{getWeatherGreeting()}</Text>
            <Text style={styles.headerTitle}>Weather Forecast</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
          activeOpacity={0.7}
        >
          <Feather name="refresh-cw" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          onSearch={handleSearch}
          onCurrentLocation={getCurrentLocationWeather}
        />

        {isLoading && !current && <LoadingSpinner />}

        {error && !current && (
          <ErrorMessage
            message={error}
            onRetry={() => getCurrentLocationWeather()}
          />
        )}

        {current && (
          <>
            <CurrentWeather weather={current} />

            {forecast && (
              <View style={styles.forecastContainer}>
                <ForecastCard
                  forecast={forecast}
                  days={days}
                  onDayChange={handleForecastDayChange}
                  onForecastPress={handleForecastPress}
                />
              </View>
            )}

            {forecastLoading && (
              <View style={styles.loadingOverlay}>
                <LoadingSpinner message="Updating forecast..." />
              </View>
            )}
          </>
        )}

        {!current && !isLoading && !error && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Feather
                name="cloud-off"
                size={64}
                color={COLORS.textSecondary}
              />
            </View>
            <Text style={styles.emptyTitle}>No Weather Data</Text>
            <Text style={styles.emptySubtitle}>
              Search for a city or use your current location
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={getCurrentLocationWeather}
              activeOpacity={0.8}
            >
              <Feather name="navigation" size={18} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Use Current Location</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  greetingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  forecastContainer: {
    marginTop: 4,
  },
  loadingOverlay: {
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
