import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import { NativeModules, ActivityIndicator, View, StyleSheet } from 'react-native';

// Access the native module
const RNKommunicateChat = NativeModules.RNKommunicateChat;

// Define types for your navigation stack
export type RootStackParamList = {
  Login: undefined; // No parameters for Login screen
  Home: undefined;  // No parameters for Home screen
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track login status

  useEffect(() => {
    // Check if the user is logged in
    RNKommunicateChat.isLoggedIn((response: string) => {
      if (response === "True") {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is not logged in
      }
    });
  }, []);

  if (isLoggedIn === null) {
    // Show a loading spinner while checking login status
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StackNavigator;
