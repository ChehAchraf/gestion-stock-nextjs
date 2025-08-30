# تحويل المشروع من Convex إلى SQLite

## نظرة عامة

تم تحويل مشروع إدارة المخزون من استخدام Convex إلى SQLite مع Prisma ORM، مع الحفاظ على نفس الهيكلة والمودالات.

## التغييرات المطبقة

### 1. إعداد قاعدة البيانات
- ✅ إضافة Prisma ORM مع SQLite
- ✅ إنشاء schema.prisma مع جداول articles و ventes
- ✅ إعداد العلاقات بين الجداول
- ✅ إنشاء Prisma Client

### 2. أنواع البيانات الجديدة
- ✅ إنشاء `lib/types/database.ts` مع جميع الأنواع المطلوبة
- ✅ توافق الأنواع مع Prisma
- ✅ الحفاظ على نفس بنية البيانات

### 3. Service Layer
- ✅ `lib/services/articlesService.ts` - إدارة المنتجات
- ✅ `lib/services/ventesService.ts` - إدارة المبيعات
- ✅ وظائف CRUD كاملة
- ✅ معالجة الأخطاء والتحقق من البيانات

### 4. API Routes
- ✅ `app/api/articles/route.ts` - إدارة المنتجات
- ✅ `app/api/articles/[id]/route.ts` - عمليات المنتج الواحد
- ✅ `app/api/ventes/route.ts` - إدارة المبيعات
- ✅ `app/api/ventes/stats/route.ts` - إحصائيات المبيعات

### 5. Hooks الجديدة
- ✅ `lib/hooks/useArticlesSQLite.ts` - hooks للمنتجات
- ✅ `lib/hooks/useVentesSQLite.ts` - hooks للمبيعات
- ✅ نفس الواجهة البرمجية مع التحديث التلقائي

### 6. تحديث الواجهات
- ✅ تحديث صفحة المنتجات لاستخدام SQLite
- ✅ تحديث صفحة المبيعات لاستخدام SQLite
- ✅ الحفاظ على نظام الصفحات

## الملفات الجديدة

```
prisma/
├── schema.prisma          # تعريف قاعدة البيانات
└── seed.ts               # بيانات أولية للاختبار

lib/
├── prisma.ts             # Prisma Client
├── types/
│   └── database.ts       # أنواع البيانات الجديدة
├── services/
│   ├── articlesService.ts # خدمة المنتجات
│   └── ventesService.ts  # خدمة المبيعات
└── hooks/
    ├── useArticlesSQLite.ts # hooks المنتجات
    └── useVentesSQLite.ts  # hooks المبيعات

app/api/
├── articles/
│   ├── route.ts          # API المنتجات
│   └── [id]/route.ts     # API المنتج الواحد
└── ventes/
    ├── route.ts          # API المبيعات
    └── stats/route.ts    # API الإحصائيات
```

## كيفية الاستخدام

### 1. تثبيت المكتبات
```bash
npm install prisma @prisma/client sqlite3
```

### 2. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة البيانات
npm run db:push

# أو استخدام migrations
npm run db:migrate

