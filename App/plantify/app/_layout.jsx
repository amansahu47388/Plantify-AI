import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import "../global.css"

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack options={{headerShown:true}}>
        <Stack.Screen name="index"/> 
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        {/* <Stack.Screen name="reset-password" /> */}
      </Stack>
    </AuthProvider>
  );
}
