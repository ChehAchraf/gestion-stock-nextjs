import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// أنواع TypeScript للبيانات
export interface SaleInput {
  articleId: Id<"articles">;
  articleTitle: string;
  quantity: number;
  price: number;
  totalAmount: number;
  saleDate: number;
}

export interface SaleUpdateInput {
  quantity?: number;
  price?: number;
  totalAmount?: number;
  saleDate?: number;
}

// 1. إنشاء عملية بيع جديدة
export const addSale = mutation({
  args: {
    articleId: v.id("articles"),
    articleTitle: v.string(),
    quantity: v.number(),
    price: v.number(),
    totalAmount: v.number(),
    saleDate: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // التحقق من وجود المقال
    const article = await ctx.db.get(args.articleId);
    if (!article) {
      return {
        success: false,
        message: "المقال غير موجود"
      };
    }
    
    // التحقق من الكمية المتوفرة
    if (article.quantite < args.quantity) {
      return {
        success: false,
        message: `الكمية المتوفرة (${article.quantite}) أقل من الكمية المطلوبة (${args.quantity})`
      };
    }
    
    // إنشاء عملية البيع
    const saleId = await ctx.db.insert("sales", {
      articleId: args.articleId,
      articleTitle: args.articleTitle,
      quantity: args.quantity,
      price: args.price,
      totalAmount: args.totalAmount,
      saleDate: args.saleDate,
      createdAt: now,
      updatedAt: now,
    });
    
    // تحديث كمية المقال
    const newQuantity = article.quantite - args.quantity;
    await ctx.db.patch(args.articleId, {
      quantite: newQuantity,
      updatedAt: now,
    });

    return {
      success: true,
      saleId,
      message: "تم إضافة عملية البيع بنجاح"
    };
  },
});

// 2. جلب جميع المبيعات مرتبة حسب التاريخ
export const getSales = query({
  args: {},
  handler: async (ctx) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_saleDate")
      .order("desc")
      .collect();

    return {
      success: true,
      sales: sales.map(sale => ({
        _id: sale._id,
        articleId: sale.articleId,
        articleTitle: sale.articleTitle,
        quantity: sale.quantity,
        price: sale.price,
        totalAmount: sale.totalAmount,
        saleDate: sale.saleDate,
        createdAt: sale.createdAt || Date.now(),
        updatedAt: sale.updatedAt || Date.now(),
      })),
      count: sales.length
    };
  },
});

// 3. جلب عملية بيع واحدة حسب _id
export const getSaleById = query({
  args: { id: v.id("sales") },
  handler: async (ctx, args) => {
    const sale = await ctx.db.get(args.id);
    
    if (!sale) {
      return {
        success: false,
        message: "عملية البيع غير موجودة",
        sale: null
      };
    }

    return {
      success: true,
      sale: {
        _id: sale._id,
        articleId: sale.articleId,
        articleTitle: sale.articleTitle,
        quantity: sale.quantity,
        price: sale.price,
        totalAmount: sale.totalAmount,
        saleDate: sale.saleDate,
        createdAt: sale.createdAt || Date.now(),
        updatedAt: sale.updatedAt || Date.now(),
      }
    };
  },
});

