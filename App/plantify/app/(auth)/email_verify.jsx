import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'

const verify_img = require("../../assets/images/login_img.jpg");

const EMAIL = "sahushyam50380@gmail.com"; // Replace with dynamic email if needed

const EmailVerify = () => {
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(33);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleResend = () => {
        setTimer(33);
        setCode('');
        // Add resend logic here
    };

    return (
        <View className="flex-1 bg-[#e8f3e8]">
            {/* Top Image */}
            <View className="w-full h-48 relative">
                <Image
                    source={verify_img}
                    className="w-full h-full rounded-b-3xl"
                    style={{ resizeMode: 'cover' }}
                />
            </View>

            {/* White rounded container for form */}
            <View className="absolute top-36 left-0 right-0 px-6">
                <View className="bg-white rounded-2xl p-6 shadow-lg items-center">
                    <Text className="text-2xl font-semibold mb-2 text-[#86B049]">Verify Your Email</Text>
                    <Text className="text-gray-700 mb-6 text-center">
                        We've sent a verification code to{"\n"}
                        <Text className="font-semibold">{EMAIL}</Text>
                    </Text>

                    {/* Single OTP Input */}
                    <TextInput
                        value={code}
                        onChangeText={text => {
                            // Only allow up to 6 digits
                            if (/^\d{0,6}$/.test(text)) setCode(text);
                        }}
                        keyboardType="number-pad"
                        maxLength={6}
                        className="w-56 h-14 mb-8 border border-gray-300 rounded-lg text-center text-2xl bg-[#f6faf6]"
                        style={{ fontWeight: 'bold', color: '#86B049', letterSpacing:2 }}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor="#86B049"
                    />

                    {/* Verify Button */}
                    <TouchableOpacity
                        className="bg-[#86B049] py-3 rounded-full mb-4 w-full"
                        disabled={code.length !== 6}
                    >
                        <Text className="text-white text-center font-semibold text-lg">Verify</Text>
                    </TouchableOpacity>

                    {/* Resend Timer */}
                    <Text className="text-gray-500 text-center mt-2">
                        Didn't receive the code?{' '}
                        {timer > 0 ? (
                            <>Resend in {timer} seconds</>
                        ) : (
                            <Text className="text-[#86B049] font-semibold" onPress={handleResend}>Resend</Text>
                        )}
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default EmailVerify