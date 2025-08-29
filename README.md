# نظام إدارة المخزون - Next.js + Convex

نظام إدارة مخزون متكامل مبني باستخدام Next.js و Convex مع واجهة مستخدم حديثة ومتجاوبة.

## 🚀 الميزات

### ✅ **إدارة المقالات**
- إضافة مقالات جديدة مع صور
- تعديل وحذف المقالات
- البحث في المقالات
- عرض إحصائيات المخزون

### ✅ **قارئ الباركود**
- قراءة الباركود من الكاميرا مباشرة
- رفع صور الباركود
- استخراج تلقائي للكود
- إدخال يدوي كبديل

### ✅ **لوحة التحكم**
- إحصائيات شاملة للمخزون
- عرض المقالات منخفضة المخزون
- تتبع القيم والأرباح

### ✅ **التصميم**
- واجهة عربية بالكامل
- تصميم متجاوب (موبايل + ديسكتوب)
- خط Cairo الجميل
- ألوان هادئة ومريحة للعين

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (قاعدة بيانات حقيقية)
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Barcode Reading**: @zxing/library
- **Charts**: Recharts

## 📦 التثبيت والتشغيل

### 1. تثبيت المتطلبات
```bash
npm install
```

### 2. إعداد Convex
```bash
# تسجيل الدخول إلى Convex
npx convex auth

# إنشاء مشروع جديد
npx convex dev
```

### 3. إعداد متغيرات البيئة
أنشئ ملف `.env.local` وأضف:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

### 4. تطبيق مخطط قاعدة البيانات
```bash
npx convex deploy
```

### 5. استيراد البيانات الأولية (اختياري)
```bash
npx convex import --table articles convex/sampleData.json
```

### 6. تشغيل التطبيق
```bash
npm run dev
```

## 📊 قاعدة البيانات

### جدول `articles`
```typescript
{
  _id: Id<"articles">,           // معرف فريد
  titre: string,                 // عنوان المقال
  description: string,           // وصف المقال
  photo?: string,                // رابط الصورة
  prix_achat: number,            // سعر الشراء
  quantite: number,              // الكمية المتوفرة
  reference: string,             // مرجع المنتج
  createdAt: number,             // تاريخ الإنشاء
  updatedAt: number,             // تاريخ آخر تحديث
}
```

## 🎯 كيفية الاستخدام

### إضافة مقال جديد
1. اذهب إلى صفحة "المقالات"
2. اضغط على "إضافة منتج جديد"
3. املأ البيانات المطلوبة
4. يمكنك رفع صورة أو استخدام قارئ الباركود
5. اضغط "إضافة المنتج"

### البحث في المقالات
1. استخدم شريط البحث في أعلى صفحة المقالات
2. اكتب أي كلمة في العنوان أو الوصف أو المرجع
3. ستظهر النتائج المطابقة فوراً

### قراءة الباركود
1. في نموذج إضافة المنتج، اختر "رفع باركود"
2. اضغط "استخدام الكاميرا"
3. ضع الباركود داخل الإطار الأزرق
4. سيتم قراءة الكود تلقائياً

## 📁 هيكل المشروع

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # صفحات الداشبورد
│   │   ├── components/    # مكونات الداشبورد
│   │   └── pages/        # صفحات مختلفة
│   ├── components/        # مكونات الصفحة الرئيسية
│   └── globals.css       # الأنماط العامة
├── convex/               # Convex Backend
│   ├── schema.ts         # مخطط قاعدة البيانات
│   ├── articles.ts       # وظائف المقالات
│   └── sampleData.json   # بيانات أولية
├── lib/                  # مكتبات مساعدة
│   ├── hooks/           # React Hooks
│   ├── types/           # أنواع TypeScript
│   └── examples/        # أمثلة الاستخدام
└── public/              # الملفات العامة
```

## 🔧 الأوامر المفيدة

```bash
# تشغيل Convex في وضع التطوير
npx convex dev

# تطبيق التغييرات على قاعدة البيانات
npx convex deploy

# استيراد بيانات
npx convex import --table articles convex/sampleData.json

# تصدير بيانات
npx convex export --table articles

# إنشاء أنواع TypeScript
npx convex codegen
```

## 🎨 التخصيص

### تغيير الألوان
يمكنك تخصيص الألوان في ملف `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    }
  }
}
```

### إضافة حقول جديدة
1. حدث `convex/schema.ts`
2. حدث `convex/articles.ts`
3. حدث `lib/types/articles.ts`
4. حدث المكونات المعنية

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في الاتصال بـ Convex**
   - تأكد من تشغيل `npx convex dev`
   - تحقق من `NEXT_PUBLIC_CONVEX_URL`

2. **خطأ في المخطط**
   - تأكد من تطبيق المخطط: `npx convex deploy`

3. **خطأ في قراءة الباركود**
   - تأكد من إعطاء إذن الكاميرا
   - تأكد من أن الباركود واضح ومضاء

4. **خطأ في Clerk**
   - تحقق من مفاتيح Clerk في `.env.local`

## 📈 التطوير المستقبلي

- [ ] نظام المبيعات
- [ ] تقارير مفصلة
- [ ] إشعارات المخزون المنخفض
- [ ] تصدير البيانات
- [ ] نظام المستخدمين والصلاحيات
- [ ] تطبيق موبايل

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يمكنك:
- فتح Issue في GitHub
- التواصل عبر البريد الإلكتروني
- مراجعة الوثائق في مجلد `convex/README.md`