// 4. تحديث عملية بيع
export const updateSale = mutation({
  args: {
    id: v.id("sales"),
    quantity: v.optional(v.number()),
    price: v.optional(v.number()),
    totalAmount: v.optional(v.number()),
    saleDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    // التحقق من وجود عملية البيع
    const existingSale = await ctx.db.get(id);
    if (!existingSale) {
      return {
        success: false,
        message: "عملية البيع غير موجودة"
      };
    }

    // إذا تم تغيير الكمية، نحتاج لتحديث كمية المقال
    if (updateData.quantity !== undefined && updateData.quantity !== existingSale.quantity) {
      const article = await ctx.db.get(existingSale.articleId);
      if (article) {
        const quantityDifference = existingSale.quantity - updateData.quantity;
        const newQuantity = article.quantite + quantityDifference;
        
        if (newQuantity < 0) {
          return {
            success: false,
            message: "لا يمكن تقليل الكمية أكثر من الكمية المتوفرة"
          };
        }
        
        await ctx.db.patch(existingSale.articleId, {
          quantite: newQuantity,
          updatedAt: Date.now(),
        });
      }
    }

    // إضافة timestamp التحديث
    const updateFields = {
      ...updateData,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(id, updateFields);

    return {
      success: true,
      message: "تم تحديث عملية البيع بنجاح"
    };
  },
});

// 5. حذف عملية بيع
export const deleteSale = mutation({
  args: { id: v.id("sales") },
  handler: async (ctx, args) => {
    // التحقق من وجود عملية البيع
    const existingSale = await ctx.db.get(args.id);
    if (!existingSale) {
      return {
        success: false,
        message: "عملية البيع غير موجودة"
      };
    }

    // إعادة الكمية للمقال
    const article = await ctx.db.get(existingSale.articleId);
    if (article) {
      const newQuantity = article.quantite + existingSale.quantity;
      await ctx.db.patch(existingSale.articleId, {
        quantite: newQuantity,
        updatedAt: Date.now(),
      });
    }

    await ctx.db.delete(args.id);

    return {
      success: true,
      message: "تم حذف عملية البيع بنجاح"
    };
  },
});

// وظائف إضافية مفيدة

// جلب المبيعات حسب المقال
export const getSalesByArticle = query({
  args: { articleId: v.id("articles") },
  handler: async (ctx, args) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_articleId")
      .filter((q) => q.eq(q.field("articleId"), args.articleId))
      .collect();

    return {
      success: true,
      sales: sales.map(sale => ({
        _id: sale._id,
        articleId: sale.articleId,
        articleTitle: sale.articleTitle,
        quantity: sale.quantity,
        price: sale.price,
        totalAmount: sale.totalAmount,
        saleDate: sale.saleDate,
        createdAt: sale.createdAt || Date.now(),
        updatedAt: sale.updatedAt || Date.now(),
      })),
      count: sales.length
    };
  },
});

// جلب المبيعات حسب الفترة الزمنية
export const getSalesByDateRange = query({
  args: { 
    startDate: v.number(),
    endDate: v.number()
  },
  handler: async (ctx, args) => {
    const sales = await ctx.db
      .query("sales")
      .withIndex("by_saleDate")
      .filter((q) => 
        q.and(
          q.gte(q.field("saleDate"), args.startDate),
          q.lte(q.field("saleDate"), args.endDate)
        )
      )
      .collect();

    return {
      success: true,
      sales: sales.map(sale => ({
        _id: sale._id,
        articleId: sale.articleId,
        articleTitle: sale.articleTitle,
        quantity: sale.quantity,
        price: sale.price,
        totalAmount: sale.totalAmount,
        saleDate: sale.saleDate,
        createdAt: sale.createdAt || Date.now(),
        updatedAt: sale.updatedAt || Date.now(),
      })),
      count: sales.length
    };
  },
});

// إحصائيات المبيعات
export const getSalesStats = query({
  args: {},
  handler: async (ctx) => {
    const sales = await ctx.db
      .query("sales")
      .collect();

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const averagePrice = totalSales > 0 ? totalRevenue / totalQuantity : 0;

    // إحصائيات الشهر الحالي
    const now = Date.now();
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
    const monthlySales = sales.filter(sale => sale.saleDate >= oneMonthAgo);
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    // حساب المنتجات الأكثر والأقل مبيعاً هذا الشهر
    const monthlyProductStats = new Map();
    
    monthlySales.forEach(sale => {
      const current = monthlyProductStats.get(sale.articleId) || {
        articleId: sale.articleId,
        articleTitle: sale.articleTitle,
        totalQuantity: 0,
        totalRevenue: 0,
        saleCount: 0
      };
      
      current.totalQuantity += sale.quantity;
      current.totalRevenue += sale.totalAmount;
      current.saleCount += 1;
      
      monthlyProductStats.set(sale.articleId, current);
    });

    const monthlyProductArray = Array.from(monthlyProductStats.values());
    
    // ترتيب المنتجات حسب الكمية المباعة
    const sortedByQuantity = [...monthlyProductArray].sort((a, b) => b.totalQuantity - a.totalQuantity);
    const mostSoldProduct = sortedByQuantity[0] || null;
    const leastSoldProduct = sortedByQuantity[sortedByQuantity.length - 1] || null;

    // ترتيب المنتجات حسب الإيرادات
    const sortedByRevenue = [...monthlyProductArray].sort((a, b) => b.totalRevenue - a.totalRevenue);
    const highestRevenueProduct = sortedByRevenue[0] || null;

    return {
      success: true,
      stats: {
        totalSales,
        totalRevenue,
        totalQuantity,
        averagePrice,
        monthlySales: monthlySales.length,
        monthlyRevenue,
        mostSoldProduct,
        leastSoldProduct,
        highestRevenueProduct,
        monthlyProductCount: monthlyProductArray.length
      }
    };
  },
});
