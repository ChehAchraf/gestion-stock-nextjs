"use client";
import { User, Shield, Bell, Palette } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function Settings() {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-cairo">معلومات الحساب</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 font-cairo mb-2">الاسم الكامل</label>
            <input
              type="text"
              value={user?.fullName || ''}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 font-cairo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 font-cairo mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={user?.primaryEmailAddress?.emailAddress || ''}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 font-cairo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 font-cairo mb-2">رقم الهاتف</label>
            <input
              type="tel"
              placeholder="أدخل رقم الهاتف"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-cairo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 font-cairo mb-2">العنوان</label>
            <input
              type="text"
              placeholder="أدخل العنوان"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-cairo"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-cairo">إعدادات الأمان</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-gray-900 font-cairo">المصادقة الثنائية</h4>
              <p className="text-sm text-gray-600 font-cairo">تفعيل المصادقة الثنائية لحسابك</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-cairo">
              تفعيل
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-gray-900 font-cairo">تغيير كلمة المرور</h4>
              <p className="text-sm text-gray-600 font-cairo">تحديث كلمة المرور الخاصة بك</p>
            </div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-cairo">
              تغيير
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-cairo">إعدادات الإشعارات</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 font-cairo">إشعارات المخزون</h4>
              <p className="text-sm text-gray-600 font-cairo">إشعارات عند انخفاض المخزون</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 font-cairo">إشعارات المبيعات</h4>
              <p className="text-sm text-gray-600 font-cairo">إشعارات عند إتمام عملية بيع</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 font-cairo">إشعارات البريد الإلكتروني</h4>
              <p className="text-sm text-gray-600 font-cairo">استلام الإشعارات عبر البريد الإلكتروني</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Palette className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-cairo">إعدادات المظهر</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-blue-500 rounded-xl bg-blue-50 text-blue-700 font-cairo">
            <div className="w-4 h-4 bg-blue-500 rounded-full mb-2"></div>
            فاتح
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 font-cairo">
            <div className="w-4 h-4 bg-gray-600 rounded-full mb-2"></div>
            داكن
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 font-cairo">
            <div className="w-4 h-4 bg-gray-400 rounded-full mb-2"></div>
            تلقائي
          </button>
        </div>
      </div>
    </div>
  );
}
