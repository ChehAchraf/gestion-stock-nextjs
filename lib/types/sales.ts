import { Id } from "../../convex/_generated/dataModel";

// نوع عملية البيع الأساسي
export interface Sale {
  _id: Id<"sales">;
  articleId: Id<"articles">;
  articleTitle: string;
  quantity: number;
  price: number;
  totalAmount: number;
  saleDate: number;
  createdAt?: number;
  updatedAt?: number;
}

// نوع إدخال عملية بيع جديدة
export interface SaleInput {
  articleId: Id<"articles">;
  articleTitle: string;
  quantity: number;
  price: number;
  totalAmount: number;
  saleDate: number;
}

// نوع تحديث عملية بيع
export interface SaleUpdateInput {
  quantity?: number;
  price?: number;
  totalAmount?: number;
  saleDate?: number;
}

// نوع إحصائيات المنتج
export interface ProductStats {
  articleId: string;
  articleTitle: string;
  totalQuantity: number;
  totalRevenue: number;
  saleCount: number;
}

// نوع إحصائيات المبيعات
export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalQuantity: number;
  averagePrice: number;
  monthlySales: number;
  monthlyRevenue: number;
  mostSoldProduct: ProductStats | null;
  leastSoldProduct: ProductStats | null;
  highestRevenueProduct: ProductStats | null;
  monthlyProductCount: number;
}

// نوع نتيجة API
export interface ApiResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// نوع نتيجة إضافة عملية بيع
export interface AddSaleResult extends ApiResult {
  saleId?: Id<"sales">;
}

// نوع نتيجة جلب المبيعات
export interface GetSalesResult extends ApiResult {
  sales: Sale[];
  count: number;
}

// نوع نتيجة جلب عملية بيع واحدة
export interface GetSaleResult extends ApiResult {
  sale: Sale | null;
}

// نوع نتيجة الإحصائيات
export interface GetSalesStatsResult extends ApiResult {
  stats: SalesStats;
}

// نوع لعرض المبيعات في الجدول
export interface SaleTableItem {
  id: string;
  articleTitle: string;
  date: string;
  price: number;
  quantity: number;
  totalAmount: number;
}
