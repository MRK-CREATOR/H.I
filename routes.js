import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

// Auth Screens
import SplashScreen from './screens/Splash';
import WelcomeScreen from './screens/Welcome';
import RegisterScreen from './screens/Register';
import LoginScreen from './screens/Login';

// Main Screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreatePostScreen from './screens/CreatePost';
import TrendingScreen from './screens/TrendingScreen';

// Post Creation Screens
import IdeaSnapCreator from './components/Posts/IdeaSnapCreator';
import MarketGapCreator from './components/Posts/MarketGapCreator';
import ThoughtCreator from './components/Posts/ThoughtCreator';
import ObservationCreator from './components/Posts/ObservationCreator';

import theme from './theme';

// Stack navigators
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Authentication flow navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator 
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
};

// Main tab navigator for authenticated users
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'WTF') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.regular,
        },
      })}
    >
      <Tab.Screen 
        name="WTF" 
        component={HomeScreen} 
        options={{ title: 'WTF!' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  );
};

// Stack for post creation screens
const PostCreationNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontFamily: theme.fonts.bold,
        },
      }}
    >
      <MainStack.Screen 
        name="CreatePost" 
        component={CreatePostScreen} 
        options={{ title: 'Create Post' }}
      />
      <MainStack.Screen 
        name="IdeaSnapCreator" 
        component={IdeaSnapCreator} 
        options={{ title: 'Idea Snap' }}
      />
      <MainStack.Screen 
        name="MarketGapCreator" 
        component={MarketGapCreator} 
        options={{ title: 'Market Gap' }}
      />
      <MainStack.Screen 
        name="ThoughtCreator" 
        component={ThoughtCreator} 
        options={{ title: 'Thought' }}
      />
      <MainStack.Screen 
        name="ObservationCreator" 
        component={ObservationCreator} 
        options={{ title: 'Observation' }}
      />
    </MainStack.Navigator>
  );
};

// Main app navigator that handles auth state
const AppNavigator = () => {
  // Check if user is authenticated
  const isAuthenticated = useSelector((state) => !!state.auth.token);
  
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        // Auth Screens
        <MainStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // Main App Screens
        <>
          <MainStack.Screen name="Main" component={MainTabNavigator} />
          <MainStack.Screen name="PostCreation" component={PostCreationNavigator} />
          <MainStack.Screen name="Trending" component={TrendingScreen} />
        </>
      )}
    </MainStack.Navigator>
  );
};

export default AppNavigator;