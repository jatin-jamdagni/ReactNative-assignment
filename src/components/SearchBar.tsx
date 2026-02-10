import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCitySuggestions } from '../redux/thunks/weatherThunks';
import { COLORS } from '../utils/constants';
import Feather from '@react-native-vector-icons/feather';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onCurrentLocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onCurrentLocation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { suggestions, suggestionsLoading, recentSearches } = useSelector(
    (state: RootState) => state.weather,
  );

  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (text.length >= 2) {
        setShowSuggestions(true);
        dispatch(fetchCitySuggestions(text));
      } else {
        setShowSuggestions(false);
      }
    },
    [dispatch],
  );

  const handleSelectSuggestion = useCallback(
    (item: (typeof suggestions)[0]) => {
      const displayQuery = item.name;
      const searchParam = `${item.name}${
        item.region ? `, ${item.region}` : ''
      }${item.country ? `, ${item.country}` : ''}`;
      setQuery(displayQuery);
      setShowSuggestions(false);
      onSearch(searchParam);
    },
    [onSearch],
  );

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      onSearch(query);
      setShowSuggestions(false);
    }
  }, [query, onSearch]);

  const renderSuggestion = ({ item }: { item: (typeof suggestions)[0] }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionIconContainer}>
        <Feather
          name={query.length < 2 ? 'clock' : 'map-pin'}
          size={16}
          color={query.length < 2 ? COLORS.textSecondary : COLORS.primary}
        />
      </View>
      <View style={styles.suggestionContent}>
        <Text
          style={styles.suggestionText}
          numberOfLines={1}
          lineBreakMode="tail"
        >
          {item.name}
          {item.region && `, ${item.region}`}
        </Text>
        {item.country && (
          <Text style={styles.suggestionSubText}>{item.country}</Text>
        )}
      </View>
      <Feather name="arrow-up-left" size={14} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          isFocused && styles.searchContainerFocused,
        ]}
      >
        <View style={styles.searchIconContainer}>
          <Feather
            name="search"
            size={20}
            color={isFocused ? COLORS.primary : COLORS.textSecondary}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Search for a city..."
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={handleQueryChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            // Increased timeout to ensure onPress fires before list disappears
            setTimeout(() => setShowSuggestions(false), 300);
          }}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery('');
              setShowSuggestions(false);
            }}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Feather name="x-circle" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}

        {suggestionsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : (
          <TouchableOpacity
            onPress={onCurrentLocation}
            style={styles.locationButton}
            activeOpacity={0.7}
          >
            <Feather name="navigation" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions &&
        (query.length >= 2
          ? suggestions.length > 0
          : recentSearches.length > 0) && (
          <View style={styles.suggestionsList}>
            {query.length < 2 && recentSearches.length > 0 && (
              <View style={styles.recentHeader}>
                <Feather name="clock" size={14} color={COLORS.textSecondary} />
                <Text style={styles.recentTitle}>Recent Searches</Text>
              </View>
            )}
            <FlatList
              data={
                query.length >= 2
                  ? suggestions
                  : recentSearches.map(name => ({
                      name,
                      region: '',
                      country: '',
                    }))
              }
              renderItem={renderSuggestion}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginBottom: 20,
    marginTop: 12,
    marginHorizontal: 16,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  searchContainerFocused: {
    borderColor: COLORS.primary + '30',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 4,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    marginRight: 8,
  },
  loadingContainer: {
    padding: 4,
  },
  locationButton: {
    padding: 4,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginTop: 8,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 1000,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  suggestionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  suggestionSubText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
});

export default SearchBar;
