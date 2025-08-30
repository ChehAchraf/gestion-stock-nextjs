"use client";
import { StatsCards, LowStockWidget, DetailedStats } from "./components/Cards";
import { useArticlesManager } from "@/lib/hooks/useArticlesSQLite";
import { useSalesStats } from "@/lib/hooks/useVentesSQLite";

export default function DashboardHome() {
  const { articles, loading: articlesLoading } = useArticlesManager();
  const { stats, loading: salesLoading } = useSalesStats();

  const isLoading = articlesLoading || salesLoading;

  // حساب إحصائيات المنتجات
  const articlesStats = {
    totalProducts: articles.length,
    totalValue: articles.reduce((sum, article) => sum + (article.prix_achat * article.quantite), 0),
    lowStockCount: articles.filter(article => article.quantite < 2).length,
    outOfStockCount: articles.filter(article => article.quantite === 0).length
  };

  // تحويل المنتجات منخفضة المخزون
  const lowStockItems = articles
    .filter(article => article.quantite < 2)
    .map(article => ({
      id: article.id,
      title: article.titre,
      quantity: article.quantite,
      image: article.photo || "https://via.placeholder.com/48x48"
    }));

  // دمج الإحصائيات من المنتجات والمبيعات
  const combinedStats = {
    ...articlesStats,
    totalArticles: articles.length,
    totalQuantity: articles.reduce((sum, article) => sum + article.quantite, 0),
    averagePrice: articles.length > 0 ? articles.reduce((sum, article) => sum + article.prix_achat, 0) / articles.length : 0,
    totalSales: stats?.totalSales || 0,
    totalRevenue: stats?.totalRevenue || 0,
    monthlySales: stats?.monthlySales || 0,
    monthlyRevenue: stats?.monthlyRevenue || 0,
    averageOrderValue: stats?.averageOrderValue || 0
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">لوحة التحكم</h1>
          <p className="text-gray-600 font-cairo">مرحباً بك في نظام إدارة المخزون</p>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-cairo">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">لوحة التحكم</h1>
        <p className="text-gray-600 font-cairo">مرحباً بك في نظام إدارة المخزون</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={combinedStats} />

      {/* Detailed Stats */}
      <DetailedStats stats={combinedStats} />

      {/* Low Stock Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockWidget items={lowStockItems} />
        
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 font-cairo mb-4">النشاط الأخير</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-cairo text-sm text-gray-900">تم إضافة منتج جديد</p>
                <p className="font-cairo text-xs text-gray-600">منذ 5 دقائق</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-cairo text-sm text-gray-900">تم إتمام عملية بيع</p>
                <p className="font-cairo text-xs text-gray-600">منذ 15 دقيقة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-cairo text-sm text-gray-900">تنبيه: مخزون منخفض</p>
                <p className="font-cairo text-xs text-gray-600">منذ ساعة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
