import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// أنواع TypeScript للبيانات
export interface ArticleInput {
  titre: string;
  description: string;
  photo?: string;
  prix_achat: number;
  quantite: number;
  reference: string;
}

export interface ArticleUpdateInput {
  titre?: string;
  description?: string;
  photo?: string;
  prix_achat?: number;
  quantite?: number;
  reference?: string;
}

// 1. إنشاء مقال جديد
export const addArticle = mutation({
  args: {
    titre: v.string(),
    description: v.string(),
    photo: v.optional(v.string()),
    prix_achat: v.number(),
    quantite: v.number(),
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const articleId = await ctx.db.insert("articles", {
      titre: args.titre,
      description: args.description,
      photo: args.photo,
      prix_achat: args.prix_achat,
      quantite: args.quantite,
      reference: args.reference,
      createdAt: now,
      updatedAt: now,
    });

    return {
      success: true,
      articleId,
      message: "تم إنشاء المقال بنجاح"
    };
  },
});

// 2. جلب جميع المقالات مرتبة حسب التاريخ
export const getArticles = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    return {
      success: true,
      articles: articles.map(article => ({
        _id: article._id,
        titre: article.titre,
        description: article.description,
        photo: article.photo,
        prix_achat: article.prix_achat,
        quantite: article.quantite,
        reference: article.reference,
        createdAt: article.createdAt || Date.now(),
        updatedAt: article.updatedAt || Date.now(),
      })),
      count: articles.length
    };
  },
});

// 3. جلب مقال واحد حسب _id
export const getArticleById = query({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.id);
    
    if (!article) {
      return {
        success: false,
        message: "المقال غير موجود",
        article: null
      };
    }

    return {
      success: true,
      article: {
        _id: article._id,
        titre: article.titre,
        description: article.description,
        photo: article.photo,
        prix_achat: article.prix_achat,
        quantite: article.quantite,
        reference: article.reference,
        createdAt: article.createdAt || Date.now(),
        updatedAt: article.updatedAt || Date.now(),
      }
    };
  },
});

// 4. تحديث مقال
export const updateArticle = mutation({
  args: {
    id: v.id("articles"),
    titre: v.optional(v.string()),
    description: v.optional(v.string()),
    photo: v.optional(v.string()),
    prix_achat: v.optional(v.number()),
    quantite: v.optional(v.number()),
    reference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    // التحقق من وجود المقال
    const existingArticle = await ctx.db.get(id);
    if (!existingArticle) {
      return {
        success: false,
        message: "المقال غير موجود"
      };
    }

    // إضافة timestamp التحديث
    const updateFields = {
      ...updateData,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(id, updateFields);

    return {
      success: true,
      message: "تم تحديث المقال بنجاح"
    };
  },
});

// 5. حذف مقال
export const deleteArticle = mutation({
  args: { id: v.id("articles") },
  handler: async (ctx, args) => {
    // التحقق من وجود المقال
    const existingArticle = await ctx.db.get(args.id);
    if (!existingArticle) {
      return {
        success: false,
        message: "المقال غير موجود"
      };
    }

    await ctx.db.delete(args.id);

    return {
      success: true,
      message: "تم حذف المقال بنجاح"
    };
  },
});

// وظائف إضافية مفيدة

// جلب المقالات حسب الكمية (للعرض في LowStockWidget)
export const getLowStockArticles = query({
  args: { minQuantity: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const minQuantity = args.minQuantity || 2;
    
    const articles = await ctx.db
      .query("articles")
      .withIndex("by_quantite")
      .filter((q) => q.lt(q.field("quantite"), minQuantity))
      .collect();

    return {
      success: true,
      articles: articles.map(article => ({
        _id: article._id,
        titre: article.titre,
        description: article.description,
        photo: article.photo,
        prix_achat: article.prix_achat,
        quantite: article.quantite,
        reference: article.reference,
        createdAt: article.createdAt || Date.now(),
        updatedAt: article.updatedAt || Date.now(),
      })),
      count: articles.length
    };
  },
});

// البحث في المقالات حسب العنوان أو الوصف
export const searchArticles = query({
  args: { 
    searchTerm: v.string(),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchTerm = args.searchTerm.toLowerCase();
    
    const allArticles = await ctx.db
      .query("articles")
      .withIndex("by_createdAt")
      .order("desc")
      .collect();

    const filteredArticles = allArticles.filter(article => 
      article.titre.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.reference.toLowerCase().includes(searchTerm)
    ).slice(0, limit);

    return {
      success: true,
      articles: filteredArticles.map(article => ({
        _id: article._id,
        titre: article.titre,
        description: article.description,
        photo: article.photo,
        prix_achat: article.prix_achat,
        quantite: article.quantite,
        reference: article.reference,
        createdAt: article.createdAt || Date.now(),
        updatedAt: article.updatedAt || Date.now(),
      })),
      count: filteredArticles.length
    };
  },
});

// إحصائيات المقالات
export const getArticlesStats = query({
  args: {},
  handler: async (ctx) => {
    const articles = await ctx.db
      .query("articles")
      .collect();

    const totalArticles = articles.length;
    const totalValue = articles.reduce((sum, article) => sum + (article.prix_achat * article.quantite), 0);
    const lowStockCount = articles.filter(article => article.quantite < 2).length;
    const totalQuantity = articles.reduce((sum, article) => sum + article.quantite, 0);

    return {
      success: true,
      stats: {
        totalArticles,
        totalValue,
        lowStockCount,
        totalQuantity,
        averagePrice: totalArticles > 0 ? totalValue / totalQuantity : 0
      }
    };
  },
});
