'use client';
import PackagesSection from '@/components/homepage/PackagesSection';

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-[#1E0B40] relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <PackagesSection />
    </div>
  );
}