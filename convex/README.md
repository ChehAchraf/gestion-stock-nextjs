# خدمات Convex للمقالات

هذا الملف يحتوي على خدمات Convex للتعامل مع جدول "articles" في قاعدة البيانات.

## 📋 المخطط (Schema)

### جدول `articles`
```typescript
{
  _id: Id<"articles">,           // معرف فريد (تولده Convex تلقائياً)
  titre: string,                 // عنوان المقال
  description: string,           // وصف المقال
  photo?: string,                // رابط الصورة (اختياري)
  prix_achat: number,            // سعر الشراء
  quantite: number,              // الكمية المتوفرة
  reference: string,             // مرجع المنتج
  createdAt: number,             // تاريخ الإنشاء
  updatedAt: number,             // تاريخ آخر تحديث
}
```

### الفهارس (Indexes)
- `by_createdAt`: للترتيب حسب تاريخ الإنشاء
- `by_reference`: للبحث حسب المرجع
- `by_quantite`: للبحث حسب الكمية

## 🚀 الوظائف المتاحة

### 1. إضافة مقال جديد
```typescript
const result = await mutation(api.articles.addArticle, {
  titre: "عنوان المقال",
  description: "وصف المقال",
  photo: "رابط الصورة",
  prix_achat: 10.50,
  quantite: 5,
  reference: "REF123"
});
```

### 2. جلب جميع المقالات
```typescript
const result = await query(api.articles.getArticles);
// ترجع: { success: true, articles: [...], count: number }
```

### 3. جلب مقال واحد
```typescript
const result = await query(api.articles.getArticleById, { id: articleId });
// ترجع: { success: true, article: {...} }
```

### 4. تحديث مقال
```typescript
const result = await mutation(api.articles.updateArticle, {
  id: articleId,
  titre: "العنوان الجديد",
  quantite: 10
});
```

### 5. حذف مقال
```typescript
const result = await mutation(api.articles.deleteArticle, { id: articleId });
```

## 🎣 React Hooks

### استخدام Hooks في المكونات

```typescript
import { useArticlesManager } from "@/lib/hooks/useArticles";

function MyComponent() {
  const { 
    articles, 
    stats, 
    isLoading, 
    addArticle, 
    updateArticle, 
    deleteArticle 
  } = useArticlesManager();

  // استخدام البيانات والوظائف
}
```

### Hooks المتاحة

#### `useArticles()`
```typescript
const { articles, count, isLoading, error } = useArticles();
```

#### `useArticle(id)`
```typescript
const { article, isLoading, error, message } = useArticle(articleId);
```

#### `useLowStockArticles(minQuantity)`
```typescript
const { articles, count, isLoading } = useLowStockArticles(2);
```

#### `useSearchArticles(searchTerm, limit)`
```typescript
const { articles, count, isLoading } = useSearchArticles("بحث", 10);
```

#### `useArticlesStats()`
```typescript
const { stats, isLoading } = useArticlesStats();
```

#### `useAddArticle()`
```typescript
const { addArticle } = useAddArticle();
const result = await addArticle(articleData);
```

#### `useUpdateArticle()`
```typescript
const { updateArticle } = useUpdateArticle();
const result = await updateArticle(id, updateData);
```

#### `useDeleteArticle()`
```typescript
const { deleteArticle } = useDeleteArticle();
const result = await deleteArticle(id);
```

#### `useArticlesManager()`
```typescript
const { 
  articles, 
  stats, 
  isLoading, 
  addArticle, 
  updateArticle, 
  deleteArticle,
  getArticleById,
  getLowStockArticles,
  getTotalValue
} = useArticlesManager();
```

## 📊 الوظائف الإضافية

### جلب المقالات منخفضة المخزون
```typescript
const result = await query(api.articles.getLowStockArticles, { minQuantity: 2 });
```

### البحث في المقالات
```typescript
const result = await query(api.articles.searchArticles, { 
  searchTerm: "كلمة البحث", 
  limit: 20 
});
```

### إحصائيات المقالات
```typescript
const result = await query(api.articles.getArticlesStats);
// ترجع: { totalArticles, totalValue, lowStockCount, totalQuantity, averagePrice }
```

## 🔧 الإعداد

### 1. تشغيل Convex
```bash
npx convex dev
```

### 2. استيراد البيانات الأولية (اختياري)
```bash
npx convex import --table articles convex/sampleData.json
```

### 3. استخدام في المكونات
```typescript
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { api } from "../convex/_generated/api";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function App() {
  return (
    <ConvexProvider client={convex}>
      {/* مكونات التطبيق */}
    </ConvexProvider>
  );
}
```

## 📝 أمثلة الاستخدام

### إضافة مقال جديد
```typescript
const handleAddArticle = async () => {
  const result = await addArticle({
    titre: "منتج جديد",
    description: "وصف المنتج",
    prix_achat: 15.99,
    quantite: 10,
    reference: "PROD001"
  });
  
  if (result.success) {
    console.log("تم إضافة المقال بنجاح");
  }
};
```

### عرض قائمة المقالات
```typescript
function ArticlesList() {
  const { articles, isLoading } = useArticlesManager();
  
  if (isLoading) return <div>جاري التحميل...</div>;
  
  return (
    <div>
      {articles.map(article => (
        <div key={article._id}>
          <h3>{article.titre}</h3>
          <p>{article.description}</p>
          <p>السعر: {article.prix_achat} د.ك</p>
          <p>الكمية: {article.quantite}</p>
        </div>
      ))}
    </div>
  );
}
```

### عرض الإحصائيات
```typescript
function Stats() {
  const { stats } = useArticlesManager();
  
  return (
    <div>
      <p>إجمالي المقالات: {stats.totalArticles}</p>
      <p>القيمة الإجمالية: {stats.totalValue} د.ك</p>
      <p>منخفضة المخزون: {stats.lowStockCount}</p>
    </div>
  );
}
```

## 🛠️ استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الاتصال بـ Convex**
   - تأكد من تشغيل `npx convex dev`
   - تحقق من `NEXT_PUBLIC_CONVEX_URL`

2. **خطأ في المخطط**
   - تأكد من تطبيق المخطط: `npx convex deploy`

3. **خطأ في الأنواع**
   - تأكد من تشغيل `npx convex codegen`

### رسائل الخطأ

- `"المقال غير موجود"`: المقال المطلوب غير موجود في قاعدة البيانات
- `"حدث خطأ في إضافة المقال"`: خطأ في عملية الإضافة
- `"حدث خطأ في تحديث المقال"`: خطأ في عملية التحديث
- `"حدث خطأ في حذف المقال"`: خطأ في عملية الحذف

## 📚 الملفات المهمة

- `convex/schema.ts`: مخطط قاعدة البيانات
- `convex/articles.ts`: وظائف Convex للمقالات
- `lib/hooks/useArticles.ts`: React hooks
- `lib/types/articles.ts`: أنواع TypeScript
- `lib/examples/articlesUsage.tsx`: أمثلة الاستخدام
