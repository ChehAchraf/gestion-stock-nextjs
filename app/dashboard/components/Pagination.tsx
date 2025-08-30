"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  itemName: string; // اسم العنصر (منتج، عملية بيع، إلخ)
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  itemName
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="text-sm text-gray-600 font-cairo">
        عرض {startIndex + 1} إلى {Math.min(endIndex, totalItems)} من {totalItems} {itemName}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-cairo rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
        >
          <ChevronRight className="w-4 h-4" />
          السابق
        </button>
        
        <div className="flex items-center gap-1">
          {/* عرض أزرار الصفحات مع منطق ذكي */}
          {(() => {
            const pages = [];
            const maxVisiblePages = 5;
            
            if (totalPages <= maxVisiblePages) {
              // إذا كان عدد الصفحات قليل، اعرض كل الصفحات
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
              }
            } else {
              // منطق ذكي لعرض الصفحات
              if (currentPage <= 3) {
                // في البداية
                for (let i = 1; i <= 4; i++) {
                  pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
              } else if (currentPage >= totalPages - 2) {
                // في النهاية
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // في الوسط
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                  pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
              }
            }
            
            return pages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={typeof page !== 'number'}
                className={`px-3 py-2 text-sm font-cairo rounded-lg transition-colors duration-200 ${
                  typeof page === 'number'
                    ? currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                    : 'text-gray-400 cursor-default'
                }`}
              >
                {page}
              </button>
            ));
          })()}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm font-cairo rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
        >
          التالي
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
