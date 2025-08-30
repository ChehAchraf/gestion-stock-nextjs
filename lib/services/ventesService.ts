import { prisma } from '../prisma';
import { 
  Vente, 
  VenteInput, 
  VenteUpdateInput, 
  VentesResult, 
  VenteResult,
  SalesStats,
  ProductStats,
  MonthlyReport
} from '../types/database';

export class VentesService {
  // إنشاء عملية بيع جديدة
  static async createVente(data: VenteInput): Promise<VenteResult> {
    try {
      // التحقق من وجود المنتج
      const article = await prisma.article.findUnique({
        where: { id: data.articleId }
      });

      if (!article) {
        return {
          success: false,
          message: "المنتج غير موجود"
        };
      }

      // التحقق من الكمية المتوفرة
      if (article.quantite < data.quantiteVendue) {
        return {
          success: false,
          message: `الكمية المتوفرة (${article.quantite}) أقل من الكمية المطلوبة (${data.quantiteVendue})`
        };
      }

      // إنشاء عملية البيع
      const vente = await prisma.vente.create({
        data: {
          articleId: data.articleId,
          articleTitle: data.articleTitle,
          quantiteVendue: data.quantiteVendue,
          prixTotal: data.prixTotal,
          dateVente: data.dateVente,
        }
      });

      // تحديث كمية المنتج
      const newQuantity = article.quantite - data.quantiteVendue;
      await prisma.article.update({
        where: { id: data.articleId },
        data: { quantite: newQuantity }
      });

      return {
        success: true,
        vente,
        message: "تم إنشاء عملية البيع بنجاح"
      };
    } catch (error) {
      console.error('Error creating vente:', error);
      return {
        success: false,
        message: `خطأ في إنشاء عملية البيع: ${error}`
      };
    }
  }

  // جلب جميع المبيعات
  static async getVentes(): Promise<VentesResult> {
    try {
      const ventes = await prisma.vente.findMany({
        include: {
          article: true
        },
        orderBy: { dateVente: 'desc' }
      });

      return {
        success: true,
        ventes,
        count: ventes.length
      };
    } catch (error) {
      console.error('Error fetching ventes:', error);
      return {
        success: false,
        message: `خطأ في جلب المبيعات: ${error}`
      };
    }
  }

  // جلب مبيعات منتج معين
  static async getVentesByArticle(articleId: string): Promise<VentesResult> {
    try {
      const ventes = await prisma.vente.findMany({
        where: { articleId },
        include: {
          article: true
        },
        orderBy: { dateVente: 'desc' }
      });

      return {
        success: true,
        ventes,
        count: ventes.length
      };
    } catch (error) {
      console.error('Error fetching ventes by article:', error);
      return {
        success: false,
        message: `خطأ في جلب مبيعات المنتج: ${error}`
      };
    }
  }

  // جلب مبيعات حسب الفترة الزمنية
  static async getVentesByDateRange(startDate: Date, endDate: Date): Promise<VentesResult> {
    try {
      const ventes = await prisma.vente.findMany({
        where: {
          dateVente: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          article: true
        },
        orderBy: { dateVente: 'desc' }
      });

      return {
        success: true,
        ventes,
        count: ventes.length
      };
    } catch (error) {
      console.error('Error fetching ventes by date range:', error);
      return {
        success: false,
        message: `خطأ في جلب المبيعات حسب الفترة: ${error}`
      };
    }
  }

  // تحديث عملية بيع
  static async updateVente(id: string, data: VenteUpdateInput): Promise<VenteResult> {
    try {
      const existingVente = await prisma.vente.findUnique({
        where: { id }
      });

      if (!existingVente) {
        return {
          success: false,
          message: "عملية البيع غير موجودة"
        };
      }

      const vente = await prisma.vente.update({
        where: { id },
        data
      });

      return {
        success: true,
        vente,
        message: "تم تحديث عملية البيع بنجاح"
      };
    } catch (error) {
      console.error('Error updating vente:', error);
      return {
        success: false,
        message: `خطأ في تحديث عملية البيع: ${error}`
      };
    }
  }

  // حذف عملية بيع
  static async deleteVente(id: string): Promise<VenteResult> {
    try {
      const existingVente = await prisma.vente.findUnique({
        where: { id }
      });

      if (!existingVente) {
        return {
          success: false,
          message: "عملية البيع غير موجودة"
        };
      }

      // إعادة الكمية للمنتج
      const article = await prisma.article.findUnique({
        where: { id: existingVente.articleId }
      });

      if (article) {
        await prisma.article.update({
          where: { id: existingVente.articleId },
          data: { 
            quantite: article.quantite + existingVente.quantiteVendue 
          }
        });
      }

      await prisma.vente.delete({
        where: { id }
      });

      return {
        success: true,
        message: "تم حذف عملية البيع بنجاح"
      };
    } catch (error) {
      console.error('Error deleting vente:', error);
      return {
        success: false,
        message: `خطأ في حذف عملية البيع: ${error}`
      };
    }
  }

