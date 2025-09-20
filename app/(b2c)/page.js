import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedDestinations from '@/components/home/FeaturedDestinations';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import SearchWithCalendar from '@/components/home/SearchWithCalendar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      <SearchWithCalendar />
      <FeaturedDestinations />
       <StatsSection />    {/* // Dubai Tourism License Section */}
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}