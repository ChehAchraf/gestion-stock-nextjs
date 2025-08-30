"use client";
import { SalesChart } from "../components/Charts";
import ProductStats from "../components/ProductStats";
import { useSalesStats } from "@/lib/hooks/useVentesSQLite";
import { useArticlesManager } from "@/lib/hooks/useArticlesSQLite";

export default function ReportsPage() {
  const { stats: salesStats, isLoading: salesLoading } = useSalesStats();
  const { articles, loading: articlesLoading } = useArticlesManager();

  if (salesLoading || articlesLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">التقارير والإحصائيات</h1>
          <p className="text-gray-600 font-cairo">تحليل البيانات والإحصائيات</p>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-cairo">جاري تحميل التقارير...</p>
          </div>
        </div>
      </div>
    );
  }

  // حساب إحصائيات المنتجات
  const articlesStats = {
    totalProducts: articles.length,
    totalValue: articles.reduce((sum, article) => sum + (article.prix_achat * article.quantite), 0),
    lowStockCount: articles.filter(article => article.quantite < 2).length,
    outOfStockCount: articles.filter(article => article.quantite === 0).length
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">التقارير والإحصائيات</h1>
        <p className="text-gray-600 font-cairo">تحليل البيانات والإحصائيات</p>
      </div>

      {/* إحصائيات المبيعات العامة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{salesStats?.totalSales || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{(salesStats?.totalRevenue || 0).toFixed(2)} درهم</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">مبيعات هذا الشهر</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{salesStats?.monthlySales || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">إيرادات هذا الشهر</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{(salesStats?.monthlyRevenue || 0).toFixed(2)} درهم</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">إجمالي المنتجات</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{articlesStats.totalProducts}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">قيمة المخزون</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{articlesStats.totalValue.toFixed(2)} درهم</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">مخزون منخفض</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{articlesStats.lowStockCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 font-cairo text-sm">نفذ المخزون</p>
              <p className="text-2xl font-bold text-gray-900 font-cairo">{articlesStats.outOfStockCount}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* إحصائيات المنتجات */}
      <ProductStats 
        mostSoldProduct={salesStats?.mostSoldProduct}
        leastSoldProduct={salesStats?.leastSoldProduct}
        highestRevenueProduct={salesStats?.highestRevenueProduct}
      />

      {/* الرسم البياني */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 font-cairo mb-4">الرسم البياني للمبيعات</h3>
        <SalesChart />
      </div>
    </div>
  );
}
