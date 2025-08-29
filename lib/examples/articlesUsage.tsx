"use client";
import { useState } from "react";
import { useArticlesManager } from "../hooks/useArticles";
import { ArticleInput, ArticleUpdateInput } from "../types/articles";
import { Id } from "../../convex/_generated/dataModel";

// مثال على مكون إضافة مقال جديد
export const AddArticleExample = () => {
  const { addArticle } = useArticlesManager();
  const [formData, setFormData] = useState<ArticleInput>({
    titre: "",
    description: "",
    photo: "",
    prix_achat: 0,
    quantite: 0,
    reference: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addArticle(formData);
    
    if (result.success) {
      alert("تم إضافة المقال بنجاح!");
      setFormData({
        titre: "",
        description: "",
        photo: "",
        prix_achat: 0,
        quantite: 0,
        reference: "",
      });
    } else {
      alert(`خطأ: ${result.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">العنوان</label>
        <input
          type="text"
          value={formData.titre}
          onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">الوصف</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">سعر الشراء</label>
          <input
            type="number"
            step="0.01"
            value={formData.prix_achat}
            onChange={(e) => setFormData(prev => ({ ...prev, prix_achat: parseFloat(e.target.value) || 0 }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">الكمية</label>
          <input
            type="number"
            value={formData.quantite}
            onChange={(e) => setFormData(prev => ({ ...prev, quantite: parseInt(e.target.value) || 0 }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">المرجع</label>
        <input
          type="text"
          value={formData.reference}
          onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        إضافة المقال
      </button>
    </form>
  );
};

// مثال على مكون عرض قائمة المقالات
export const ArticlesListExample = () => {
  const { articles, isLoading, deleteArticle } = useArticlesManager();

  const handleDelete = async (id: Id<"articles">) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      const result = await deleteArticle(id);
      if (result.success) {
        alert("تم حذف المقال بنجاح!");
      } else {
        alert(`خطأ: ${result.message}`);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">قائمة المقالات ({articles.length})</h2>
      
      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-8">لا توجد مقالات</p>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div key={article._id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{article.titre}</h3>
                  <p className="text-gray-600 text-sm">{article.description}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-medium">المرجع:</span> {article.reference}</p>
                    <p><span className="font-medium">السعر:</span> {article.prix_achat} د.ك</p>
                    <p><span className="font-medium">الكمية:</span> {article.quantite}</p>
                    <p><span className="font-medium">القيمة الإجمالية:</span> {article.prix_achat * article.quantite} د.ك</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// مثال على مكون الإحصائيات
export const ArticlesStatsExample = () => {
  const { stats, isLoading } = useArticlesManager();

  if (isLoading) {
    return <div className="text-center py-4">جاري تحميل الإحصائيات...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-600">إجمالي المقالات</h3>
        <p className="text-2xl font-bold text-blue-900">{stats.totalArticles}</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-600">القيمة الإجمالية</h3>
        <p className="text-2xl font-bold text-green-900">{stats.totalValue.toFixed(2)} د.ك</p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-600">منخفضة المخزون</h3>
        <p className="text-2xl font-bold text-yellow-900">{stats.lowStockCount}</p>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-600">إجمالي الكمية</h3>
        <p className="text-2xl font-bold text-purple-900">{stats.totalQuantity}</p>
      </div>
    </div>
  );
};

// مثال على مكون تحديث مقال
export const UpdateArticleExample = ({ articleId }: { articleId: Id<"articles"> }) => {
  const { updateArticle } = useArticlesManager();
  const [updateData, setUpdateData] = useState<ArticleUpdateInput>({
    titre: "",
    description: "",
    prix_achat: 0,
    quantite: 0,
    reference: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // إزالة الحقول الفارغة
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== "" && value !== 0)
    );
    
    const result = await updateArticle(articleId, filteredData);
    
    if (result.success) {
      alert("تم تحديث المقال بنجاح!");
      setUpdateData({
        titre: "",
        description: "",
        prix_achat: 0,
        quantite: 0,
        reference: "",
      });
    } else {
      alert(`خطأ: ${result.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">تحديث المقال</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">العنوان الجديد</label>
        <input
          type="text"
          value={updateData.titre}
          onChange={(e) => setUpdateData(prev => ({ ...prev, titre: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">الوصف الجديد</label>
        <textarea
          value={updateData.description}
          onChange={(e) => setUpdateData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">السعر الجديد</label>
          <input
            type="number"
            step="0.01"
            value={updateData.prix_achat}
            onChange={(e) => setUpdateData(prev => ({ ...prev, prix_achat: parseFloat(e.target.value) || 0 }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">الكمية الجديدة</label>
          <input
            type="number"
            value={updateData.quantite}
            onChange={(e) => setUpdateData(prev => ({ ...prev, quantite: parseInt(e.target.value) || 0 }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">المرجع الجديد</label>
        <input
          type="text"
          value={updateData.reference}
          onChange={(e) => setUpdateData(prev => ({ ...prev, reference: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        تحديث المقال
      </button>
    </form>
  );
};
