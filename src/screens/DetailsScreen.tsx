import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ForecastDay } from '../types/weather';
import { COLORS } from '../utils/constants';
import Feather, { FeatherIconName } from '@react-native-vector-icons/feather';

interface DetailScreenProps {
  route: any;
  navigation: any;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ route, navigation }) => {
  const { day, city } = route.params as { day: ForecastDay; city: string };

  const hourlyData = useMemo(() => {
    return day.hour.filter(
      hour => parseInt(hour.time.split(' ')[1], 10) % 3 === 0,
    );
  }, [day.hour]);

  const getWeatherIcon = (condition: string) => {
    return `https:${condition}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={16} color={COLORS.primary} />
            <Text style={styles.headerTitle}>{city}</Text>
          </View>
          <Text style={styles.date}>{formatDate(day.date)}</Text>
        </View>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="sun" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Daily Summary</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIconBox,
                  { backgroundColor: '#FF6B6B15' },
                ]}
              >
                <Feather name="arrow-up" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.label}>High</Text>
              <Text style={[styles.value, { color: '#FF6B6B' }]}>
                {Math.round(day.day.maxtemp_c)}°C
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIconBox,
                  { backgroundColor: '#4ECDC415' },
                ]}
              >
                <Feather name="minus" size={20} color="#4ECDC4" />
              </View>
              <Text style={styles.label}>Average</Text>
              <Text style={[styles.value, { color: '#4ECDC4' }]}>
                {Math.round(day.day.avgtemp_c)}°C
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIconBox,
                  { backgroundColor: '#4A90E215' },
                ]}
              >
                <Feather name="arrow-down" size={20} color="#4A90E2" />
              </View>
              <Text style={styles.label}>Low</Text>
              <Text style={[styles.value, { color: '#4A90E2' }]}>
                {Math.round(day.day.mintemp_c)}°C
              </Text>
            </View>
          </View>

          <View style={styles.conditionContainer}>
            <Image
              source={{ uri: getWeatherIcon(day.day.condition.icon) }}
              style={styles.conditionIcon}
            />
            <Text style={styles.conditionText}>{day.day.condition.text}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="cloud" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Weather Details</Text>
          </View>

          <DetailRow
            icon="droplet"
            label="Humidity"
            value={`${day.day.avghumidity}%`}
            color="#2196F3"
          />
          <DetailRow
            icon="wind"
            label="Max Wind Speed"
            value={`${Math.round(day.day.maxwind_kph)} km/h`}
            color="#9C27B0"
          />
          <DetailRow
            icon="cloud-rain"
            label="Total Precipitation"
            value={`${day.day.totalprecip_mm.toFixed(1)} mm`}
            color="#00BCD4"
          />
          <DetailRow
            icon="umbrella"
            label="Chance of Rain"
            value={`${day.day.daily_chance_of_rain}%`}
            color="#03A9F4"
          />
          <DetailRow
            icon="cloud-snow"
            label="Chance of Snow"
            value={`${day.day.daily_chance_of_snow}%`}
            color="#607D8B"
          />
          <DetailRow
            icon="eye"
            label="Visibility"
            value={`${day.day.avgvis_km} km`}
            color="#4CAF50"
          />
          <DetailRow
            icon="sun"
            label="UV Index"
            value={`${day.day.uv}`}
            color="#FF9800"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="star" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Astronomy</Text>
          </View>

          <DetailRow
            icon="sunrise"
            label="Sunrise"
            value={day.astro.sunrise}
            color="#FFA726"
          />
          <DetailRow
            icon="sunset"
            label="Sunset"
            value={day.astro.sunset}
            color="#FF7043"
          />
          <DetailRow
            icon="moon"
            label="Moonrise"
            value={day.astro.moonrise}
            color="#7E57C2"
          />
          <DetailRow
            icon="moon"
            label="Moonset"
            value={day.astro.moonset}
            color="#5C6BC0"
          />
          <DetailRow
            icon="moon"
            label="Moon Phase"
            value={day.astro.moon_phase}
            color="#9575CD"
          />
          <DetailRow
            icon="circle"
            label="Moon Illumination"
            value={`${day.astro.moon_illumination}%`}
            color="#B39DDB"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="clock" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hourlyScroll}
            contentContainerStyle={styles.hourlyScrollContent}
          >
            {hourlyData.map((hour, index) => (
              <View key={index} style={styles.hourlyCard}>
                <Text style={styles.hourTime}>{hour.time.split(' ')[1]}</Text>
                <Image
                  source={{ uri: getWeatherIcon(hour.condition.icon) }}
                  style={styles.hourlyIcon}
                />
                <Text style={styles.hourTemp}>{Math.round(hour.temp_c)}°</Text>
                <View style={styles.hourDetailRow}>
                  <Feather name="droplet" size={10} color={COLORS.primary} />
                  <Text style={styles.hourDetail}>{hour.humidity}%</Text>
                </View>
                <View style={styles.hourDetailRow}>
                  <Feather name="wind" size={10} color={COLORS.textSecondary} />
                  <Text style={styles.hourDetail}>
                    {Math.round(hour.wind_kph)}km/h
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface DetailRowProps {
  icon: FeatherIconName;
  label: string;
  value: string;
  color: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, color }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <View style={[styles.detailIconBox, { backgroundColor: color + '15' }]}>
        <Feather name={icon} size={16} color={color} />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  conditionIcon: {
    width: 56,
    height: 56,
    marginRight: 16,
  },
  conditionText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  hourlyScroll: {
    marginTop: 8,
  },
  hourlyScrollContent: {
    paddingRight: 16,
  },
  hourlyCard: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginRight: 12,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    minWidth: 90,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hourTime: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  hourlyIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  hourTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  hourDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  hourDetail: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default DetailScreen;
