"use client";
import { Edit, Trash2, Plus } from "lucide-react";

interface Article {
  id: string;
  image: string;
  title: string;
  description: string;
  quantity: number;
  purchasePrice: number;
  reference: string;
}

interface Sale {
  id: string;
  article: string;
  date: string;
  price: number;
  quantity: number;
}

interface ArticlesTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ArticlesTable({ articles, onEdit, onDelete, onAdd }: ArticlesTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 font-cairo">المنتجات</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
                     <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">الصورة</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">العنوان</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">الوصف</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">الكمية</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">سعر الشراء</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">المرجع</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">الإجراءات</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
             {articles.map((article) => (
               <tr key={article.id} className="hover:bg-gray-50 transition-colors duration-200">
                 <td className="px-6 py-4 text-left">
                   <img
                     src={article.image}
                     alt={article.title}
                     className="w-12 h-12 rounded-lg object-cover"
                   />
                 </td>
                 <td className="px-6 py-4 font-cairo text-sm text-gray-900 text-left">{article.title}</td>
                 <td className="px-6 py-4 font-cairo text-sm text-gray-600 max-w-xs truncate text-left">
                   {article.description}
                 </td>
                 <td className="px-6 py-4 text-left">
                   <span className={`px-2 py-1 rounded-full text-xs font-cairo ${
                     article.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                   }`}>
                     {article.quantity}
                   </span>
                 </td>
                 <td className="px-6 py-4 font-cairo text-sm text-gray-900 text-left">{article.purchasePrice} درهم</td>
                 <td className="px-6 py-4 font-cairo text-sm text-gray-600 text-left">{article.reference}</td>
                 <td className="px-6 py-4 text-left">
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => onEdit(article)}
                       className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                     >
                       <Edit className="w-4 h-4" />
                     </button>
                     <button
                       onClick={() => onDelete(article.id)}
                       className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}

interface SalesTableProps {
  sales: Array<{
    id: string;
    articleTitle: string;
    date: string;
    price: number;
    quantity: number;
    totalAmount: number;
  }>;
  onEdit: (sale: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function SalesTable({ sales, onEdit, onDelete, onAdd }: SalesTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 font-cairo">المبيعات</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200 font-cairo"
        >
          <Plus className="w-4 h-4" />
          إضافة عملية بيع
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
                     <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">المنتج</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">التاريخ</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">السعر</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">الكمية</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">الإجمالي</th>
               <th className="px-6 py-3 text-right font-cairo text-sm font-semibold text-gray-900">الإجراءات</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-200">
             {sales.map((sale) => (
               <tr key={sale.id} className="hover:bg-gray-50 transition-colors duration-200">
                 <td className="px-6 py-4 font-cairo text-sm text-gray-900 text-left">{sale.articleTitle}</td>
                 <td className="px-6 py-4 font-cairo text-sm text-gray-600 text-left">{sale.date}</td>
                 <td className="px-6 py-4 font-cairo text-sm text-gray-900 text-left">{sale.price} درهم</td>
                 <td className="px-6 py-4 font-cairo text-sm text-gray-900 text-left">{sale.quantity}</td>
                 <td className="px-6 py-4 font-cairo text-sm font-semibold text-green-600 text-left">
                   {sale.totalAmount} درهم
                 </td>
                 <td className="px-6 py-4 text-left">
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => onEdit(sale)}
                       className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                     >
                       <Edit className="w-4 h-4" />
                     </button>
                     <button
                       onClick={() => onDelete(sale.id)}
                       className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
