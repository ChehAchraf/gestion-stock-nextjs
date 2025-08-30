"use client";
import { useState } from "react";
import { SalesTable } from "../components/Tables";
import AddSaleModal from "../components/AddSaleModal";
import EditSaleModal from "../components/EditSaleModal";
import Pagination from "../components/Pagination";
import { useVentesManager } from "@/lib/hooks/useVentesSQLite";
import { VenteInput, VenteUpdateInput } from "@/lib/types/database";

export default function SalesPage() {
  const {
    ventes,
    loading,
    addVente,
    updateVente,
    deleteVente
  } = useVentesManager();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSale, setEditingSale] = useState<any>(null);
  const itemsPerPage = 8; // عدد المبيعات في كل صفحة

  // تحويل بيانات SQLite إلى تنسيق الجدول
  const tableSales = ventes.map(vente => ({
    id: vente.id,
    articleTitle: vente.articleTitle,
    date: new Date(vente.dateVente).toLocaleDateString('en-US'),
    price: vente.prixTotal / vente.quantiteVendue, // سعر الوحدة
    quantity: vente.quantiteVendue,
    totalAmount: vente.prixTotal,
  }));

  // تصفية المبيعات حسب البحث
  const filteredSales = tableSales.filter(sale =>
    sale.articleTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حساب الصفحات
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, endIndex);

  // إعادة تعيين الصفحة عند تغيير البحث
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // العودة للصفحة الأولى عند البحث
  };

  const handleEdit = async (sale: any) => {
    // البحث عن عملية البيع الأصلية من قاعدة البيانات
    const originalSale = ventes.find(v => v.id === sale.id);
    if (originalSale) {
      setEditingSale(originalSale);
    }
  };

  const handleUpdateSale = async (id: string, updateData: VenteUpdateInput) => {
    try {
      await updateVente(id, updateData);
      alert("تم تحديث عملية البيع بنجاح!");
      setEditingSale(null);
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه العملية؟")) {
      try {
        await deleteVente(id);
        alert("تم حذف العملية بنجاح!");
      } catch (error: any) {
        alert(`خطأ: ${error.message}`);
      }
    }
  };

  const handleAddSale = async (venteData: VenteInput) => {
    try {
      await addVente(venteData);
      alert("تم إضافة عملية البيع بنجاح!");
    } catch (error: any) {
      alert(`خطأ: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">إدارة المبيعات</h1>
          <p className="text-gray-600 font-cairo">إدارة عمليات البيع والمبيعات</p>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-cairo">جاري تحميل المبيعات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">إدارة المبيعات</h1>
        <p className="text-gray-600 font-cairo">إدارة عمليات البيع والمبيعات</p>
      </div>

      {/* شريط البحث */}
      <div className="relative">
        <input
          type="text"
          placeholder="البحث في المبيعات..."
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
          تم العثور على {filteredSales.length} عملية من أصل {ventes.length}
        </p>
      )}

      <SalesTable
        sales={currentSales}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => {}} // This will be handled by the modal
      />

      {/* نظام الصفحات */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSales.length}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        itemName="عملية"
      />

      {/* Add Sale Modal */}
      <div className="flex justify-end mt-6">
        <AddSaleModal onSubmit={handleAddSale} />
      </div>

      {/* Edit Sale Modal */}
      {editingSale && (
        <EditSaleModal
          sale={editingSale}
          onSubmit={handleUpdateSale}
        />
      )}
    </div>
  );
}
