# دليل الإعداد السريع 🚀

## خطوات سريعة لتشغيل المشروع

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إعداد Convex
```bash
# تسجيل الدخول
npx convex auth

# تشغيل Convex
npx convex dev
```

### 3. إنشاء ملف البيئة
أنشئ ملف `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CONVEX_URL=https://...
```

### 4. تطبيق المخطط
```bash
npx convex deploy
```

### 5. استيراد البيانات الأولية
```bash
npx convex import --table articles convex/sampleData.json
```

### 6. تشغيل التطبيق
```bash
npm run dev
```

## ✅ التحقق من العمل

1. افتح [http://localhost:3000](http://localhost:3000)
2. سجل الدخول عبر Clerk
3. اذهب إلى الداشبورد
4. جرب إضافة مقال جديد
5. جرب البحث في المقالات
6. جرب قارئ الباركود

## 🔧 أوامر مفيدة

```bash
# إعادة تشغيل Convex
npx convex dev

# تطبيق التغييرات
npx convex deploy

# تصدير البيانات
npx convex export --table articles

# إنشاء أنواع TypeScript
npx convex codegen
```

## 🚨 إذا واجهت مشاكل

1. **خطأ في Convex**: تأكد من تشغيل `npx convex dev`
2. **خطأ في Clerk**: تحقق من مفاتيح Clerk في `.env.local`
3. **خطأ في الكاميرا**: تأكد من إعطاء إذن الكاميرا للمتصفح
4. **خطأ في البيانات**: تأكد من استيراد البيانات الأولية

## 📞 المساعدة

- راجع `README.md` للتفاصيل الكاملة
- راجع `convex/README.md` لوثائق Convex
- افتح Issue في GitHub للمشاكل
