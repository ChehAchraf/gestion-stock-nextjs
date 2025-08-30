import { prisma } from '../prisma';
import { 
  Article, 
  ArticleInput, 
  ArticleUpdateInput, 
  ArticlesResult, 
  ArticleResult 
} from '../types/database';

export class ArticlesService {
  // إنشاء منتج جديد
  static async createArticle(data: ArticleInput): Promise<ArticleResult> {
    try {
      // التحقق من عدم وجود مرجع مكرر
      const existingArticle = await prisma.article.findUnique({
        where: { reference: data.reference }
      });

      if (existingArticle) {
        return {
          success: false,
          message: "المرجع موجود مسبقاً"
        };
      }

      const article = await prisma.article.create({
        data: {
          titre: data.titre,
          description: data.description,
          photo: data.photo,
          prix_achat: data.prix_achat,
          quantite: data.quantite,
          reference: data.reference,
        }
      });

      return {
        success: true,
        article,
        message: "تم إنشاء المنتج بنجاح"
      };
    } catch (error: any) {
      console.error('Error creating article:', error);
      return {
        success: false,
        message: `خطأ في إنشاء المنتج: ${error?.message || error}`
      };
    }
  }

  // جلب جميع المنتجات
  static async getArticles(): Promise<ArticlesResult> {
    try {
      const articles = await prisma.article.findMany({
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        articles,
        count: articles.length
      };
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      return {
        success: false,
        message: `خطأ في جلب المنتجات: ${error?.message || error}`
      };
    }
  }

  // جلب منتج واحد بالـ ID
  static async getArticleById(id: string): Promise<ArticleResult> {
    try {
      const article = await prisma.article.findUnique({
        where: { id }
      });

      if (!article) {
        return {
          success: false,
          message: "المنتج غير موجود"
        };
      }

      return {
        success: true,
        article
      };
    } catch (error: any) {
      console.error('Error fetching article:', error);
      return {
        success: false,
        message: `خطأ في جلب المنتج: ${error?.message || error}`
      };
    }
  }

  // تحديث منتج
  static async updateArticle(id: string, data: ArticleUpdateInput): Promise<ArticleResult> {
    try {
      // التحقق من وجود المنتج
      const existingArticle = await prisma.article.findUnique({
        where: { id }
      });

      if (!existingArticle) {
        return {
          success: false,
          message: "المنتج غير موجود"
        };
      }

      // التحقق من عدم وجود مرجع مكرر إذا تم تغييره
      if (data.reference && data.reference !== existingArticle.reference) {
        const duplicateReference = await prisma.article.findUnique({
          where: { reference: data.reference }
        });

        if (duplicateReference) {
          return {
            success: false,
            message: "المرجع موجود مسبقاً"
          };
        }
      }

      const article = await prisma.article.update({
        where: { id },
        data
      });

      return {
        success: true,
        article,
        message: "تم تحديث المنتج بنجاح"
      };
    } catch (error: any) {
      console.error('Error updating article:', error);
      return {
        success: false,
        message: `خطأ في تحديث المنتج: ${error?.message || error}`
      };
    }
  }

  // حذف منتج
  static async deleteArticle(id: string): Promise<ArticleResult> {
    try {
      // التحقق من وجود المنتج
      const existingArticle = await prisma.article.findUnique({
        where: { id }
      });

      if (!existingArticle) {
        return {
          success: false,
          message: "المنتج غير موجود"
        };
      }

      await prisma.article.delete({
        where: { id }
      });

      return {
        success: true,
        message: "تم حذف المنتج بنجاح"
      };
    } catch (error: any) {
      console.error('Error deleting article:', error);
      return {
        success: false,
        message: `خطأ في حذف المنتج: ${error?.message || error}`
      };
    }
  }

  // جلب المنتجات منخفضة المخزون
  static async getLowStockArticles(threshold: number = 5): Promise<ArticlesResult> {
    try {
      const articles = await prisma.article.findMany({
        where: {
          quantite: {
            lt: threshold
          }
        },
        orderBy: { quantite: 'asc' }
      });

      return {
        success: true,
        articles,
        count: articles.length
      };
    } catch (error: any) {
      console.error('Error fetching low stock articles:', error);
      return {
        success: false,
        message: `خطأ في جلب المنتجات منخفضة المخزون: ${error?.message || error}`
      };
    }
  }

  // حساب إجمالي قيمة المخزون
  static async getTotalInventoryValue(): Promise<{ success: boolean; value?: number; message?: string }> {
    try {
      const result = await prisma.article.aggregate({
        _sum: {
          quantite: true
        }
      });

      const articles = await prisma.article.findMany();
      const totalValue = articles.reduce((sum, article) => {
        return sum + (article.prix_achat * article.quantite);
      }, 0);

      return {
        success: true,
        value: totalValue
      };
    } catch (error: any) {
      console.error('Error calculating inventory value:', error);
      return {
        success: false,
        message: `خطأ في حساب قيمة المخزون: ${error?.message || error}`
      };
    }
  }
}
