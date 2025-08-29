import Header from "./Header";
import HeroSection from "./HeroSection";
import LoginSection from "./LoginSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-16 lg:pt-0">
        {/* Left Side - Hero Section */}
        <div className="flex-1 flex items-center justify-center relative order-2 lg:order-1 min-h-screen lg:min-h-full">
          <HeroSection />
        </div>
        
        {/* Right Side - Login Section */}
        <div className="order-1 lg:order-2 flex-1">
          <LoginSection />
        </div>
      </div>
    </div>
  );
}
