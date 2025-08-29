import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ArticleInput, ArticleUpdateInput } from "../../convex/articles";

// Hook لجلب جميع المقالات
export const useArticles = () => {
  const result = useQuery(api.articles.getArticles);
  
  return {
    articles: result?.articles || [],
    count: result?.count || 0,
    isLoading: result === undefined,
    error: result === null,
  };
};

// Hook لجلب مقال واحد
export const useArticle = (id: Id<"articles"> | null) => {
  const result = useQuery(api.articles.getArticleById, id ? { id } : "skip");
  
  return {
    article: result?.article || null,
    isLoading: result === undefined,
    error: result?.success === false,
    message: result?.message,
  };
};

// Hook لجلب المقالات منخفضة المخزون
export const useLowStockArticles = (minQuantity: number = 2) => {
  const result = useQuery(api.articles.getLowStockArticles, { minQuantity });
  
  return {
    articles: result?.articles || [],
    count: result?.count || 0,
    isLoading: result === undefined,
    error: result === null,
  };
};

// Hook للبحث في المقالات
export const useSearchArticles = (searchTerm: string, limit?: number) => {
  const result = useQuery(
    api.articles.searchArticles, 
    searchTerm ? { searchTerm, limit } : "skip"
  );
  
  return {
    articles: result?.articles || [],
    count: result?.count || 0,
    isLoading: result === undefined,
    error: result === null,
  };
};

// Hook لإحصائيات المقالات
export const useArticlesStats = () => {
  const result = useQuery(api.articles.getArticlesStats);
  
  return {
    stats: result?.stats || {
      totalArticles: 0,
      totalValue: 0,
      lowStockCount: 0,
      totalQuantity: 0,
      averagePrice: 0,
    },
    isLoading: result === undefined,
    error: result === null,
  };
};

// Hook لإضافة مقال جديد
export const useAddArticle = () => {
  const mutation = useMutation(api.articles.addArticle);
  
  const addArticle = async (articleData: ArticleInput) => {
    try {
      const result = await mutation(articleData);
      return result;
    } catch (error) {
      console.error("خطأ في إضافة المقال:", error);
      return {
        success: false,
        message: "حدث خطأ في إضافة المقال",
        error: error instanceof Error ? error.message : "خطأ غير معروف"
      };
    }
  };
  
  return { addArticle };
};

// Hook لتحديث مقال
export const useUpdateArticle = () => {
  const mutation = useMutation(api.articles.updateArticle);
  
  const updateArticle = async (id: Id<"articles">, updateData: ArticleUpdateInput) => {
    try {
      const result = await mutation({ id, ...updateData });
      return result;
    } catch (error) {
      console.error("خطأ في تحديث المقال:", error);
      return {
        success: false,
        message: "حدث خطأ في تحديث المقال",
        error: error instanceof Error ? error.message : "خطأ غير معروف"
      };
    }
  };
  
  return { updateArticle };
};

// Hook لحذف مقال
export const useDeleteArticle = () => {
  const mutation = useMutation(api.articles.deleteArticle);
  
  const deleteArticle = async (id: Id<"articles">) => {
    try {
      const result = await mutation({ id });
      return result;
    } catch (error) {
      console.error("خطأ في حذف المقال:", error);
      return {
        success: false,
        message: "حدث خطأ في حذف المقال",
        error: error instanceof Error ? error.message : "خطأ غير معروف"
      };
    }
  };
  
  return { deleteArticle };
};

// Hook شامل لإدارة المقالات
export const useArticlesManager = () => {
  const { addArticle } = useAddArticle();
  const { updateArticle } = useUpdateArticle();
  const { deleteArticle } = useDeleteArticle();
  const { articles, count, isLoading } = useArticles();
  const { stats } = useArticlesStats();
  
  return {
    // البيانات
    articles,
    count,
    stats,
    isLoading,
    
    // العمليات
    addArticle,
    updateArticle,
    deleteArticle,
    
    // دوال مساعدة
    getArticleById: (id: Id<"articles">) => articles.find(article => article._id === id),
    getLowStockArticles: () => articles.filter(article => article.quantite < 2),
    getTotalValue: () => articles.reduce((sum, article) => sum + (article.prix_achat * article.quantite), 0),
  };
};
