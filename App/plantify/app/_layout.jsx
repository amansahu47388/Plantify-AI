import { Stack } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import "../global.css"

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack options={{headerShown:true}}>
        <Stack.Screen name="index" options={{headerShown:false}}/> 
        <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
      </Stack>
    </AuthProvider>
  );
}
