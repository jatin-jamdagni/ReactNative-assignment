import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ForecastData } from '../types/weather';
import { COLORS, MAX_FORECAST_DAYS } from '../utils/constants';
import Feather, { FeatherIconName } from '@react-native-vector-icons/feather';

interface ForecastCardProps {
  forecast: ForecastData;
  days: number;
  onDayChange: (days: number) => void;
  onForecastPress: (index: number) => void;
}

const ForecastCard: React.FC<ForecastCardProps> = ({
  forecast,
  days,
  onDayChange,
  onForecastPress,
}) => {
  const getWeatherIcon = (icon: string) => {
    return `https:${icon}`;
  };

  const daysOptions = [3, 5, 7, 10];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Feather name="calendar" size={24} color={COLORS.primary} />
          <Text style={styles.title}>Weather Forecast</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {forecast.forecast.forecastday.length} days
          </Text>
        </View>
      </View>

      <View style={styles.daysSelector}>
        {daysOptions.map(dayOption => (
          <TouchableOpacity
            key={dayOption}
            style={[
              styles.dayButton,
              days === dayOption && styles.dayButtonActive,
            ]}
            onPress={() => onDayChange(dayOption)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayButtonText,
                days === dayOption && styles.dayButtonTextActive,
              ]}
            >
              {dayOption} Days
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContent}
      >
        {forecast.forecast.forecastday.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={styles.forecastItem}
            onPress={() => onForecastPress(index)}
            activeOpacity={0.8}
          >
            <View style={styles.itemHeader}>
              <View style={styles.dateCondition}>
                <Text style={styles.dayOfWeek}>{getDayOfWeek(day.date)}</Text>
                <Text style={styles.date}>{formatDate(day.date)}</Text>
              </View>
              <View style={styles.conditionInfo}>
                <Image
                  source={{ uri: getWeatherIcon(day.day.condition.icon) }}
                  style={styles.icon}
                />
              </View>
            </View>

            <Text style={styles.condition}>{day.day.condition.text}</Text>

            <View style={styles.temperatureRow}>
              <View style={[styles.tempCard, { backgroundColor: '#FF6B6B15' }]}>
                <Feather name="arrow-up" size={14} color="#FF6B6B" />
                <View style={styles.tempContent}>
                  <Text style={styles.tempLabel}>High</Text>
                  <Text style={[styles.tempValue, { color: '#FF6B6B' }]}>
                    {Math.round(day.day.maxtemp_c)}°
                  </Text>
                </View>
              </View>

              <View style={[styles.tempCard, { backgroundColor: '#4ECDC415' }]}>
                <Feather name="minus" size={14} color="#4ECDC4" />
                <View style={styles.tempContent}>
                  <Text style={styles.tempLabel}>Avg</Text>
                  <Text style={[styles.tempValue, { color: '#4ECDC4' }]}>
                    {Math.round(day.day.avgtemp_c)}°
                  </Text>
                </View>
              </View>

              <View style={[styles.tempCard, { backgroundColor: '#4A90E215' }]}>
                <Feather name="arrow-down" size={14} color="#4A90E2" />
                <View style={styles.tempContent}>
                  <Text style={styles.tempLabel}>Low</Text>
                  <Text style={[styles.tempValue, { color: '#4A90E2' }]}>
                    {Math.round(day.day.mintemp_c)}°
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.additionalDetails}>
              <DetailBadge
                iconName="droplet"
                label="Rain Chance"
                value={`${day.day.daily_chance_of_rain}%`}
                color="#2196F3"
              />
              <DetailBadge
                iconName="wind"
                label="Wind Speed"
                value={`${Math.round(day.day.maxwind_kph)} km/h`}
                color="#9C27B0"
              />
              <DetailBadge
                iconName="eye"
                label="Visibility"
                value={`${Math.round(day.day.avgvis_km)} km`}
                color="#4CAF50"
              />
            </View>

            <View style={styles.tapIndicator}>
              <Text style={styles.tapText}>Tap for details</Text>
              <Feather
                name="chevron-right"
                size={14}
                color={COLORS.textSecondary}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

interface DetailBadgeProps {
  iconName: FeatherIconName;
  label: string;
  value: string;
  color: string;
}

const DetailBadge: React.FC<DetailBadgeProps> = ({
  iconName,
  label,
  value,
  color,
}) => (
  <View style={styles.badge}>
    <View
      style={[styles.badgeIconContainer, { backgroundColor: color + '15' }]}
    >
      <Feather name={iconName} size={16} color={color} />
    </View>
    <View style={styles.badgeContent}>
      <Text style={styles.badgeLabel}>{label}</Text>
      <Text style={styles.badgeValue}>{value}</Text>
    </View>
  </View>
);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  countBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  daysSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 6,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 3,
  },
  dayButtonActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dayButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  forecastItem: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateCondition: {
    flex: 1,
  },
  dayOfWeek: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  conditionInfo: {
    alignItems: 'center',
  },
  icon: {
    width: 48,
    height: 48,
  },
  condition: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  temperatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tempCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 3,
  },
  tempContent: {
    marginLeft: 6,
  },
  tempLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  tempValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  additionalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 12,
  },
  badge: {
    alignItems: 'center',
    flex: 1,
  },
  badgeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeContent: {
    alignItems: 'center',
  },
  badgeLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  badgeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  tapIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  tapText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default ForecastCard;
