import HeroSection from './components/HeroSection';
import Main from './components/main';
import Footer from './components/footer';


export default function Home() {
  return (
    <main>
      <section className="">
        <HeroSection />
      </section>
      <section className="">
        <Main />
      </section>
      {/* Footer */}
      <Footer />
    </main>
  );
}
