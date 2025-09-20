import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from "expo-router";
import { AuthService } from '../../src/services/authService';

const reset_img = require("../../assets/images/login_img.jpg");

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter();

    const handleSendReset = async () => {
        // Validation
        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }

        setError('');
        setLoading(true);

        try {
            console.log('Requesting password reset for email:', email.trim());
            const result = await AuthService.requestPasswordReset(email.trim());
            console.log('Password reset result:', result);
            
            if (result.success) {
                setIsSubmitted(true);
                Alert.alert(
                    'Success!',
                    'Password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.',
                    [{ text: 'OK' }]
                );
            } else {
                setError(result.error || 'Failed to send reset link');
            }
        } catch (error) {
            if (error.message.includes('Network connection failed')) {
                Alert.alert(
                    'Connection Error',
                    'Cannot connect to backend server. Please check:\n\n1. Backend server is running\n2. IP address is correct\n3. Both devices are on same network',
                    [{ text: 'OK' }]
                );
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-[#e8f3e8]">
            {/* Top Image */}
            <View className="w-full h-48 relative">
                <Image
                    source={reset_img}
                    className="w-full h-full rounded-b-3xl"
                    style={{ resizeMode: 'cover' }}
                />
            </View>

            {/* White rounded container for form */}
            <View className="absolute top-36 left-0 right-0 px-6">
                <View className="bg-white rounded-2xl p-6 shadow-lg">
                    <Text className="text-3xl font-semibold mb-4 text-[#86B049] text-center">Reset Your Password</Text>
                    {isSubmitted ? (
                        <>
                            <View className="bg-green-100 border-l-4 border-green-500 p-4 mb-6 rounded">
                                <Text className="text-green-700 text-base text-center font-medium">
                                    Password reset link has been sent to your email.
                                </Text>
                            </View>
                            <Text className="mb-8 text-gray-700 text-base text-center">
                                Please check your email for instructions to reset your password.
                            </Text>
                           <TouchableOpacity  onPress={()=>router.push('/login')} style={{backgroundColor:"#87b641ff"}}className="p-2 my-2  text-black rounded-full  ">
                                <Text  className="text-xl font-semibold text-center text-white" >
                                    Return to login
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text className="text-gray-700 mb-8 text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </Text>
                            {/* Email Input */}
                            <View className="flex-row items-center border-b border-gray-300 mb-8 pb-1">
                                <MaterialIcons name="email" size={22} color="#86B049" style={{ marginRight: 8 }} />
                                <TextInput
                                    placeholder="your@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    className="flex-1 py-2 px-1 text-gray-700"
                                    placeholderTextColor="#86B049"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Error Message */}
                            {error ? (
                                <Text className="text-red-600 text-center mb-4">{error}</Text>
                            ) : null}

                            {/* Send Reset Link Button */}
                            <TouchableOpacity
                                className={`py-3 rounded-full mb-6 shadow ${loading ? 'bg-gray-400' : 'bg-[#86B049]'}`}
                                onPress={handleSendReset}
                                disabled={loading}
                            >
                                {loading ? (
                                    <View className="flex-row items-center justify-center">
                                        <ActivityIndicator color="white" size="small" />
                                        <Text className="text-white text-center font-semibold text-lg ml-2">Sending...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">Send Reset Link</Text>
                                )}
                            </TouchableOpacity>
                            {/* Return to Login Link */}
                            <View className="flex-row justify-center mt-2">
                                <TouchableOpacity>
                                    <Text className="text-[#86B049] font-semibold" onPress={() => router.push('/login')}>Return to Login</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </View>
    )
}

export default ForgotPassword