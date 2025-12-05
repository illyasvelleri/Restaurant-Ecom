import HeroSection from './components/HeroSection';
import CategoryFilters from './components/CategoryFilters';
import FeaturedProducts from './components/Featured';
import TopRatedDishes from './components/TopRatedDishes';
import Footer from './components/footer';


export default function Home() {
  return (
    <main>
      <section className="">
        <HeroSection />
      </section>
      <section className="mt-6 px-4 md:px-12">
        <CategoryFilters />
      </section>

      <section className="">
        <FeaturedProducts />
      </section>

      <section className="">
        <TopRatedDishes />
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
}
