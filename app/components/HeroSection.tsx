import { CheckCircle, BarChart3, Shield, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-8 lg:py-0">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 font-cairo leading-tight text-center lg:text-right">
            مرحباً بك في{" "}
            <span className="text-blue-600">تطبيق تتبع حالة المخزون</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 lg:mb-8 font-cairo leading-relaxed text-center lg:text-right">
            نظام متطور لإدارة المخزون بذكاء، يساعدك على تتبع المنتجات وإدارة المخزون بكفاءة عالية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="flex items-start gap-3 p-3 lg:p-0">
            <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 font-cairo text-sm lg:text-base">تتبع دقيق</h3>
              <p className="text-gray-600 text-xs lg:text-sm font-cairo">مراقبة مستمرة لحالة المخزون</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 lg:p-0">
            <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
              <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 font-cairo text-sm lg:text-base">تقارير ذكية</h3>
              <p className="text-gray-600 text-xs lg:text-sm font-cairo">تحليلات متقدمة وإحصائيات مفصلة</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 lg:p-0">
            <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 font-cairo text-sm lg:text-base">أمان عالي</h3>
              <p className="text-gray-600 text-xs lg:text-sm font-cairo">حماية متقدمة لبياناتك</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 lg:p-0">
            <div className="bg-orange-100 p-2 rounded-lg flex-shrink-0">
              <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1 font-cairo text-sm lg:text-base">سرعة في الأداء</h3>
              <p className="text-gray-600 text-xs lg:text-sm font-cairo">واجهة سريعة وسهلة الاستخدام</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:p-6 rounded-xl border border-blue-100">
          <p className="text-gray-700 font-cairo text-center text-sm lg:text-base">
            <span className="font-semibold">ابدأ الآن</span> واستمتع بتجربة إدارة مخزون احترافية ومتطورة
          </p>
        </div>
      </div>
    </div>
  );
}
