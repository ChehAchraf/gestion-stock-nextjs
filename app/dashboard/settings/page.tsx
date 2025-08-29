"use client";
import Settings from "../components/Settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-cairo mb-2">الإعدادات</h1>
        <p className="text-gray-600 font-cairo">إدارة إعدادات الحساب والتطبيق</p>
      </div>

      <Settings />
    </div>
  );
}
