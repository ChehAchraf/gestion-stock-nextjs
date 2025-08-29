import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SaleInput, SaleUpdateInput } from "../../convex/sales";

// Hook لجلب جميع المبيعات
export const useSales = () => {
  const result = useQuery(api.sales.getSales);
  
  return {
    sales: result?.sales || [],
    isLoading: result === undefined,
    error: result?.success === false ? result.message : null,
    count: result?.count || 0
  };
};

// Hook لجلب مبيعات مقال معين
export const useSalesByArticle = (articleId: Id<"articles">) => {
  const result = useQuery(api.sales.getSalesByArticle, { articleId });
  
  return {
    sales: result?.sales || [],
    isLoading: result === undefined,
    error: result?.success === false ? result.message : null,
    count: result?.count || 0
  };
};

// Hook لجلب مبيعات حسب الفترة الزمنية
export const useSalesByDateRange = (startDate: number, endDate: number) => {
  const result = useQuery(api.sales.getSalesByDateRange, { startDate, endDate });
  
  return {
    sales: result?.sales || [],
    isLoading: result === undefined,
    error: result?.success === false ? result.message : null,
    count: result?.count || 0
  };
};

// Hook لإحصائيات المبيعات
export const useSalesStats = () => {
  const result = useQuery(api.sales.getSalesStats);
  
  return {
    stats: result?.stats || {
      totalSales: 0,
      totalRevenue: 0,
      totalQuantity: 0,
      averagePrice: 0,
      monthlySales: 0,
      monthlyRevenue: 0,
      mostSoldProduct: null,
      leastSoldProduct: null,
      highestRevenueProduct: null,
      monthlyProductCount: 0
    },
    isLoading: result === undefined,
    error: result?.success === false ? result.message : null
  };
};

// Hook لإضافة عملية بيع
export const useAddSale = () => {
  const mutation = useMutation(api.sales.addSale);
  
  const addSale = async (saleData: SaleInput) => {
    try {
      const result = await mutation(saleData);
      return result;
    } catch (error) {
      return {
        success: false,
        message: `خطأ في إضافة عملية البيع: ${error}`
      };
    }
  };
  
  return { addSale };
};

// Hook لتحديث عملية بيع
export const useUpdateSale = () => {
  const mutation = useMutation(api.sales.updateSale);
  
  const updateSale = async (id: Id<"sales">, updateData: SaleUpdateInput) => {
    try {
      const result = await mutation({ id, ...updateData });
      return result;
    } catch (error) {
      return {
        success: false,
        message: `خطأ في تحديث عملية البيع: ${error}`
      };
    }
  };
  
  return { updateSale };
};

// Hook لحذف عملية بيع
export const useDeleteSale = () => {
  const mutation = useMutation(api.sales.deleteSale);
  
  const deleteSale = async (id: Id<"sales">) => {
    try {
      const result = await mutation({ id });
      return result;
    } catch (error) {
      return {
        success: false,
        message: `خطأ في حذف عملية البيع: ${error}`
      };
    }
  };
  
  return { deleteSale };
};

// Hook شامل لإدارة المبيعات
export const useSalesManager = () => {
  const { sales, isLoading, error, count } = useSales();
  const { addSale } = useAddSale();
  const { updateSale } = useUpdateSale();
  const { deleteSale } = useDeleteSale();
  const { stats } = useSalesStats();
  
  return {
    sales,
    stats,
    isLoading,
    error,
    count,
    addSale,
    updateSale,
    deleteSale
  };
};