# إنشاء Prisma Client
npm run db:generate
```

### 3. إضافة بيانات أولية
```bash
npm run db:seed
```

### 4. تشغيل التطبيق
```bash
npm run dev
```

### 5. فتح Prisma Studio (اختياري)
```bash
npm run db:studio
```

## الميزات المحفوظة

### نظام الصفحات
- ✅ عرض 8 منتجات في كل صفحة
- ✅ عرض 8 مبيعات في كل صفحة
- ✅ أزرار تنقل ذكية
- ✅ إعادة تعيين الصفحة عند البحث

### جدولة المبيعات
- ✅ إضافة عمليات بيع جديدة
- ✅ البحث في المنتجات
- ✅ التحقق من الكمية المتوفرة
- ✅ تحديث المخزون تلقائياً

### إحصائيات متقدمة
- ✅ إحصائيات المبيعات الشاملة
- ✅ المنتجات الأكثر مبيعاً
- ✅ التقرير الشهري
- ✅ حساب قيمة المخزون

## API Endpoints

### المنتجات
- `GET /api/articles` - جلب جميع المنتجات
- `POST /api/articles` - إنشاء منتج جديد
- `GET /api/articles/[id]` - جلب منتج واحد
- `PUT /api/articles/[id]` - تحديث منتج
- `DELETE /api/articles/[id]` - حذف منتج

### المبيعات
- `GET /api/ventes` - جلب جميع المبيعات
- `POST /api/ventes` - إنشاء عملية بيع
- `GET /api/ventes/stats` - إحصائيات المبيعات

## Service Layer Architecture

### ArticlesService
```typescript
class ArticlesService {
  static async createArticle(data: ArticleInput): Promise<ArticleResult>
  static async getArticles(): Promise<ArticlesResult>
  static async getArticleById(id: string): Promise<ArticleResult>
  static async updateArticle(id: string, data: ArticleUpdateInput): Promise<ArticleResult>
  static async deleteArticle(id: string): Promise<ArticleResult>
  static async getLowStockArticles(threshold?: number): Promise<ArticlesResult>
  static async getTotalInventoryValue(): Promise<{ success: boolean; value?: number }>
}
```

### VentesService
```typescript
class VentesService {
  static async createVente(data: VenteInput): Promise<VenteResult>
  static async getVentes(): Promise<VentesResult>
  static async getVentesByArticle(articleId: string): Promise<VentesResult>
  static async getVentesByDateRange(startDate: Date, endDate: Date): Promise<VentesResult>
  static async updateVente(id: string, data: VenteUpdateInput): Promise<VenteResult>
  static async deleteVente(id: string): Promise<VenteResult>
  static async getSalesStats(): Promise<{ success: boolean; stats?: SalesStats }>
  static async getMonthlyReport(month: number, year: number): Promise<{ success: boolean; report?: MonthlyReport }>
}
```

## المزايا الجديدة

### 1. الاستقلالية
- ✅ قاعدة بيانات محلية (SQLite)
- ✅ لا حاجة لاتصال بالإنترنت
- ✅ تحكم كامل في البيانات

### 2. الأداء
- ✅ استعلامات سريعة
- ✅ تخزين محلي
- ✅ استجابة فورية

### 3. المرونة
- ✅ سهولة التطوير
- ✅ إمكانية الترحيل لـ PostgreSQL/MySQL لاحقاً
- ✅ دعم كامل لـ TypeScript

### 4. الأمان
- ✅ بيانات محلية آمنة
- ✅ تحكم كامل في الوصول
- ✅ نسخ احتياطية سهلة

## خطوات التطوير المستقبلية

### 1. إضافة ميزات جديدة
- [ ] نظام المستخدمين والصلاحيات
- [ ] نظام الفئات للمنتجات
- [ ] نظام الموردين
- [ ] نظام التقارير المتقدمة

### 2. تحسينات تقنية
- [ ] إضافة Redis للتخزين المؤقت
- [ ] تحسين الاستعلامات
- [ ] إضافة نظام النسخ الاحتياطية
- [ ] إضافة نظام المراقبة

### 3. واجهة المستخدم
- [ ] إضافة المزيد من الرسوم البيانية
- [ ] تحسين تجربة المستخدم
- [ ] إضافة نظام الإشعارات
- [ ] دعم الأجهزة المحمولة

## استكشاف الأخطاء

### مشاكل شائعة وحلولها

1. **خطأ في Prisma Client**
   ```bash
   npm run db:generate
   ```

2. **خطأ في قاعدة البيانات**
   ```bash
   npm run db:push
   ```

3. **خطأ في البيانات الأولية**
   ```bash
   npm run db:seed
   ```

4. **حذف قاعدة البيانات وإعادة إنشاؤها**
   ```bash
   rm prisma/dev.db
   npm run db:push
   npm run db:seed
   ```

## الخلاصة

تم تحويل المشروع بنجاح من Convex إلى SQLite مع:
- ✅ الحفاظ على جميع الميزات
- ✅ تحسين الأداء
- ✅ زيادة الاستقلالية
- ✅ سهولة التطوير والصيانة
- ✅ إمكانية التوسع المستقبلي

المشروع جاهز للاستخدام والإنتاج مع قاعدة بيانات SQLite محلية.
