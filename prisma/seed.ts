import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إضافة البيانات الأولية...');

  // إضافة منتجات أولية
  const articles = await Promise.all([
    prisma.article.upsert({
      where: { reference: 'REF001' },
      update: {},
      create: {
        titre: 'لابتوب HP Pavilion',
        description: 'لابتوب HP Pavilion مع معالج Intel Core i5 وذاكرة 8GB',
        photo: 'https://via.placeholder.com/300x200?text=HP+Laptop',
        prix_achat: 3500,
        quantite: 10,
        reference: 'REF001',
      },
    }),
    prisma.article.upsert({
      where: { reference: 'REF002' },
      update: {},
      create: {
        titre: 'هاتف Samsung Galaxy',
        description: 'هاتف Samsung Galaxy S21 مع كاميرا 64MP',
        photo: 'https://via.placeholder.com/300x200?text=Samsung+Phone',
        prix_achat: 2800,
        quantite: 15,
        reference: 'REF002',
      },
    }),
    prisma.article.upsert({
      where: { reference: 'REF003' },
      update: {},
      create: {
        titre: 'سماعات AirPods Pro',
        description: 'سماعات Apple AirPods Pro مع إلغاء الضوضاء',
        photo: 'https://via.placeholder.com/300x200?text=AirPods+Pro',
        prix_achat: 1200,
        quantite: 25,
        reference: 'REF003',
      },
    }),
    prisma.article.upsert({
      where: { reference: 'REF004' },
      update: {},
      create: {
        titre: 'ساعة Apple Watch',
        description: 'ساعة Apple Watch Series 7 مع GPS',
        photo: 'https://via.placeholder.com/300x200?text=Apple+Watch',
        prix_achat: 1800,
        quantite: 8,
        reference: 'REF004',
      },
    }),
    prisma.article.upsert({
      where: { reference: 'REF005' },
      update: {},
      create: {
        titre: 'تابلت iPad Pro',
        description: 'تابلت Apple iPad Pro مع قلم Apple Pencil',
        photo: 'https://via.placeholder.com/300x200?text=iPad+Pro',
        prix_achat: 4200,
        quantite: 5,
        reference: 'REF005',
      },
    }),
  ]);

  console.log(`✅ تم إضافة ${articles.length} منتج`);

  // إضافة مبيعات أولية
  const ventes = await Promise.all([
    prisma.vente.create({
      data: {
        articleId: articles[0].id,
        articleTitle: articles[0].titre,
        quantiteVendue: 2,
        prixTotal: 8000,
        dateVente: new Date('2024-01-15'),
      },
    }),
    prisma.vente.create({
      data: {
        articleId: articles[1].id,
        articleTitle: articles[1].titre,
        quantiteVendue: 1,
        prixTotal: 3200,
        dateVente: new Date('2024-01-16'),
      },
    }),
    prisma.vente.create({
      data: {
        articleId: articles[2].id,
        articleTitle: articles[2].titre,
        quantiteVendue: 3,
        prixTotal: 4200,
        dateVente: new Date('2024-01-17'),
      },
    }),
    prisma.vente.create({
      data: {
        articleId: articles[3].id,
        articleTitle: articles[3].titre,
        quantiteVendue: 1,
        prixTotal: 2200,
        dateVente: new Date('2024-01-18'),
      },
    }),
    prisma.vente.create({
      data: {
        articleId: articles[4].id,
        articleTitle: articles[4].titre,
        quantiteVendue: 1,
        prixTotal: 5200,
        dateVente: new Date('2024-01-19'),
      },
    }),
  ]);

  console.log(`✅ تم إضافة ${ventes.length} عملية بيع`);

  console.log('🎉 تم إكمال إضافة البيانات الأولية بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة البيانات الأولية:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
