import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  articles: defineTable({
    titre: v.string(),
    description: v.string(),
    photo: v.optional(v.string()),
    prix_achat: v.number(),
    quantite: v.number(),
    reference: v.string(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_reference", ["reference"])
    .index("by_quantite", ["quantite"]),
    
  sales: defineTable({
    articleId: v.id("articles"), // ربط بالمقال
    articleTitle: v.string(), // عنوان المقال (للعرض السريع)
    quantity: v.number(), // الكمية المباعة
    price: v.number(), // سعر البيع
    totalAmount: v.number(), // إجمالي المبلغ
    saleDate: v.number(), // تاريخ البيع
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_saleDate", ["saleDate"])
    .index("by_articleId", ["articleId"])
    .index("by_createdAt", ["createdAt"]),
});
