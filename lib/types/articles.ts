import { Id } from "../../convex/_generated/dataModel";

// نوع المقال الأساسي
export interface Article {
  _id: Id<"articles">;
  titre: string;
  description: string;
  photo?: string;
  prix_achat: number;
  quantite: number;
  reference: string;
  createdAt?: number;
  updatedAt?: number;
}

// نوع إدخال مقال جديد
export interface ArticleInput {
  titre: string;
  description: string;
  photo?: string;
  prix_achat: number;
  quantite: number;
  reference: string;
}

// نوع تحديث مقال
export interface ArticleUpdateInput {
  titre?: string;
  description?: string;
  photo?: string;
  prix_achat?: number;
  quantite?: number;
  reference?: string;
}

// نوع إحصائيات المقالات
export interface ArticlesStats {
  totalArticles: number;
  totalValue: number;
  lowStockCount: number;
  totalQuantity: number;
  averagePrice: number;
}

// نوع نتيجة API
export interface ApiResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// نوع نتيجة إضافة مقال
export interface AddArticleResult extends ApiResult {
  articleId?: Id<"articles">;
}

// نوع نتيجة جلب المقالات
export interface GetArticlesResult extends ApiResult {
  articles: Article[];
  count: number;
}

// نوع نتيجة جلب مقال واحد
export interface GetArticleResult extends ApiResult {
  article: Article | null;
}

// نوع نتيجة الإحصائيات
export interface GetStatsResult extends ApiResult {
  stats: ArticlesStats;
}
