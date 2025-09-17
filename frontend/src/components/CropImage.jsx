import React, { useRef, useState } from "react";
import { FiUpload, FiCamera } from "react-icons/fi";

const CROP_SIZE = 224;

const CropImage = ({ saveCroppedImage }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [cropData, setCropData] = useState(null);

  // Camera integration states
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setError(null);

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setCropData(null); // Reset crop preview when new image is uploaded
      };
      reader.onerror = () => {
        setError('Error reading the image file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Crop the center 224x224 area of the image
  const handleCrop = () => {
    if (!image) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = CROP_SIZE;
      canvas.height = CROP_SIZE;
      const ctx = canvas.getContext("2d");

      // Calculate cropping area (center crop)
      const minDim = Math.min(img.width, img.height);
      const sx = (img.width - minDim) / 2;
      const sy = (img.height - minDim) / 2;
      ctx.drawImage(
        img,
        sx, sy, minDim, minDim, // source crop
        0, 0, CROP_SIZE, CROP_SIZE // destination
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          setCropData(previewUrl);
          saveCroppedImage && saveCroppedImage(blob);
        }
      }, "image/jpeg", 0.95);
    };
    img.src = image;
  };

  // Camera integration handlers
  const openCamera = async () => {
    setError(null);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied.");
      setShowCamera(false);
    }
  };

  const captureFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, CROP_SIZE, CROP_SIZE);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      setImage(dataUrl);
      setCropData(null); // Reset crop preview when new image is captured
      // Stop camera stream
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
    }
  };

  const closeCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <label className="w-full max-w-xs px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 text-center flex items-center justify-center gap-2">
          <FiUpload size={20} />
          Choose Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        <button
          type="button"
          onClick={openCamera}
          className="w-full max-w-xs px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 text-center flex items-center justify-center gap-2"
        >
          <FiCamera size={20} />
          Camera
        </button>
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </div>

      {/* Camera UI */}
      {showCamera && (
        <div className="flex flex-col items-center space-y-2">
          <video ref={videoRef} autoPlay width={CROP_SIZE} height={CROP_SIZE} className="border rounded-lg" />
          <canvas ref={canvasRef} width={CROP_SIZE} height={CROP_SIZE} style={{ display: "none" }} />
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={captureFromCamera}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={closeCamera}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Show uploaded image in original size and crop button */}
      {image && !cropData && (
        <div className="space-y-4 flex flex-col items-center">
          <div>
            <img
              src={image}
              alt="Uploaded"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "0.5rem", border: "2px solid #d1d5db" }}
            />
          </div>
          <button
            onClick={handleCrop}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Crop Image
          </button>
        </div>
      )}

      {/* Show cropped image preview */}
      {cropData && (
        <div className="mt-4">
          <div className="text-center text-sm text-gray-600 mb-2">
            Preview ({CROP_SIZE}x{CROP_SIZE})
          </div>
          <img
            src={cropData}
            alt="Cropped preview"
            className="mx-auto w-56 h-56 object-cover border-2 border-green-600 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default CropImage;
