import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  NativeModules,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const kommunicateAppId = '2c3b81318c6232a9e94a28f3783a64c63'; // Replace with your Kommunicate App ID
const RNKommunicateChat = NativeModules.RNKommunicateChat;

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  // Helper function to handle Kommunicate login
  const handleLogin = async (kmUser: any) => {
    RNKommunicateChat.isLoggedIn((isLoggedIn: string) => {
      if (isLoggedIn === 'True') {
        RNKommunicateChat.logout((logoutResponse: string) => {
          if (logoutResponse === 'Success') {
            loginUser(kmUser);
          } else {
            Alert.alert('Error', 'Failed to log out the user.');
          }
        });
      } else {
        loginUser(kmUser);
      }
    });
  };

  // Function to log in the user
  const loginUser = (kmUser: any) => {
    RNKommunicateChat.loginUser(kmUser, (response: string, message: any) => {
      if (response === 'Success') {
        console.log('Login Success:', message);
        navigation.navigate('Home'); // Navigate to Home screen
      } else {
        console.error('Login Error:', message);
        Alert.alert('Login Error', message);
      }
    });
  };

  // Handle Login Button Press
  const handleLoginButtonPressed = () => {
    if (!userId || !password) {
      Alert.alert('Validation Error', 'Please enter both User ID and Password.');
      return;
    }

    const kmUser = {
      userId,
      password,
      applicationId: kommunicateAppId,
    };

    handleLogin(kmUser);
  };

  // Handle Login as Visitor
  const handleLoginAsVisitorPressed = () => {
    RNKommunicateChat.loginAsVisitor(kommunicateAppId, (response: string, message: any) => {
      if (response === 'Error') {
        console.error(message);
        Alert.alert('Error', message);
      } else {
        console.log('Logged in as Visitor');
        navigation.navigate('Home'); // Navigate to Home screen
      }
    });
  };

  // Handle Create Conversation
  const handleCreateConversationPressed = () => {
    const conversationObject = { appId: kommunicateAppId };

    RNKommunicateChat.buildConversation(
      conversationObject,
      (response: string, responseMessage: any) => {
        if (response === 'Success') {
          console.log('Conversation created successfully:', responseMessage);
        } else {
          console.error('Failed to create conversation:', responseMessage);
          Alert.alert('Error', responseMessage);
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <Image source={require('../assets/Kommunicate_Logo.png')} style={styles.logo} />

      {/* Title Section */}
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue</Text>

      {/* Login Form */}
      <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          placeholderTextColor="#B0B0B0"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B0B0B0"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Buttons */}
        <CustomButton text="Log In" onPress={handleLoginButtonPressed} />
        <CustomButton text="Login as Visitor" onPress={handleLoginAsVisitorPressed} />
        <CustomButton text="Build Conversation" onPress={handleCreateConversationPressed} />
      </View>
    </View>
  );
};

// Reusable Button Component
const CustomButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#F9FAFB' },

  logo: { width: 300, height: 100, resizeMode: 'contain', marginBottom: 30 },

  title: { fontSize: 28, fontWeight: '700', color: '#333', marginBottom: 5 },

  subtitle: { fontSize: 16, fontWeight: '400', color: '#666', marginBottom: 30 },

  loginContainer: { width: '100%', paddingHorizontal: 20 },

  input: { width: '100%', paddingVertical: 14, paddingHorizontal: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, backgroundColor: '#FFF', fontSize: 16, marginBottom: 15 },

  button: { width: '100%', height: 50, backgroundColor: '#007BFF', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },

  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});

export default LoginScreen;
