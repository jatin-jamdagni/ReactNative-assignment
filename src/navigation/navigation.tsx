import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { store } from '../redux/store';
import { COLORS } from '../utils/constants';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator();

const RootNavigation: React.FC = () => {
  return (
    <Provider store={store}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
            headerShadowVisible: true,
            animation: 'slide_from_right',
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerTitle: 'Weather Forecast',
              headerShown: false,
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={{
              headerTitle: 'Weather Details',
              headerShown: false,
              animation: 'slide_from_right',
              presentation: 'card',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default RootNavigation;
