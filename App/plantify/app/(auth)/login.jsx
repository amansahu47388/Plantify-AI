import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useAuth } from '../../src/contexts/AuthContext'
import { getNetworkInfo } from '../../src/utils/networkUtils'

const login_img = require("../../assets/images/login_img.jpg");

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setError('');

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
        Alert.alert(
          'Success!',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/home')
            }
          ]
        );
      } else {
        if (result.requiresVerification) {
          Alert.alert(
            'Email Verification Required',
            'Please verify your email before logging in.',
            [
              {
                text: 'Verify Email',
                onPress: () => router.push({
                  pathname: '/email_verify',
                  params: { email: email.trim() }
                })
              },
              {
                text: 'Cancel',
                style: 'cancel'
              }
            ]
          );
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      if (error.message.includes('Network connection failed')) {
        Alert.alert(
          'Connection Error',
          'Cannot connect to backend server. Please check:\n\n1. Backend server is running (python manage.py runserver 0.0.0.0:8000)\n2. IP address is correct in src/config/api.js\n3. Both devices are on same WiFi network\n\nCheck console for IP detection help.',
          [
            {
              text: 'Show IP Help',
              onPress: () => {
                getNetworkInfo();
                Alert.alert('IP Detection Help', 'Check the console/terminal for detailed instructions on finding your IP address.');
              }
            },
            { text: 'OK' }
          ]
        );
      } else {
        setError(error.message);
      }
    }
  };
  return (
    <View className="flex-1 bg-[#e8f3e8]">
      {/* Top Image with rounded bottom */}
      <View className="w-full h-48 relative">
        <Image
          source={login_img}
          className="w-full h-full rounded-b-3xl"
          style={{ resizeMode: 'cover' }}
        />
      </View>

      {/* White rounded container for form */}
      <View className="absolute top-36 left-0 right-0 px-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-3xl font-semibold mb-8 text-[#86B049]">Login</Text>

          {/* Email Input with icon */}
          <View className="flex-row items-center border-b border-gray-300 mb-6 pb-1">
            <MaterialIcons name="email" size={22} color="#86B049" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="email"
              value={email}
              onChangeText={setEmail}
              className="flex-1 py-2 px-1 text-gray-700"
              placeholderTextColor="#86B049"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input with icon and show/hide */}
          <View className="flex-row items-center border-b border-gray-300 mb-6 pb-1">
            <MaterialIcons name="lock-outline" size={22} color="#86B049" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              className="flex-1 py-2 px-1 text-gray-700"
              placeholderTextColor="#86B049"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#86B049" />
            </TouchableOpacity>
          </View>

          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center mb-8">
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center"
            >
              <View className={`w-5 h-5 border border-gray-300 rounded mr-2 ${rememberMe ? 'bg-[#86B049]' : 'bg-white'} justify-center items-center`}>
                {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text className="text-gray-600">Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className=" font-medium text-[#86B049]" onPress={()=>router.push('/forgot_password')}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-600 text-center mb-4">{error}</Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity 
            className={`py-3 rounded-full mb-6 shadow ${isLoading ? 'bg-gray-400' : 'bg-[#86B049]'}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white text-center font-semibold text-lg ml-2">Logging in...</Text>
              </View>
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Login</Text>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have account? </Text>
            <TouchableOpacity>
              <Text className="text-[#86B049] font-semibold" onPress={()=>router.push('/signup')}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Login