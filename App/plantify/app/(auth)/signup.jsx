import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { AuthService } from '../../src/services/authService'
import { getNetworkInfo } from '../../src/utils/networkUtils'

const signup_img = require("../../assets/images/login_img.jpg");

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, strength: 'Weak' })
  const router = useRouter();

  // Check password strength
  const checkPasswordStrength = async (password) => {
    if (password.length === 0) {
      setPasswordStrength({ score: 0, strength: 'Weak' });
      return;
    }

    try {
      const result = await AuthService.checkPasswordStrength(password);
      if (result.success) {
        setPasswordStrength({
          score: result.data.score,
          strength: result.data.strength
        });
      }
    } catch (error) {
      console.error('Password strength check error:', error);
    }
  };

  const handleSignup = async () => {
    // Validation
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await AuthService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword,
      });

      if (result.success) {
        Alert.alert(
          'Success!',
          'Account created successfully! Please check your email for verification code.',
          [
            {
              text: 'OK',
              onPress: () => router.push({
                pathname: '/email_verify',
                params: { email: email.trim() }
              })
            }
          ]
        );
      } else {
        setError(result.error);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#e8f3e8]">
      {/* Top Image */}
      <View className="w-full h-48 relative">
        <Image
          source={signup_img}
          className="w-full h-full rounded-b-3xl"
          style={{ resizeMode: 'cover' }}
        />
      </View>

      {/* White rounded container for form */}
      <View className="absolute top-36 left-0 right-0 px-6">
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          <Text className="text-3xl font-semibold mb-8 text-[#86B049]">Sign Up</Text>

          {/* First Name Input */}
          <View className="flex-row items-center border-b border-gray-300 mb-6 pb-1">
            <MaterialIcons name="person-outline" size={22} color="#86B049" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              className="flex-1 py-2 px-1 text-gray-700"
              placeholderTextColor="#86B049"
            />
          </View>

          {/* Last Name Input */}
          <View className="flex-row items-center border-b border-gray-300 mb-6 pb-1">
            <MaterialIcons name="person-outline" size={22} color="#86B049" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              className="flex-1 py-2 px-1 text-gray-700"
              placeholderTextColor="#86B049"
            />
          </View>

          {/* Email Input */}
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

          {/* Password Input with show/hide icon */}
          <View className="flex-row items-center border-b border-gray-300 mb-2 pb-1">
            <MaterialIcons name="lock-outline" size={22} color="#86B049" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                checkPasswordStrength(text);
              }}
              secureTextEntry={!showPassword}
              className="flex-1 py-2 px-1 text-gray-700"
              placeholderTextColor="#86B049"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#86B049" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input with show/hide icon */}
          <View className="flex-row items-center border-b border-gray-300 mb-6 pb-1">
            <MaterialIcons name="lock-outline" size={22} color="#86B049" style={{ marginRight: 8 }} />
            <TextInput
              placeholder="confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              className="flex-1 py-2 px-1 text-gray-700"
              placeholderTextColor="#86B049"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#86B049" />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error ? (
            <Text className="text-red-600 text-center mb-4">{error}</Text>
          ) : null}

          {/* Signup Button */}
          <TouchableOpacity 
            className={`py-3 rounded-full mb-6 shadow ${loading ? 'bg-gray-400' : 'bg-[#86B049]'}`} 
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white text-center font-semibold text-lg ml-2">Creating Account...</Text>
              </View>
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>

          {/* OR Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-[1px] bg-gray-300" />
            <Text className="mx-4 text-gray-500">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-300" />
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity>
              <Text className="text-[#86B049] font-semibold" onPress={() => router.push('/login')}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Signup