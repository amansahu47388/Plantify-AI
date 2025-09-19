import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Linking, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState('back');
  const [photo, setPhoto] = useState(null);
  const [flashMode, setFlashMode] = useState('off');
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Hide tab bar when camera is focused
  useFocusEffect(
    React.useCallback(() => {
      // This will hide the tab bar when this screen is focused
      return () => {
        // This will show the tab bar when this screen is unfocused
      };
    }, [])
  );

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        setPhoto(photoData.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const switchCamera = () => {
    setCameraType((current) =>
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlash = () => {
    setFlashMode((current) =>
      current === 'off' ? 'on' : 'off'
    );
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery");
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>No access to camera. Please enable camera permissions.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <TouchableOpacity
            style={styles.button}
            onPress={() => setPhoto(null)}
          >
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
        </View>
       ) : (
         <CameraView 
           style={styles.camera} 
           facing={cameraType} 
           ref={cameraRef}
           flash={flashMode}
         >
           {/* Top Controls */}
           <View style={styles.topControls}>
             <TouchableOpacity style={styles.topButton} onPress={switchCamera}>
               <Ionicons name="camera-reverse-outline" size={28} color="#fff" />
             </TouchableOpacity>
           </View>

           {/* Bottom Controls */}
           <View style={styles.bottomControls}>
             {/* Gallery Button - Bottom Left */}
             <TouchableOpacity style={styles.controlButton} onPress={pickImageFromGallery}>
               <Ionicons name="images-outline" size={28} color="#fff" />
             </TouchableOpacity>

             {/* Capture Button - Center */}
             <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
               <View style={styles.captureButtonInner} />
             </TouchableOpacity>

             {/* Flash Button - Bottom Right */}
             <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
               <Ionicons 
                 name={flashMode === 'off' ? "flash-off-outline" : "flash-outline"} 
                 size={28} 
                 color={flashMode === 'off' ? "#fff" : "#ffd700"} 
               />
             </TouchableOpacity>
           </View>
         </CameraView>
       )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  topControls: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  topButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  controlButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  preview: {
    width: "100%",
    height: "80%",
    borderRadius: 10,
  },
});
