import { Package, TrendingUp } from "lucide-react";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4 lg:p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="bg-blue-600 p-1.5 lg:p-2 rounded-lg">
            <Package className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg lg:text-xl font-bold text-gray-800 font-cairo">تطبيق المخزون</h1>
            <p className="text-xs lg:text-sm text-gray-600 font-cairo">نظام إدارة المخزون الذكي</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-sm font-bold text-gray-800 font-cairo">تطبيق المخزون</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
          <span className="text-xs lg:text-sm text-gray-600 font-cairo hidden sm:inline">إدارة ذكية</span>
        </div>
      </div>
    </header>
  );
}
