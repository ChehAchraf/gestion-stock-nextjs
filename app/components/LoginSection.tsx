"use client";
import { RedirectToSignIn, SignInButton, useUser } from "@clerk/nextjs";
import { LogIn, ArrowLeft } from "lucide-react";

export default function LoginSection() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    // المستخدم مسجّل → نوجهو للداشبورد
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
    return null; // ما بغيناش نعرضو حتى شي حاجة
  }
    
  return (
    <div className="flex-1 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center min-h-screen lg:min-h-full">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 lg:top-20 lg:left-20 w-16 h-16 lg:w-32 lg:h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 lg:bottom-20 lg:right-20 w-12 h-12 lg:w-24 lg:h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 lg:w-16 lg:h-16 bg-white rounded-full"></div>
      </div>

      {/* Login Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-8">
        <div className="mb-6 lg:mb-8">
          <div className="bg-white/20 backdrop-blur-sm p-4 lg:p-6 rounded-2xl inline-block mb-4 lg:mb-6">
            <LogIn  className="w-8 h-8 lg:w-12 lg:h-12 text-white mx-auto" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 lg:mb-4 font-cairo">
            تسجيل الدخول
          </h2>
          
          <p className="text-blue-100 text-sm sm:text-lg mb-6 lg:mb-8 font-cairo max-w-md mx-auto">
            سجل دخولك للوصول إلى لوحة التحكم وإدارة مخزونك بكل سهولة
          </p>
        </div>

        <SignInButton  mode="modal" >
          <button className="group bg-white text-blue-600 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-cairo flex items-center gap-2 lg:gap-3 mx-auto">
            <span>ابدأ الآن</span>
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </SignInButton>

        <div className="mt-6 lg:mt-8 text-blue-100 text-xs lg:text-sm font-cairo">
          <p>آمن ومحمي بـ 256-bit encryption</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-blue-200 text-xs font-cairo">
        <p className="hidden sm:block">نظام إدارة المخزون المتطور</p>
      </div>
      
      <div className="absolute top-4 right-4 lg:top-8 lg:right-8 text-blue-200 text-xs font-cairo">
        <p className="hidden sm:block">2024 © جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}
