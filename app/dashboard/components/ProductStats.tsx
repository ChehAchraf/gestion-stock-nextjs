"use client";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { ProductStats } from "@/lib/types/database";

interface ProductStatsProps {
  mostSoldProduct: ProductStats | null;
  leastSoldProduct: ProductStats | null;
  highestRevenueProduct: ProductStats | null;
}

export default function ProductStats({ 
  mostSoldProduct, 
  leastSoldProduct, 
  highestRevenueProduct 
}: ProductStatsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 font-cairo">إحصائيات المنتجات هذا الشهر</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* المنتج الأكثر مبيعاً */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 font-cairo">الأكثر مبيعاً</h4>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          
          {mostSoldProduct ? (
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-cairo font-semibold text-green-800">
                  {mostSoldProduct.articleTitle}
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 font-cairo">الكمية المباعة:</span>
                  <p className="font-bold text-gray-900 font-cairo">{mostSoldProduct.totalQuantity}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-cairo">عدد المبيعات:</span>
                  <p className="font-bold text-gray-900 font-cairo">{mostSoldProduct.saleCount}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 font-cairo">إجمالي الإيرادات:</span>
                  <p className="font-bold text-green-600 font-cairo">{mostSoldProduct.totalRevenue.toFixed(2)} درهم</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 font-cairo">لا توجد مبيعات هذا الشهر</p>
            </div>
          )}
        </div>

        {/* المنتج الأقل مبيعاً */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 font-cairo">الأقل مبيعاً</h4>
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          
          {leastSoldProduct ? (
            <div className="space-y-3">
              <div className="bg-orange-50 p-3 rounded-lg">
                <h5 className="font-cairo font-semibold text-orange-800">
                  {leastSoldProduct.articleTitle}
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 font-cairo">الكمية المباعة:</span>
                  <p className="font-bold text-gray-900 font-cairo">{leastSoldProduct.totalQuantity}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-cairo">عدد المبيعات:</span>
                  <p className="font-bold text-gray-900 font-cairo">{leastSoldProduct.saleCount}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 font-cairo">إجمالي الإيرادات:</span>
                  <p className="font-bold text-orange-600 font-cairo">{leastSoldProduct.totalRevenue.toFixed(2)} درهم</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 font-cairo">لا توجد مبيعات هذا الشهر</p>
            </div>
          )}
        </div>

        {/* المنتج الأعلى إيرادات */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 font-cairo">الأعلى إيرادات</h4>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          {highestRevenueProduct ? (
            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <h5 className="font-cairo font-semibold text-purple-800">
                  {highestRevenueProduct.articleTitle}
                </h5>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600 font-cairo">الكمية المباعة:</span>
                  <p className="font-bold text-gray-900 font-cairo">{highestRevenueProduct.totalQuantity}</p>
                </div>
                <div>
                  <span className="text-gray-600 font-cairo">عدد المبيعات:</span>
                  <p className="font-bold text-gray-900 font-cairo">{highestRevenueProduct.saleCount}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 font-cairo">إجمالي الإيرادات:</span>
                  <p className="font-bold text-purple-600 font-cairo">{highestRevenueProduct.totalRevenue.toFixed(2)} درهم</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 font-cairo">لا توجد مبيعات هذا الشهر</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
