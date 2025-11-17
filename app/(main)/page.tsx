import HeroSection from "@/components/sections/hero-section";
import BannerComponent from "@/components/sections/banner";
import TestimonialsComponent from "@/components/sections/testimonials";

const HomePage = () => {
  return (
    <main className="min-h-screen">
      {/* Banners */}
      <BannerComponent position="top" />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Testimonials Section */}
      <TestimonialsComponent 
        title="What Our Customers Say"
        subtitle="Don't just take our word for it - hear from our satisfied customers"
        limit={6}
        layout="grid"
        columns={3}
        showRating={true}
      />
      
      {/* Additional sections can be added here */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to Our Platform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is your homepage with dynamic content management. 
            Use the admin panel to manage hero sections, banners, and testimonials.
          </p>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
