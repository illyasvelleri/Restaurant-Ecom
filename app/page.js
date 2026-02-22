//page.js

import ClientProviders from "./components/ClientProviders";
import HeroSection from './components/HeroSection';
import Main from './components/main';



export default function Home() {
  return (
    <main className=''>
      <ClientProviders>


        {/* <section className="pt-0">
          <HeroSection />
        </section> */}
        <section className="pt-36 pb-40">
          <Main />
        </section>
        {/* Footer */}
      </ClientProviders>
    </main>
  );
}
