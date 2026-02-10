import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CurrentWeather as CurrentWeatherType } from '../types/weather';
import { COLORS } from '../utils/constants';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Feather, { FeatherIconName } from '@react-native-vector-icons/feather';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const { location, current } = weather;

  const getWeatherIcon = (icon: string) => {
    return `https:${icon}`;
  };
  return (
    <View style={styles.container}>
      <View style={styles.locationHeader}>
        <View style={styles.locationRow}>
          <FontAwesome6
            iconStyle="solid"
            name="map-pin"
            size={24}
            color={COLORS.primary}
          />
          <View style={styles.locationTextContainer}>
            <Text style={styles.cityName}>{location.name}</Text>
            <Text style={styles.regionCountry}>
              {location.region}, {location.country}
            </Text>
          </View>
        </View>
        <View style={styles.timeBadge}>
          <FontAwesome6
            iconStyle="solid"
            name="clock-rotate-left"
            size={14}
            color={COLORS.textSecondary}
          />
          <Text style={styles.localTime}>{location.localtime}</Text>
        </View>
      </View>

      <View style={styles.mainWeatherCard}>
        <View style={styles.temperatureSection}>
          <Text style={styles.temperature}>{Math.round(current.temp_c)}°</Text>
          <View style={styles.tempDetails}>
            <View style={styles.feelsLikeContainer}>
              <Feather
                name="thermometer"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.feelsLike}>
                Feels {Math.round(current.feelslike_c)}°
              </Text>
            </View>
            <Text style={styles.condition}>{current.condition.text}</Text>
          </View>
        </View>

        <Image
          source={{ uri: getWeatherIcon(current.condition.icon) }}
          style={styles.weatherIcon}
        />
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailsGrid}>
          <DetailCard
            icon="wind"
            label="Wind"
            value={`${Math.round(current.wind_kph)}`}
            unit="km/h"
            color="#2196F3"
          />

          <DetailCard
            icon="droplet"
            label="Humidity"
            value={`${current.humidity}`}
            unit="%"
            color="#00BCD4"
          />

          <DetailCard
            icon="activity"
            label="Pressure"
            value={`${Math.round(current.pressure_mb)}`}
            unit="mb"
            color="#9C27B0"
          />

          <DetailCard
            icon="eye"
            label="Visibility"
            value={`${current.vis_km}`}
            unit="km"
            color="#4CAF50"
          />

          <DetailCard
            icon="sun"
            label="UV Index"
            value={`${current.uv}`}
            unit=""
            color="#FF9800"
          />

          <DetailCard
            icon="cloud-rain"
            label="Precipitation"
            value={`${current.precip_mm}`}
            unit="mm"
            color="#03A9F4"
          />
        </View>
      </View>

      <View style={styles.additionalInfo}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <InfoRow
          icon="compass"
          label="Wind Direction"
          value={`${current.wind_dir} (${current.wind_degree}°)`}
        />

        <InfoRow
          icon="droplet"
          label="Dew Point"
          value={`${current.feelslike_c}°C`}
        />

        <InfoRow
          icon={current.is_day ? 'sun' : 'moon'}
          label="Day/Night"
          value={current.is_day ? 'Daytime' : 'Nighttime'}
        />
      </View>
    </View>
  );
};

interface DetailCardProps {
  icon: FeatherIconName;
  label: string;
  value: string;
  unit: string;
  color: string;
}

const DetailCard: React.FC<DetailCardProps> = ({
  icon,
  label,
  value,
  unit,
  color,
}) => (
  <View style={styles.detailCard}>
    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
      <Feather name={icon} size={24} color={color} />
    </View>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.detailValueContainer}>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailUnit}>{unit}</Text>
    </View>
  </View>
);

interface InfoRowProps {
  icon: FeatherIconName;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <View style={styles.infoIconContainer}>
        <Feather name={icon} size={18} color={COLORS.primary} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  locationHeader: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTextContainer: {
    marginLeft: 8,
    flex: 1,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  regionCountry: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  localTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  mainWeatherCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -2,
  },
  tempDetails: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  feelsLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 8,
  },
  feelsLike: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  condition: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  weatherIcon: {
    width: 90,
    height: 90,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  detailUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  additionalInfo: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.8 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});

export default CurrentWeather;
