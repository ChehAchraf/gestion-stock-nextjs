"use client";
import { Home, Package, ShoppingCart, BarChart3, Settings, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "الرئيسية", icon: Home, href: "/dashboard" },
  { name: "المنتجات", icon: Package, href: "/dashboard/articles" },
  { name: "المبيعات", icon: ShoppingCart, href: "/dashboard/sales" },
  { name: "التقارير", icon: BarChart3, href: "/dashboard/reports" },
  { name: "الإعدادات", icon: Settings, href: "/dashboard/settings" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Package className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-cairo">تطبيق المخزون</h1>
          <p className="text-sm text-gray-600 font-cairo">نظام إدارة المخزون</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-cairo text-right transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <SignOutButton>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-cairo text-right text-red-600 hover:bg-red-50 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
