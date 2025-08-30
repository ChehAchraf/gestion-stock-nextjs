"use client";
import { useState, useEffect } from "react";
import { Edit, X, Upload, Camera } from "lucide-react";
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
import { Article, ArticleUpdateInput } from "@/lib/types/database";

interface EditProductModalProps {
  product: Article;
  onSubmit: (id: string, data: ArticleUpdateInput) => void;
  trigger?: React.ReactNode;
}

export default function EditProductModal({ product, onSubmit, trigger }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ArticleUpdateInput>({
    titre: "",
    description: "",
    photo: "",
    prix_achat: 0,
    quantite: 0,
    reference: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  // تحديث البيانات عند فتح Modal
  useEffect(() => {
    if (product && open) {
      setFormData({
        titre: product.titre,
        description: product.description,
        photo: product.photo || "",
        prix_achat: product.prix_achat,
        quantite: product.quantite,
        reference: product.reference,
      });
      setImagePreview(product.photo || "");
    }
  }, [product, open]);

  const handleInputChange = (field: keyof ArticleUpdateInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 1024 * 1024; // 1 ميجابايت
      
      if (file.size > maxSize) {
        alert("حجم الصورة يجب أن يكون أقل من 1 ميجابايت. الرجاء اختيار صورة أصغر.");
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, photo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.titre.trim()) {
      alert("الرجاء إدخال عنوان المنتج");
      return;
    }
    
    if (!formData.reference.trim()) {
      alert("الرجاء إدخال مرجع المنتج");
      return;
    }
    
    if (formData.prix_achat <= 0) {
      alert("سعر الشراء يجب أن يكون أكبر من صفر");
      return;
    }
    
    if (formData.quantite < 0) {
      alert("الكمية يجب أن تكون صفر أو أكثر");
      return;
    }

    onSubmit(product.id, formData);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      titre: "",
      description: "",
      photo: "",
      prix_achat: 0,
      quantite: 0,
      reference: "",
    });
    setImagePreview("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
            <Edit className="w-4 h-4 ml-1" />
            تعديل
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 font-cairo">
            تعديل المنتج
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
              value={formData.titre}
              onChange={(e) => handleInputChange("titre", e.target.value)}
              placeholder="أدخل عنوان المنتج"
              className="font-cairo"
            />
          </div>

          {/* الوصف */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 font-cairo">
              الوصف
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
                value={formData.quantite}
                onChange={(e) => handleInputChange("quantite", parseInt(e.target.value) || 0)}
                placeholder="0"
                className="font-cairo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchasePrice" className="text-sm font-medium text-gray-700 font-cairo">
                سعر الشراء (درهم) *
              </Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.prix_achat}
                onChange={(e) => handleInputChange("prix_achat", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="font-cairo"
              />
            </div>
          </div>

          {/* المرجع */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-sm font-medium text-gray-700 font-cairo">
              المرجع *
            </Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              placeholder="أدخل مرجع المنتج"
              className="font-cairo"
            />
          </div>

          {/* الصورة */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 font-cairo">
              صورة المنتج
            </Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 font-cairo"
                >
                  <Upload className="w-4 h-4" />
                  اختيار صورة
                </label>
              </div>
              
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => {
                      setImagePreview("");
                      setFormData(prev => ({ ...prev, photo: "" }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 font-cairo">
              الحد الأقصى: 1 ميجابايت. الصيغ المدعومة: JPG, PNG, GIF
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="font-cairo">
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-cairo"
          >
            حفظ التعديلات
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
