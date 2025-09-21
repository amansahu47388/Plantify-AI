import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// API Configuration - Will be set dynamically
import { getAPIBaseURL } from '../../src/config/api';

const { width, height } = Dimensions.get('window');

export default function DiseasePredictionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [showCropper, setShowCropper] = useState(false);

  // remove: croppedImage, showCropper
  const [resizedImage, setResizedImage] = useState(null);

    // Direct resize without showing cropper
    const resizeImage = () => {
        if (selectedImage) {
            // Directly set the resized image (backend will handle actual resizing)
            setResizedImage(selectedImage);
            setPredictionResult(null);
        }
    };

  



  useEffect(() => {
    // Load user email from storage
    loadUserEmail();
    // Load prediction history
    loadPredictionHistory();
    
    // If image is passed from camera, set it
    if (params.imageUri) {
      setSelectedImage(params.imageUri);
      setResizedImage(null);
      setPredictionResult(null);
    }
  }, [params.imageUri]);

  const loadUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email || '');
    } catch (error) {
      console.error('Error loading user email:', error);
    }
  };

  const loadPredictionHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('predictionHistory');
      if (history) {
        setPredictionHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading prediction history:', error);
    }
  };

  const savePredictionHistory = async (newPrediction) => {
    try {
      const updatedHistory = [newPrediction, ...predictionHistory];
      setPredictionHistory(updatedHistory);
      await AsyncStorage.setItem('predictionHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving prediction history:', error);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setCroppedImage(null);
        setResizedImage(null);
        setPredictionResult(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setCroppedImage(null);
        setResizedImage(null);
        setPredictionResult(null);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const cropImage = () => {
    if (selectedImage) {
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImageUri) => {
    setCroppedImage(croppedImageUri);
    setShowCropper(false);
    setPredictionResult(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
  };

  const predictDisease = async () => {
    if (!resizedImage) {
      Alert.alert('Error', 'Please select and resize an image first');
      return;
    }

    setLoading(true);
    try {
      // Create FormData for the API call
      const formData = new FormData();
      formData.append('image', {
        uri: resizedImage,
        type: 'image/jpeg',
        name: 'disease_image.jpg',
      });

      const response = await fetch(`${getAPIBaseURL().replace('/account', '')}/crop-disease/predict/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPredictionResult(result);

      // Save to prediction history
      const newPrediction = {
        id: Date.now(),
        email: userEmail,
        time: new Date().toLocaleString(),
        disease: result.disease_name,
        confidence: result.confidence,
        image_url: resizedImage,
      };
      await savePredictionHistory(newPrediction);

    } catch (error) {
      console.error('Error predicting disease:', error);
      Alert.alert('Error', 'Failed to predict disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPrediction = () => {
    setSelectedImage(null);
    setCroppedImage(null);
    setResizedImage(null);
    setPredictionResult(null);
  };

  // Show image cropper if needed
  if (showCropper && selectedImage) {
    return (
      <ImageCropper
        imageUri={selectedImage}
        onCrop={handleCropComplete}
        onCancel={handleCropCancel}
      />
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#86B049" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plant Disease Detection</Text>
        </View>

        {/* Image Selection Buttons */}
        {!selectedImage && (
          <View style={styles.imageSelectionContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImageFromGallery}>
              <Ionicons name="images-outline" size={32} color="white" />
              <Text style={styles.buttonText}>Choose Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imageButton} onPress={takePicture}>
              <Ionicons name="camera-outline" size={32} color="white" />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Selected Image Display */}
        {selectedImage && !resizedImage && (
        <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <TouchableOpacity style={styles.cropButton} onPress={resizeImage}>
            <Text style={styles.cropButtonText}>Resize Image</Text>
            </TouchableOpacity>
        </View>
        )}

        {/* Resized Image Preview */}
        {resizedImage && (
        <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Resize Image (224x224)</Text>
            <Image source={{ uri: resizedImage }} style={styles.croppedImage} />
            
            <TouchableOpacity
            style={styles.predictButton}
            onPress={predictDisease}
            disabled={loading}
            >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.predictButtonText}>Predict Disease</Text>
            )}
            </TouchableOpacity>
        </View>
        )}

        {/* Prediction Result */}
        {predictionResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Prediction Result</Text>
            <View style={styles.resultCard}>
              <Text style={styles.diseaseText}>
                Disease: <Text style={styles.diseaseValue}>{predictionResult.disease_name}</Text>
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: <Text style={styles.confidenceValue}>{predictionResult.confidence}%</Text>
              </Text>
            </View>
          </View>
        )}

        {/* Prediction History */}
        {predictionHistory.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Previous Predictions</Text>
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyHeaderText}>Serial No</Text>
                {/* <Text style={styles.historyHeaderText}>Email</Text> */}
                <Text style={styles.historyHeaderText}>Time of Input</Text>
                <Text style={styles.historyHeaderText}>Diseases</Text>
                <Text style={styles.historyHeaderText}>Images</Text>
              </View>
              {predictionHistory.slice(0, 5).map((item, index) => (
                <View key={item.id} style={styles.historyRow}>
                  <Text style={styles.historyCell}>{index + 1}</Text>
                  {/* <Text style={styles.historyCell}>{item.email}</Text> */}
                  <Text style={styles.historyCell}>{item.time}</Text>
                  <Text style={styles.historyCell}>{item.disease}</Text>
                  <Image source={{ uri: item.image_url }} style={styles.historyImage} />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Reset Button */}
        {selectedImage && (
          <TouchableOpacity style={styles.resetButton} onPress={resetPrediction}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#86B049',
  },
  imageSelectionContainer: {
    padding: 20,
    gap: 15,
  },
  imageButton: {
    backgroundColor: '#86B049',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  selectedImage: {
    width: width - 40,
    height: width - 40,
    borderRadius: 12,
    marginBottom: 15,
  },
  cropButton: {
    backgroundColor: '#86B049',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cropButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    padding: 20,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
  },
  croppedImage: {
    width: 224,
    height: 224,
    borderRadius: 12,
    marginBottom: 20,
  },
  predictButton: {
    backgroundColor: '#86B049',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
  },
  predictButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    padding: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diseaseText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 10,
  },
  diseaseValue: {
    fontWeight: 'bold',
    color: '#86B049',
  },
  confidenceText: {
    fontSize: 16,
    color: '#374151',
  },
  confidenceValue: {
    fontWeight: 'bold',
    color: '#86B049',
  },
  historyContainer: {
    padding: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  historyHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  historyRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  historyCell: {
    flex: 1,
    fontSize: 11,
    color: '#6b7280',
    textAlign: 'center',
  },
  historyImage: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
