"use client";
import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, X, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  initialValue?: string;
}

export default function BarcodeScanner({ onScan, onClose, initialValue = "" }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState(initialValue);
  const [manualCode, setManualCode] = useState(initialValue);
  const [error, setError] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  // الحصول على قائمة الكاميرات المتاحة
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
        if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
      } catch (err) {
        console.error('خطأ في الحصول على الكاميرات:', err);
        setError('لا يمكن الوصول إلى الكاميرات');
      }
    };

    getCameras();
  }, []);

  // بدء المسح
  const startScanning = async () => {
    if (!selectedCamera) {
      setError('يرجى اختيار كاميرا');
      return;
    }

    try {
      setIsScanning(true);
      setError("");
      
      // إنشاء قارئ الباركود
      codeReaderRef.current = new BrowserMultiFormatReader();
      
      // بدء قراءة الباركود
      const startReading = async () => {
        if (!codeReaderRef.current || !videoRef.current) return;

        try {
          // استخدام decodeFromConstraints بدلاً من decodeFromVideoElement
          await codeReaderRef.current.decodeFromConstraints(
            {
              video: {
                deviceId: selectedCamera,
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            },
            videoRef.current,
            (result, error) => {
              if (result) {
                const code = result.getText();
                setScannedCode(code);
                onScan(code);
                stopScanning();
              }
              if (error && error.name !== 'NotFoundException') {
                console.log('خطأ في قراءة الباركود:', error);
              }
            }
          );
        } catch (err) {
          console.error('خطأ في بدء قراءة الباركود:', err);
          setError('خطأ في قراءة الباركود');
        }
      };

      startReading();
    } catch (err) {
      console.error('خطأ في بدء المسح:', err);
      setError('لا يمكن الوصول إلى الكاميرا');
      setIsScanning(false);
    }
  };

  // إيقاف المسح
  const stopScanning = () => {
    setIsScanning(false);
    
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // تنظيف عند إغلاق المكون
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  // معالجة الإدخال اليدوي
  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-cairo">قارئ الباركود</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Selection */}
        {availableCameras.length > 1 && (
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 font-cairo mb-2 block">
              اختيار الكاميرا
            </Label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-cairo"
              disabled={isScanning}
            >
              {availableCameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `كاميرا ${camera.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-cairo text-sm">{error}</p>
          </div>
        )}

        {/* Scanner Mode */}
        {!isManualMode ? (
          <div className="space-y-4">
            {/* Video Container */}
            <div className="relative bg-gray-100 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                playsInline
                muted
              />
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Frame */}
                    <div className="w-48 h-32 border-2 border-blue-500 rounded-lg relative">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl-lg"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr-lg"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl-lg"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br-lg"></div>
                    
                      {/* Scanning Line */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 animate-pulse"></div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="mt-4 text-center">
                      <p className="text-white font-cairo text-sm bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                        ضع الباركود داخل الإطار
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3">
              {!isScanning ? (
                <Button
                  onClick={startScanning}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 font-cairo"
                  disabled={!selectedCamera}
                >
                  <Camera className="w-4 h-4" />
                  بدء المسح
                </Button>
              ) : (
                <Button
                  onClick={stopScanning}
                  variant="outline"
                  className="flex items-center gap-2 font-cairo"
                >
                  <X className="w-4 h-4" />
                  إيقاف المسح
                </Button>
              )}
              
              <Button
                onClick={() => setIsManualMode(true)}
                variant="outline"
                className="font-cairo"
              >
                إدخال يدوي
              </Button>
            </div>

            {/* Scanned Result */}
            {scannedCode && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <Label className="text-sm font-medium text-green-800 font-cairo mb-2 block">
                  تم قراءة الباركود بنجاح:
                </Label>
                <Input
                  value={scannedCode}
                  readOnly
                  className="font-cairo bg-white"
                />
              </div>
            )}
          </div>
        ) : (
          /* Manual Input Mode */
          <div className="space-y-4">
            <div className="text-center">
              <Label className="text-sm font-medium text-gray-700 font-cairo mb-2 block">
                إدخال المرجع يدوياً
              </Label>
              <Input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="أدخل مرجع المنتج"
                className="font-cairo"
                autoFocus
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={handleManualSubmit}
                className="bg-blue-600 hover:bg-blue-700 font-cairo"
                disabled={!manualCode.trim()}
              >
                تأكيد
              </Button>
              
              <Button
                onClick={() => setIsManualMode(false)}
                variant="outline"
                className="font-cairo"
              >
                العودة للمسح
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 font-cairo mb-2">نصائح للمسح:</h3>
          <ul className="text-sm text-gray-600 font-cairo space-y-1">
            <li>• تأكد من أن الباركود واضح ومضاء بشكل جيد</li>
            <li>• ضع الباركود داخل الإطار الأزرق</li>
            <li>• تجنب الظلال والانعكاسات</li>
            <li>• إذا لم يعمل المسح، استخدم الإدخال اليدوي</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
