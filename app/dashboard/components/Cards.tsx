"use client";
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: string;
}

export function StatCard({ title, value, icon: Icon, color, change }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 font-cairo text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 font-cairo">{value}</p>
          {change && (
            <p className="text-green-600 font-cairo text-sm mt-1">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface LowStockWidgetProps {
  items: Array<{
    id: string;
    title: string;
    quantity: number;
  }>;
}

export function LowStockWidget({ items }: LowStockWidgetProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="font-semibold text-gray-900 font-cairo">منتجات قريبة تنفذ من المخزون</h3>
      </div>
      
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-gray-500 font-cairo text-sm">لا توجد منتجات قريبة من النفاد</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="font-cairo text-sm">{item.title}</span>
              <span className="text-orange-600 font-semibold font-cairo text-sm">
                {item.quantity} قطعة
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Default stats cards
export function StatsCards({ stats }: { stats?: any }) {
  const defaultStats = {
    totalArticles: 0,
    totalValue: 0,
    lowStockCount: 0,
    totalQuantity: 0,
    averagePrice: 0
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="عدد المنتجات"
        value={currentStats.totalArticles}
        icon={Package}
        color="bg-blue-500"
        change="+12% هذا الشهر"
      />
      <StatCard
        title="إجمالي المبيعات"
        value={currentStats.totalSales || 0}
        icon={ShoppingCart}
        color="bg-green-500"
        change="+8% هذا الشهر"
      />
      <StatCard
        title="إيرادات هذا الشهر"
        value={`${(currentStats.monthlyRevenue || 0).toFixed(2)} درهم`}
        icon={TrendingUp}
        color="bg-purple-500"
        change="+15% مقارنة بالشهر السابق"
      />
    </div>
  );
}

// إحصائيات إضافية
export function DetailedStats({ stats }: { stats?: any }) {
  const defaultStats = {
    totalArticles: 0,
    totalValue: 0,
    lowStockCount: 0,
    totalQuantity: 0,
    averagePrice: 0
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-cairo text-sm">إجمالي الكمية</p>
            <p className="text-xl font-bold text-gray-900 font-cairo">{currentStats.totalQuantity}</p>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-cairo text-sm">متوسط السعر</p>
            <p className="text-xl font-bold text-gray-900 font-cairo">{currentStats.averagePrice.toFixed(2)} درهم</p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-cairo text-sm">منخفضة المخزون</p>
            <p className="text-xl font-bold text-gray-900 font-cairo">{currentStats.lowStockCount}</p>
          </div>
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-cairo text-sm">مبيعات هذا الشهر</p>
            <p className="text-xl font-bold text-gray-900 font-cairo">{currentStats.monthlySales || 0}</p>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 font-cairo text-sm">إجمالي الإيرادات</p>
            <p className="text-xl font-bold text-gray-900 font-cairo">{(currentStats.totalRevenue || 0).toFixed(2)} درهم</p>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
