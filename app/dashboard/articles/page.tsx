"use client";
import { useState } from "react";
import { ArticlesTable } from "../components/Tables";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import Pagination from "../components/Pagination";
import { useArticlesManager } from "@/lib/hooks/useArticlesSQLite";
import { ArticleInput, ArticleUpdateInput } from "@/lib/types/database";

export default function ArticlesPage() {
  const { 
    articles, 
    loading, 
    addArticle, 
    updateArticle, 
    deleteArticle 
  } = useArticlesManager();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const itemsPerPage = 8; // عدد المنتجات في كل صفحة

  // تحويل بيانات SQLite إلى تنسيق الجدول
  const tableArticles = articles.map(article => ({
    id: article.id,
    image: article.photo || "https://via.placeholder.com/48x48",
    title: article.titre,
    description: article.description,
    quantity: article.quantite,
    purchasePrice: article.prix_achat,
    reference: article.reference,
  }));

  // تصفية المنتجات حسب البحث
  const filteredArticles = tableArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حساب الصفحات
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // إعادة تعيين الصفحة عند تغيير البحث
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // العودة للصفحة الأولى عند البحث
  };

  const handleEdit = async (article: any) => {
    // البحث عن المنتج الأصلي من قاعدة البيانات
    const originalProduct = articles.find(a => a.id === article.id);
    if (originalProduct) {
      setEditingProduct(originalProduct);
    }
  };

  const handleCloseEdit = () => {
    setEditingProduct(null);
  };

  const handleUpdateProduct = async (id: string, updateData: ArticleUpdateInput) => {
    try {
      await updateArticle(id, updateData);
      alert("تم تحديث المنتج بنجاح!");
      setEditingProduct(null);
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await deleteArticle(id);
        alert("تم حذف المنتج بنجاح!");
      } catch (error: any) {
        alert(`خطأ: ${error.message}`);
      }
    }
  };

  const handleAddProduct = async (productData: any) => {
    const articleData: ArticleInput = {
      titre: productData.title,
      description: productData.description,
      photo: productData.image,
      prix_achat: productData.purchasePrice,
      quantite: productData.quantity,
      reference: productData.reference,
    };

    try {
      await addArticle(articleData);
      alert("تم إضافة المنتج بنجاح!");
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">إدارة المنتجات</h1>
          <p className="text-gray-600 font-cairo">إدارة مخزون المنتجات</p>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-cairo">جاري تحميل المنتجات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">إدارة المنتجات</h1>
        <p className="text-gray-600 font-cairo">إدارة مخزون المنتجات</p>
      </div>

      {/* شريط البحث */}
      <div className="relative">
        <input
          type="text"
          placeholder="البحث في المنتجات..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-cairo"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-600 font-cairo">
          تم العثور على {filteredArticles.length} منتج من أصل {articles.length}
        </p>
      )}

      <ArticlesTable 
        articles={currentArticles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => {}} // This will be handled by the modal
      />

      {/* نظام الصفحات */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredArticles.length}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        itemName="منتج"
      />

      {/* Add Product Modal */}
      <div className="flex justify-end mt-6">
        <AddProductModal onSubmit={handleAddProduct} />
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSubmit={handleUpdateProduct}
          onClose={handleCloseEdit}
        />
      )}
    </div>
  );
}
