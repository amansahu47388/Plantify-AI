import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from "expo-router";

const reset_img = require("../../assets/images/login_img.jpg");

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const router = useRouter();

    const handleSendReset = () => {
        // Simulate API call success
        setIsSubmitted(true)
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
                            {/* Send Reset Link Button */}
                            <TouchableOpacity
                                className="bg-[#86B049] py-3 rounded-full mb-6 shadow"
                                onPress={handleSendReset}
                            >
                                <Text className="text-white text-center font-semibold text-lg">Send Reset Link</Text>
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