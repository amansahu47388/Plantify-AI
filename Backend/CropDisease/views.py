import os
import io
import json
import base64
import numpy as np 
from PIL import Image, ImageFilter  # <-- Import ImageFilter here
import tensorflow as tf
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from tensorflow.keras.applications.resnet50 import preprocess_input # type: ignore
import traceback


# Define working directory and paths
working_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(working_dir, 'trained_model', 'resnet50_trained.h5')
class_indices_path = os.path.join(working_dir, 'class_indices.json')

# Load the pre-trained model
model = tf.keras.models.load_model(model_path)

# Load the class indices from JSON file
with open(class_indices_path, 'r') as f:
    class_indices = json.load(f)

def reduce_image_noise(image):
    """
    Reduces noise in the input PIL image using a median filter.
    """
    return image.filter(ImageFilter.MedianFilter(size=3))  # <-- Use ImageFilter here

def load_and_preprocess_image(image_path, target_size=(224, 224)):
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        # Reduce noise before resizing and preprocessing
        img = reduce_image_noise(img)
        img = img.resize(target_size)
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        return img_array
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

def predict_image_class(model, image_path, class_indices):
    try:
        preprocessed_img = load_and_preprocess_image(image_path)
        predictions = model.predict(preprocessed_img)
        predicted_class_index = int(np.argmax(predictions[0]))
        predicted_class_name = class_indices[str(predicted_class_index)]
        confidence = float(predictions[0][predicted_class_index])

      
        result = {
            'disease_name': predicted_class_name,
            'confidence': round(confidence * 100, 2),
            'class_label': predicted_class_index,
        }
        return result
    except Exception as e:
        raise ValueError(f"Error during prediction: {str(e)}")
    

@csrf_exempt
def predict_disease(request):
    if request.method == 'POST':
        try:
            image = request.FILES.get('image')
            if not image:
                return JsonResponse({'error': 'No image provided'}, status=400)

            # Save the image temporarily
            temp_image_path = os.path.join(working_dir, 'temp_image.jpg')
            with open(temp_image_path, 'wb') as f:
                for chunk in image.chunks():
                    f.write(chunk)

            # Ensure the image was saved and is accessible
            if not os.path.exists(temp_image_path):
                return JsonResponse({'error': 'Failed to save image'}, status=500)

            # Predict the disease
            prediction_result = predict_image_class(model, temp_image_path, class_indices)
            
            # Clean up
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)
            
            return JsonResponse(prediction_result)
        except Exception as e:
            error_message = f"{str(e)}\n{traceback.format_exc()}"
            return JsonResponse({'error': error_message}, status=500)
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

