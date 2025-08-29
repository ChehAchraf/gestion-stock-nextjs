"use client";
import { useState, useRef } from "react";
import { Upload, X, Package, Camera } from "lucide-react";
import { BrowserMultiFormatReader } from "@zxing/library";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import BarcodeScanner from "./BarcodeScanner";

interface ProductData {
  title: string;
  description: string;
  quantity: number;
  purchasePrice: number;
  image: string;
  reference: string;
}

interface AddProductModalProps {
  onSubmit: (data: ProductData) => void;
  trigger?: React.ReactNode;
}

export default function AddProductModal({ onSubmit, trigger }: AddProductModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProductData>({
    title: "",
    description: "",
    quantity: 0,
    purchasePrice: 0,
    image: "",
    reference: "",
  });
  const [referenceMethod, setReferenceMethod] = useState<"manual" | "barcode">("manual");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [barcodeImage, setBarcodeImage] = useState<string>("");
  const [showScanner, setShowScanner] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ProductData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من حجم الملف (1 ميجابايت = 1024 * 1024 بايت)
      const maxSize = 1024 * 1024; // 1 ميجابايت
      
      if (file.size > maxSize) {
        alert("حجم الصورة يجب أن يكون أقل من 1 ميجابايت. الرجاء اختيار صورة أصغر.");
        event.target.value = ''; // مسح الملف المحدد
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarcodeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من حجم الملف (1 ميجابايت = 1024 * 1024 بايت)
      const maxSize = 1024 * 1024; // 1 ميجابايت
      
      if (file.size > maxSize) {
        alert("حجم الصورة يجب أن يكون أقل من 1 ميجابايت. الرجاء اختيار صورة أصغر.");
        event.target.value = ''; // مسح الملف المحدد
        return;
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setBarcodeImage(result);
        
        try {
          // إنشاء عنصر img مؤقت لقراءة الباركود
          const img = new Image();
          img.src = result;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          // إنشاء canvas لرسم الصورة مع تحسين الدقة
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // تحسين حجم الصورة للقراءة
          const maxSize = 1024;
          let { width, height } = img;
          
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          if (ctx) {
            // تحسين جودة الرسم
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, width, height);
            
            // محاولة قراءة الباركود بعدة طرق
            const codeReader = new BrowserMultiFormatReader();
            const imageData = ctx.getImageData(0, 0, width, height);
            
            let decodedText = null;
            
            // المحاولة الأولى: قراءة مباشرة
                                      try {
               // إنشاء عنصر img من canvas
               const img = new Image();
               img.src = canvas.toDataURL();
               
               await new Promise((resolve, reject) => {
                 img.onload = resolve;
                 img.onerror = reject;
               });
               
               const result = await codeReader.decodeFromImage(img);
               if (result) {
                 decodedText = result.getText();
                 console.log('تم القراءة في المحاولة الأولى:', decodedText);
               }
             } catch (error) {
               console.log('المحاولة الأولى فشلت، جاري المحاولة الثانية...');
               
               // المحاولة الثانية: تحسين التباين
               try {
                 const enhancedCanvas = document.createElement('canvas');
                 const enhancedCtx = enhancedCanvas.getContext('2d');
                 enhancedCanvas.width = width;
                 enhancedCanvas.height = height;
                 
                 if (enhancedCtx) {
                   enhancedCtx.drawImage(canvas, 0, 0);
                   
                   // تطبيق فلتر تحسين التباين
                   const enhancedImageData = enhancedCtx.getImageData(0, 0, width, height);
                   const data = enhancedImageData.data;
                   
                   // تحسين التباين
                   for (let i = 0; i < data.length; i += 4) {
                     const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                     const threshold = 128;
                     const value = avg > threshold ? 255 : 0;
                     data[i] = data[i + 1] = data[i + 2] = value;
                   }
                   
                   enhancedCtx.putImageData(enhancedImageData, 0, 0);
                   
                   const enhancedImg = new Image();
                   enhancedImg.src = enhancedCanvas.toDataURL();
                   
                   await new Promise((resolve, reject) => {
                     enhancedImg.onload = resolve;
                     enhancedImg.onerror = reject;
                   });
                   
                   const enhancedResult = await codeReader.decodeFromImage(enhancedImg);
                   if (enhancedResult) {
                     decodedText = enhancedResult.getText();
                     console.log('تم القراءة في المحاولة الثانية:', decodedText);
                   }
                 }
               } catch (enhancedError) {
                 console.log('المحاولة الثانية فشلت، جاري المحاولة الثالثة...');
                 
                 // المحاولة الثالثة: تدوير الصورة
                 try {
                   const rotatedCanvas = document.createElement('canvas');
                   const rotatedCtx = rotatedCanvas.getContext('2d');
                   rotatedCanvas.width = height;
                   rotatedCanvas.height = width;
                   
                   if (rotatedCtx) {
                     rotatedCtx.translate(height / 2, width / 2);
                     rotatedCtx.rotate(Math.PI / 2);
                     rotatedCtx.drawImage(canvas, -width / 2, -height / 2);
                     
                     const rotatedImg = new Image();
                     rotatedImg.src = rotatedCanvas.toDataURL();
                     
                     await new Promise((resolve, reject) => {
                       rotatedImg.onload = resolve;
                       rotatedImg.onerror = reject;
                     });
                     
                     const rotatedResult = await codeReader.decodeFromImage(rotatedImg);
                     if (rotatedResult) {
                       decodedText = rotatedResult.getText();
                       console.log('تم القراءة في المحاولة الثالثة:', decodedText);
                     }
                   }
                 } catch (rotatedError) {
                   console.log('المحاولة الثالثة فشلت أيضاً');
                 }
               }
             }
            
                         if (decodedText) {
               setFormData(prev => ({ ...prev, reference: decodedText }));
               console.log('تم قراءة الباركود بنجاح:', decodedText);
             } else {
               // استخدام اسم الملف كبديل
               const extractedCode = file.name.replace(/\.[^/.]+$/, "");
               setFormData(prev => ({ ...prev, reference: extractedCode }));
               
               // رسالة أكثر تفصيلاً مع نصائح محسنة
               const tips = [
                 'تأكد من أن الباركود واضح وغير مشوه',
                 'تأكد من أن الصورة مضاءة بشكل جيد',
                 'تأكد من أن الباركود يملأ جزءاً كبيراً من الصورة',
                 'جرب التقاط صورة من زاوية مختلفة',
                 'تأكد من أن الباركود ليس مقلوباً',
                 'تأكد من عدم وجود انعكاسات على الباركود',
                 'جرب التقريب من الباركود أكثر'
               ];
               
               const tipsText = tips.map(tip => `• ${tip}`).join('\n');
               
               alert(`لم نتمكن من قراءة الباركود من هذه الصورة.

نصائح لتحسين القراءة:
${tipsText}

سيتم استخدام اسم الملف كمرجع بديل: ${extractedCode}

يمكنك تعديل المرجع يدوياً إذا كنت تعرف القيمة الصحيحة.`);
             }
          }
        } catch (error) {
          console.error('خطأ في معالجة الصورة:', error);
          // استخدام اسم الملف كبديل
          const extractedCode = file.name.replace(/\.[^/.]+$/, "");
          setFormData(prev => ({ ...prev, reference: extractedCode }));
          alert('حدث خطأ في معالجة الصورة. سيتم استخدام اسم الملف كمرجع بديل.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || formData.quantity <= 0 || formData.purchasePrice <= 0) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      quantity: 0,
      purchasePrice: 0,
      image: "",
      reference: "",
    });
    setImagePreview("");
    setBarcodeImage("");
    setReferenceMethod("manual");
    setShowScanner(false);
  };

  const handleBarcodeScan = (code: string) => {
    setFormData(prev => ({ ...prev, reference: code }));
    setShowScanner(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Package className="w-4 h-4" />
            إضافة منتج جديد
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 font-cairo">
            إضافة منتج جديد
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* العنوان */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 font-cairo">
              العنوان *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="أدخل عنوان المنتج"
              className="font-cairo"
            />
          </div>

          {/* الوصف */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 font-cairo">
              الوصف *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="أدخل وصف المنتج"
              className="font-cairo"
              rows={3}
            />
          </div>

          {/* الكمية والسعر */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-700 font-cairo">
                الكمية *
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
                placeholder="0"
                className="font-cairo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 font-cairo">
                سعر الشراء *
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange("purchasePrice", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="font-cairo"
              />
            </div>
          </div>

          {/* صورة المنتج */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 font-cairo">
              صورة المنتج
            </Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 font-cairo"
              >
                <Upload className="w-4 h-4" />
                رفع صورة
              </Button>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setFormData(prev => ({ ...prev, image: "" }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* المرجع */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700 font-cairo">
              طريقة إدخال المرجع
            </Label>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="radio"
                  name="referenceMethod"
                  value="manual"
                  checked={referenceMethod === "manual"}
                  onChange={(e) => setReferenceMethod(e.target.value as "manual" | "barcode")}
                  className="text-blue-600"
                />
                <span className="font-cairo text-sm">إدخال يدوي</span>
              </label>
              
              <label className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="radio"
                  name="referenceMethod"
                  value="barcode"
                  checked={referenceMethod === "barcode"}
                  onChange={(e) => setReferenceMethod(e.target.value as "manual" | "barcode")}
                  className="text-blue-600"
                />
                <span className="font-cairo text-sm">رفع باركود</span>
              </label>
            </div>

            {referenceMethod === "manual" ? (
              <div className="space-y-2">
                <Label htmlFor="reference" className="text-sm font-medium text-gray-700 font-cairo">
                  المرجع
                </Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleInputChange("reference", e.target.value)}
                  placeholder="أدخل مرجع المنتج"
                  className="font-cairo"
                />
              </div>
                         ) : (
               <div className="space-y-2">
                 <Label className="text-sm font-medium text-gray-700 font-cairo">
                   رفع صورة الباركود أو استخدام الكاميرا
                 </Label>
                 <div className="flex items-center gap-4">
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => barcodeInputRef.current?.click()}
                     className="flex items-center gap-2 font-cairo"
                   >
                     <Upload className="w-4 h-4" />
                     رفع باركود
                   </Button>
                   <Button
                     type="button"
                     variant="outline"
                     onClick={() => barcodeInputRef.current?.click()}
                     className="flex items-center gap-2 font-cairo"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                     </svg>
                     استخدام الكاميرا
                   </Button>
                   {barcodeImage && (
                     <div className="relative">
                       <img
                         src={barcodeImage}
                         alt="Barcode"
                         className="w-16 h-16 rounded-lg object-cover border"
                       />
                       <button
                         onClick={() => {
                           setBarcodeImage("");
                           setFormData(prev => ({ ...prev, reference: "" }));
                         }}
                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                       >
                         <X className="w-3 h-3" />
                       </button>
                     </div>
                   )}
                 </div>
                                 {formData.reference && (
                   <div className="text-sm text-green-600 font-cairo">
                     تم قراءة الباركود بنجاح: {formData.reference}
                   </div>
                 )}
                <input
                  ref={barcodeInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBarcodeUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="font-cairo"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 font-cairo"
          >
            إضافة المنتج
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScan}
          onClose={() => setShowScanner(false)}
          initialValue={formData.reference}
        />
      )}
    </Dialog>
  );
}
