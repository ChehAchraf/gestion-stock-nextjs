# دليل حل المشاكل - نظام إدارة المخزون

## المشاكل الشائعة وحلولها

### 1. مشكلة "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

**السبب:** هذا الخطأ يحدث عندما يقوم API route بإرجاع صفحة HTML بدلاً من JSON.

**الحلول:**

#### أ. مشكلة Prisma Client
```bash
# تأكد من تثبيت Prisma
npm install @prisma/client prisma

# إنشاء Prisma client
npm run db:generate

# دفع المخطط إلى قاعدة البيانات
npm run db:push
```

#### ب. مشكلة سياسة التنفيذ في PowerShell
إذا واجهت مشكلة في PowerShell، جرب:
```bash
# تشغيل PowerShell كمسؤول
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# أو استخدم Command Prompt بدلاً من PowerShell
```

#### ج. مشكلة قاعدة البيانات
```bash
# إعادة إنشاء قاعدة البيانات
rm -rf prisma/dev.db
npm run db:push
npm run db:seed
```

### 2. مشكلة "EPERM: operation not permitted"

**السبب:** مشكلة في الصلاحيات عند إنشاء Prisma client.

**الحلول:**

#### أ. إغلاق التطبيقات المفتوحة
- أغلق VS Code أو أي محرر نصوص
- أغلق أي تطبيق يستخدم قاعدة البيانات
- أعد تشغيل الأمر

#### ب. تشغيل كمسؤول
- افتح PowerShell أو Command Prompt كمسؤول
- انتقل إلى مجلد المشروع
- شغل الأوامر

#### ج. حذف node_modules وإعادة التثبيت
```bash
rm -rf node_modules
npm install
npm run db:generate
```

### 3. مشكلة "Cannot find module '@prisma/client'"

**السبب:** Prisma client لم يتم إنشاؤه.

**الحل:**
```bash
npm install @prisma/client
npm run db:generate
```

### 4. مشكلة في API Routes

**التحقق من:**
- تأكد من أن الملفات موجودة في المسارات الصحيحة:
  - `app/api/articles/route.ts`
  - `app/api/articles/[id]/route.ts`
  - `app/api/ventes/route.ts`

- تأكد من أن الخادم يعمل:
```bash
npm run dev
```

- تحقق من console logs في المتصفح والخادم

### 5. مشكلة في قاعدة البيانات

**إعادة إنشاء قاعدة البيانات:**
```bash
# حذف قاعدة البيانات الحالية
rm -rf prisma/dev.db

# دفع المخطط الجديد
npm run db:push

# إضافة بيانات تجريبية
npm run db:seed
```

### 6. مشكلة في TypeScript

**الحل:**
```bash
# إعادة بناء TypeScript
npm run build

# أو حذف cache
rm -rf .next
npm run dev
```

## خطوات التشغيل الكاملة

1. **تثبيت المكتبات:**
```bash
npm install
```

2. **إعداد قاعدة البيانات:**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

3. **تشغيل الخادم:**
```bash
npm run dev
```

4. **فتح المتصفح:**
```
http://localhost:3000
```

## فحص الأخطاء

### في المتصفح:
1. افتح Developer Tools (F12)
2. انتقل إلى Console
3. ابحث عن الأخطاء الحمراء

### في الخادم:
1. انظر إلى terminal حيث يعمل الخادم
2. ابحث عن رسائل الخطأ

### في قاعدة البيانات:
```bash
# فتح Prisma Studio
npm run db:studio
```

## الاتصال بالدعم

إذا استمرت المشكلة، يرجى:
1. نسخ رسالة الخطأ كاملة
2. نسخ محتوى console logs
3. توضيح الخطوات التي أدت إلى المشكلة
