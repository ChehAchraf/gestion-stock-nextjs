// أنواع قاعدة البيانات الجديدة مع Prisma

export interface Article {
  id: string;
  titre: string;
  description: string;
  photo?: string | null;
  prix_achat: number;
  quantite: number;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vente {
  id: string;
  articleId: string;
  articleTitle: string;
  quantiteVendue: number;
  prixTotal: number;
  dateVente: Date;
  createdAt: Date;
  updatedAt: Date;
}

// أنواع الإدخال
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

export interface VenteInput {
  articleId: string;
  articleTitle: string;
  quantiteVendue: number;
  prixTotal: number;
  dateVente: Date;
}

export interface VenteUpdateInput {
  articleId?: string;
  articleTitle?: string;
  quantiteVendue?: number;
  prixTotal?: number;
  dateVente?: Date;
}

// أنواع النتائج
export interface ApiResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface ArticlesResult extends ApiResult {
  articles?: Article[];
  count?: number;
}

export interface ArticleResult extends ApiResult {
  article?: Article | null;
}

export interface VentesResult extends ApiResult {
  ventes?: Vente[];
  count?: number;
}

export interface VenteResult extends ApiResult {
  vente?: Vente | null;
}

// أنواع الإحصائيات
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

export interface ProductStats {
  articleId: string;
  articleTitle: string;
  totalQuantity: number;
  totalRevenue: number;
  saleCount: number;
}

export interface MonthlyReport {
  month: string;
  totalSales: number;
  totalRevenue: number;
  totalQuantity: number;
  topProducts: ProductStats[];
}
