# إصلاح مشاكل Convex 🔧

## المشكلة
خطأ في مخطط قاعدة البيانات: البيانات الموجودة لا تحتوي على الحقول المطلوبة `createdAt` و `updatedAt`.

## الحل

### 1. حذف البيانات الموجودة
```bash
# حذف جميع البيانات من جدول articles
npx convex export --table articles --delete
```

### 2. تطبيق المخطط المحدث
```bash
# تطبيق المخطط الجديد
npx convex deploy
```

### 3. استيراد البيانات الجديدة
```bash
# استيراد البيانات المحدثة
npx convex import --table articles convex/sampleData.json
```

### 4. التحقق من العمل
```bash
# تشغيل Convex
npx convex dev
```

## أوامر مفيدة

```bash
# عرض البيانات الموجودة
npx convex export --table articles

# حذف جدول كامل
npx convex export --table articles --delete

# إعادة إنشاء الجدول
npx convex deploy

# استيراد بيانات جديدة
npx convex import --table articles convex/sampleData.json
```

## إذا استمرت المشكلة

1. **إعادة تشغيل Convex:**
   ```bash
   # إيقاف Convex (Ctrl+C)
   # ثم تشغيله مرة أخرى
   npx convex dev
   ```

2. **مسح الكاش:**
   ```bash
   # حذف مجلد _generated
   rm -rf convex/_generated
   
   # إعادة إنشاء الأنواع
   npx convex codegen
   ```

3. **إعادة تشغيل التطبيق:**
   ```bash
   npm run dev
   ```

## التحقق من الإصلاح

1. افتح [http://localhost:3000](http://localhost:3000)
2. سجل الدخول
3. اذهب إلى صفحة المقالات
4. تأكد من ظهور البيانات
5. جرب إضافة مقال جديد
