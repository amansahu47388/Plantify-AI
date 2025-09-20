import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, ScrollView, Image, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/contexts/AuthContext";
import { useEffect } from "react";

const logo = require("../assets/images/plantify-black.png");
const logo_landing = require("../assets/images/logo_landing.png");

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect authenticated users to home
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f3e8' }}>
        <Text style={{ color: '#86B049', fontSize: 18 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Don't render landing page if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#e8f3e8]">
     
      <ScrollView contentContainerStyle={{height: '100%'
      }}>

       <View style={{ flex: 1, }} >
        <Image
    source={logo_landing}
    style={{ width: 350, height: 350, marginRight:10, marginTop:70 }}
    resizeMode="contain"
      />
</View>
          
      <View className="mt-2  flex justify-center items-center">
            <Image 
            source={logo}
            style={{ width: "30%", height: 300,marginTop: 20 ,marginLeft:5}}
            resizeMode="contain"
           
          /> 

              <View  className="w-3/4 mb-10 " >
              <TouchableOpacity  onPress={()=>router.push('/signup')} style={{backgroundColor:"#87b641ff"}}className="p-2 my-2  text-black rounded-full  ">
               <Text  className="text-xl font-semibold text-center text-white" >
                    SignUp
               </Text>
              </TouchableOpacity>
                <View>
                  <Text className="text-center text-base font-semibold my-4 text-black">
                    <View className="border-b-2 border-[#9AAE7B] p-2 mb-1 w-24"/> or{""} <View/>
                     <View className="border-b-2 border-[#9AAE7B] p-2 mb-1 w-24"/> 
                  </Text>
                 <View className="flex-row justify-center ">
                   <Text className="text-black font-semibold">
                      Already have an account? 
                    </Text>
                  <TouchableOpacity  className="flex flex-row ml-1 justify-center items-center space-x-2">
                    <Text className="text-base font-semibold  underline text-[#86B049]" onPress={()=>router.push('/login')}> 
                      Login
                    </Text>
                  </TouchableOpacity>
                 </View>
                </View>
                
              </View>
           </View>    
           
         <StatusBar barStyle="loght-content" backgroundColor={"#86B049"} />
      </ScrollView>
    </SafeAreaView>
  );
}