  // جلب إحصائيات المبيعات
  static async getSalesStats(): Promise<{ success: boolean; stats?: SalesStats; message?: string }> {
    try {
      const ventes = await prisma.vente.findMany();
      const articles = await prisma.article.findMany();

      const totalSales = ventes.length;
      const totalRevenue = ventes.reduce((sum, vente) => sum + vente.prixTotal, 0);
      const totalQuantity = ventes.reduce((sum, vente) => sum + vente.quantiteVendue, 0);
      const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

      // حساب المبيعات الشهرية
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyVentes = ventes.filter(vente => vente.dateVente >= startOfMonth);
      const monthlySales = monthlyVentes.length;
      const monthlyRevenue = monthlyVentes.reduce((sum, vente) => sum + vente.prixTotal, 0);

      // حساب المنتجات الأكثر مبيعاً
      const productStats = new Map<string, ProductStats>();
      
      ventes.forEach(vente => {
        const existing = productStats.get(vente.articleId);
        if (existing) {
          existing.totalQuantity += vente.quantiteVendue;
          existing.totalRevenue += vente.prixTotal;
          existing.saleCount += 1;
        } else {
          productStats.set(vente.articleId, {
            articleId: vente.articleId,
            articleTitle: vente.articleTitle,
            totalQuantity: vente.quantiteVendue,
            totalRevenue: vente.prixTotal,
            saleCount: 1
          });
        }
      });

      const productStatsArray = Array.from(productStats.values());
      const mostSoldProduct = productStatsArray.length > 0 
        ? productStatsArray.reduce((max, current) => 
            current.totalQuantity > max.totalQuantity ? current : max
          )
        : null;

      const leastSoldProduct = productStatsArray.length > 0
        ? productStatsArray.reduce((min, current) => 
            current.totalQuantity < min.totalQuantity ? current : min
          )
        : null;

      const highestRevenueProduct = productStatsArray.length > 0
        ? productStatsArray.reduce((max, current) => 
            current.totalRevenue > max.totalRevenue ? current : max
          )
        : null;

      const stats: SalesStats = {
        totalSales,
        totalRevenue,
        totalQuantity,
        averagePrice,
        monthlySales,
        monthlyRevenue,
        mostSoldProduct,
        leastSoldProduct,
        highestRevenueProduct,
        monthlyProductCount: productStatsArray.length
      };

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error calculating sales stats:', error);
      return {
        success: false,
        message: `خطأ في حساب إحصائيات المبيعات: ${error}`
      };
    }
  }

  // جلب التقرير الشهري
  static async getMonthlyReport(month: number, year: number): Promise<{ success: boolean; report?: MonthlyReport; message?: string }> {
    try {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0, 23, 59, 59);

      const ventes = await prisma.vente.findMany({
        where: {
          dateVente: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        }
      });

      const totalSales = ventes.length;
      const totalRevenue = ventes.reduce((sum, vente) => sum + vente.prixTotal, 0);
      const totalQuantity = ventes.reduce((sum, vente) => sum + vente.quantiteVendue, 0);

      // حساب أفضل المنتجات
      const productStats = new Map<string, ProductStats>();
      
      ventes.forEach(vente => {
        const existing = productStats.get(vente.articleId);
        if (existing) {
          existing.totalQuantity += vente.quantiteVendue;
          existing.totalRevenue += vente.prixTotal;
          existing.saleCount += 1;
        } else {
          productStats.set(vente.articleId, {
            articleId: vente.articleId,
            articleTitle: vente.articleTitle,
            totalQuantity: vente.quantiteVendue,
            totalRevenue: vente.prixTotal,
            saleCount: 1
          });
        }
      });

      const topProducts = Array.from(productStats.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);

      const report: MonthlyReport = {
        month: `${year}-${month.toString().padStart(2, '0')}`,
        totalSales,
        totalRevenue,
        totalQuantity,
        topProducts
      };

      return {
        success: true,
        report
      };
    } catch (error) {
      console.error('Error generating monthly report:', error);
      return {
        success: false,
        message: `خطأ في إنشاء التقرير الشهري: ${error}`
      };
    }
  }
}
