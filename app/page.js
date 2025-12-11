//page.js

import Navbar from './components/navbar'
import ClientProviders from "./components/ClientProviders";
import HeroSection from './components/HeroSection';
import Main from './components/main';
import Footer from './components/footer';


export default function Home() {
  return (
    <main className=''>
      <ClientProviders>
        <section className="">
          <Navbar />
        </section>

        <section className="pt-0">
          <HeroSection />
        </section>
        <section className="">
          <Main />
        </section>
        {/* Footer */}
        <Footer />
      </ClientProviders>
    </main>
  );
}
