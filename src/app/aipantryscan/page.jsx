"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Leaf, Sparkles, Check, RefreshCw, X, AlertCircle } from "lucide-react";

export default function AiPantryScanPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initial mock detected items matching the design prompt image
  const [detectedItems, setDetectedItems] = useState([
    { id: 1, name: "Roma Tomatoes", confidence: "98%", status: "success" },
    { id: 2, name: "Red Onion", confidence: "92%", status: "success" },
    {
      id: 3,
      name: "Fresh Basil",
      confidence: "75%",
      subtext: "Review suggested",
      status: "warning",
    },
  ]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Attach stream to video element whenever stream state or isCameraActive changes
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current
        .play()
        .catch((e) => console.log("Auto-play error:", e));
    }
  }, [isCameraActive, stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setShowOptionsModal(false);
    setCameraError(null);
    try {
      // First stop any existing stream
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user", // Defaulting to 'user' for desktop webcam compatibility
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      // Fallback try with basic video constraint if constraints failed
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(fallbackStream);
        setIsCameraActive(true);
      } catch (fallbackErr) {
        console.error("Fallback camera access error:", fallbackErr);
        setCameraError(
          "Tidak dapat mengakses kamera. Pastikan kamera terhubung dan izin telah diberikan."
        );
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    setSelectedImage(imageUrl);
    stopCamera();
    simulateScanning();
  };

  const handleFileUpload = (e) => {
    setShowOptionsModal(false);
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      stopCamera();
      simulateScanning();
    }
  };

  const triggerFileInput = () => {
    setShowOptionsModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const simulateScanning = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  const resetImage = () => {
    setSelectedImage(null);
    stopCamera();
  };

  return (
    <div className="flex-1 bg-[#F5F8F5] p-8 md:p-12 overflow-y-auto font-sans">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/jpeg,image/png,image/heic,image/webp"
        className="hidden"
      />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header Title & Subtitle */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1B3022] tracking-tight">
            Vision Pantry Scan
          </h1>
          <p className="text-gray-500 text-base md:text-lg mt-2 max-w-2xl leading-relaxed">
            Upload a photo of your fridge or counter, and our AI will instantly
            catalog your ingredients to suggest zero-waste recipes.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Camera / Upload Box */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="w-full aspect-[4/3] bg-[#758474] rounded-3xl overflow-hidden shadow-inner flex flex-col items-center justify-center relative p-6 group transition-all">
              
              {/* State 1: Active Live Camera */}
              {isCameraActive ? (
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-black rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 flex items-center space-x-4 z-10">
                    <button
                      onClick={capturePhoto}
                      className="bg-white hover:bg-gray-100 text-[#1B3022] font-semibold px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-transform active:scale-95"
                    >
                      <Camera className="w-5 h-5 text-[#1B3022]" />
                      <span>Ambil Foto</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : selectedImage ? (
                /* State 2: Selected Image Preview */
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Pantry Scan"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white">
                      <Sparkles className="w-10 h-10 animate-spin text-emerald-400 mb-3" />
                      <span className="font-semibold text-lg">Menganalisis Bahan...</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      onClick={resetImage}
                      className="bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-md transition-colors"
                      title="Reset Photo"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* State 3: Default Empty State - Tap to Snap or Upload */
                <div
                  onClick={() => setShowOptionsModal(true)}
                  className="flex flex-col items-center justify-center text-center cursor-pointer w-full h-full py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-[#5D6D5C] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md">
                    <Camera className="w-8 h-8 text-[#A8BEA7]" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#2C4A35] tracking-tight mb-1">
                    Tap to Snap or Upload
                  </h3>
                  <p className="text-[#3E5544] font-medium text-sm mb-6">
                    JPG, PNG, HEIC up to 10MB
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptionsModal(true);
                    }}
                    className="text-sm font-semibold text-[#1B3022] hover:text-black transition-colors"
                  >
                    Browse Files
                  </button>
                </div>
              )}

              {/* Camera Error Banner */}
              {cameraError && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white text-xs p-3 rounded-xl flex items-center space-x-2 backdrop-blur-md z-20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detected Ingredients Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 flex flex-col min-h-[460px] justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-50">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-5 h-5 text-[#1B3022]" />
                    <h2 className="text-xl font-bold text-[#1B3022]">
                      Detected Ingredients
                    </h2>
                  </div>
                  <span className="bg-[#D2E7F7] text-[#1D5882] text-xs font-semibold px-3 py-1.5 rounded-full">
                    8 Items
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {detectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F8F9F8] rounded-2xl p-4 flex items-center space-x-4 border border-gray-100 hover:bg-[#F3F6F3] transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E5ECE5] flex items-center justify-center shrink-0">
                        <Leaf className="w-5 h-5 text-[#4D6551]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#1B3022] text-sm leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          Confidence: {item.confidence}
                          {item.subtext && (
                            <span className="text-[#8B5A2B] font-semibold ml-1">
                              • {item.subtext}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Submit Action */}
              <div className="mt-8 pt-4">
                <button className="w-full bg-[#1C482B] hover:bg-[#153821] text-white font-semibold py-3.5 px-5 rounded-2xl shadow-md flex items-center justify-center space-x-2.5 transition-all active:scale-[0.98]">
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Add 8 Items to Pantry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup for Choice (Camera vs Upload) */}
      {showOptionsModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1B3022]">Pilih Sumber Foto</h3>
              <button
                onClick={() => setShowOptionsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Pilih apakah Anda ingin mengambil foto langsung dengan kamera atau mengunggah file gambar dari galeri.
            </p>

            <div className="space-y-3">
              <button
                onClick={startCamera}
                className="w-full bg-[#1C482B] hover:bg-[#153821] text-white font-semibold py-3 px-4 rounded-2xl flex items-center justify-center space-x-3 transition-colors shadow-sm"
              >
                <Camera className="w-5 h-5" />
                <span>Gunakan Kamera Langsung</span>
              </button>

              <button
                onClick={triggerFileInput}
                className="w-full bg-gray-100 hover:bg-gray-200 text-[#1B3022] font-semibold py-3 px-4 rounded-2xl flex items-center justify-center space-x-3 transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Unggah dari Galeri / File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
