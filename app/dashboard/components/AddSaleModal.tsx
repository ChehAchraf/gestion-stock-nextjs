"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, X, Search } from "lucide-react";
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
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useArticlesManager } from "@/lib/hooks/useArticlesSQLite";
import { VenteInput } from "@/lib/types/database";

interface AddSaleModalProps {
  onSubmit: (data: VenteInput) => void;
  trigger?: React.ReactNode;
}

export default function AddSaleModal({ onSubmit, trigger }: AddSaleModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [saleDate, setSaleDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  const { articles, isLoading } = useArticlesManager();
  
  // الحصول على المنتج المحدد
  const selectedArticle = articles.find(article => article.id === selectedArticleId);
  
  // تصفية المنتجات حسب البحث
  const filteredArticles = articles.filter(article =>
    article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // حساب إجمالي المبلغ
  const totalAmount = quantity * price;
  
  // تعيين التاريخ الحالي عند فتح Modal
  useEffect(() => {
    if (open && !saleDate) {
      const today = new Date().toISOString().split('T')[0];
      setSaleDate(today);
    }
    // إعادة تعيين البحث عند فتح Modal
    if (open) {
      setSearchTerm("");
    }
  }, [open, saleDate]);
  
  // تحديث السعر عند اختيار مقال
  useEffect(() => {
    if (selectedArticle) {
      setPrice(selectedArticle.prix_achat * 1.3); // هامش ربح 30%
    }
  }, [selectedArticle]);
  
  const handleSubmit = () => {
    if (!selectedArticleId || !selectedArticle) {
      alert("الرجاء اختيار مقال");
      return;
    }
    
    if (quantity <= 0) {
      alert("الكمية يجب أن تكون أكبر من صفر");
      return;
    }
    
    if (quantity > selectedArticle.quantite) {
      alert(`الكمية المتوفرة (${selectedArticle.quantite}) أقل من الكمية المطلوبة (${quantity})`);
      return;
    }
    
    if (price <= 0) {
      alert("السعر يجب أن يكون أكبر من صفر");
      return;
    }
    
    if (!saleDate) {
      alert("الرجاء تحديد تاريخ البيع");
      return;
    }
    
    const venteData: VenteInput = {
      articleId: selectedArticleId,
      articleTitle: selectedArticle.titre,
      quantiteVendue: quantity,
      prixTotal: totalAmount,
      dateVente: new Date(saleDate),
    };
    
    onSubmit(venteData);
    handleClose();
  };
  
  const handleClose = () => {
    setOpen(false);
    setSelectedArticleId("");
    setQuantity(1);
    setPrice(0);
    setSaleDate("");
    setSearchTerm("");
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-cairo">
            <ShoppingCart className="w-4 h-4 ml-2" />
            إضافة عملية بيع
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-cairo text-xl">إضافة عملية بيع جديدة</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* اختيار المنتج */}
          <div>
            <Label htmlFor="article" className="font-cairo">اختر المنتج</Label>
            <Select value={selectedArticleId} onValueChange={setSelectedArticleId}>
              <SelectTrigger className="font-cairo">
                <SelectValue placeholder="اختر منتج..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60">
                {/* شريط البحث */}
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="البحث في المنتجات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* قائمة المنتجات */}
                <div className="max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-3 text-center text-gray-500 font-cairo text-sm">
                      جاري التحميل...
                    </div>
                  ) : filteredArticles.length === 0 ? (
                    <div className="p-3 text-center text-gray-500 font-cairo text-sm">
                      {searchTerm ? "لا توجد منتجات تطابق البحث" : "لا توجد منتجات متاحة"}
                    </div>
                  ) : (
                    filteredArticles.map((article) => (
                      <SelectItem 
                        key={article.id} 
                        value={article.id}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 p-2">
                          <img 
                            src={article.photo || "https://via.placeholder.com/32x32"} 
                            alt={article.titre}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-cairo font-medium text-gray-900 truncate">
                              {article.titre}
                            </div>
                            <div className="text-sm text-gray-500 font-cairo">
                              الكمية المتوفرة: {article.quantite}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>
          
          {/* معلومات المنتج المحدد */}
          {selectedArticle && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedArticle.photo || "https://via.placeholder.com/48x48"} 
                  alt={selectedArticle.titre}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <h4 className="font-cairo font-semibold">{selectedArticle.titre}</h4>
                  <p className="text-sm text-gray-600 font-cairo">
                    الكمية المتوفرة: {selectedArticle.quantite}
                  </p>
                  <p className="text-sm text-gray-600 font-cairo">
                    سعر الشراء: {selectedArticle.prix_achat} درهم
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* الكمية */}
          <div>
            <Label htmlFor="quantity" className="font-cairo">الكمية</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedArticle?.quantite || 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="font-cairo"
            />
            {selectedArticle && (
              <p className="text-sm text-gray-600 font-cairo mt-1">
                الكمية المتوفرة: {selectedArticle.quantite}
              </p>
            )}
          </div>
          
          {/* سعر البيع */}
          <div>
            <Label htmlFor="price" className="font-cairo">سعر البيع (درهم)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="font-cairo"
            />
          </div>
          
          {/* تاريخ البيع */}
          <div>
            <Label htmlFor="saleDate" className="font-cairo">تاريخ البيع</Label>
            <Input
              id="saleDate"
              type="date"
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="font-cairo"
            />
          </div>
          
          {/* إجمالي المبلغ */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-cairo font-semibold">إجمالي المبلغ:</span>
              <span className="font-cairo font-bold text-lg text-blue-600">
                {totalAmount.toFixed(2)} درهم
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} className="font-cairo">
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-cairo"
            disabled={!selectedArticleId || quantity <= 0 || price <= 0 || !saleDate || isLoading}
          >
            إضافة البيع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
