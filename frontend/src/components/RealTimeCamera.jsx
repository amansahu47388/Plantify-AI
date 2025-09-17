import React, { useRef, useEffect, useState } from "react";
import axios from "../utils/axios";

const RealTimeCamera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [prediction, setPrediction] = useState("");

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            });
    }, []);

    const captureAndPredict = async () => {
        const context = canvasRef.current.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, 224, 224); // adjust size as needed
        const image = canvasRef.current.toDataURL("image/jpeg");
        const res = await axios.post("/api/crop-disease/predict/", { image });
        setPrediction(res.data.prediction);
    };

    useEffect(() => {
        const interval = setInterval(captureAndPredict, 1000); // every second
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <video ref={videoRef} autoPlay width="224" height="224" />
            <canvas ref={canvasRef} width="224" height="224" style={{ display: "none" }} />
            <div>Prediction: {prediction}</div>
        </div>
    );
};

export default RealTimeCamera;