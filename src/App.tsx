import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogTeaserSection } from './components/CatalogTeaserSection';
import { CatalogPage } from './components/CatalogPage';
import { BlogPage } from './components/BlogPage';
import { PortfolioPage } from './components/PortfolioPage';
import { BlogHomePreview } from './components/BlogHomePreview';
import { BookingForm } from './components/BookingForm';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ServiceAreas } from './components/ServiceAreas';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { GallerySection } from './components/GallerySection';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { GensetProduct } from './types';
import { resetBodyScroll } from './utils/scrollLock';
import { AdminDashboard } from './components/admin/AdminDashboard';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<'home' | 'katalog' | 'artikel' | 'portofolio' | 'admin'>('home');
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [selectedGenset, setSelectedGenset] = useState<GensetProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detect URL parameter, hash, or path for Admin Dashboard access
  useEffect(() => {
    const checkUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path.includes('/admin') || hash === '#admin' || search.includes('page=admin') || search.includes('admin')) {
        setCurrentPage('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    checkUrlRoute();
    window.addEventListener('popstate', checkUrlRoute);
    return () => window.removeEventListener('popstate', checkUrlRoute);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleNavigate = (target: string) => {
    resetBodyScroll();
    if (target === 'admin') {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (target === 'katalog') {
      setCurrentPage('katalog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }


    if (target === 'artikel') {
      setCurrentPage('artikel');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (target === 'portofolio') {
      setCurrentPage('portofolio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If currently on catalog, article, or portfolio page and user clicks a home section or 'beranda'
    if (currentPage !== 'home') {
      setCurrentPage('home');
      // Give React a tick to mount the home sections, then scroll
      setTimeout(() => {
        if (target === 'beranda') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveSection('beranda');
        } else {
          setActiveSection(target);
          const el = document.getElementById(target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 50);
      return;
    }

    // Already on home page
    setActiveSection(target);
    if (target === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectGensetForBooking = (genset: GensetProduct) => {
    setSelectedGenset(genset);
    showToast(`Unit ${genset.name} dipilih! Menuju formulir booking WhatsApp...`);
    setCurrentPage('home');
    setTimeout(() => {
      handleNavigate('booking');
    }, 50);
  };

  if (currentPage === 'admin') {
    return <AdminDashboard onBackToHome={() => handleNavigate('beranda')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a0f] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white transition-colors duration-200">
      {/* Header & Sticky Navigation */}
      <Navbar
        currentPage={currentPage}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="flex-1">
        {currentPage === 'katalog' ? (
          /* Dedicated Separate Catalog Page */
          <CatalogPage
            onBackToHome={() => handleNavigate('beranda')}
            onSelectGensetForBooking={handleSelectGensetForBooking}
            onToast={showToast}
          />
        ) : currentPage === 'artikel' ? (
          /* Dedicated Separate News & Knowledge Portal Page */
          <BlogPage
            onBackToHome={() => handleNavigate('beranda')}
            onGoToBooking={() => handleNavigate('booking')}
            onToast={showToast}
          />
        ) : currentPage === 'portofolio' ? (
          /* Dedicated Separate Portfolio & Event Documentation Page */
          <PortfolioPage
            onBackToHome={() => handleNavigate('beranda')}
            onGoToBooking={() => handleNavigate('booking')}
            onOpenCatalog={() => handleNavigate('katalog')}
            onToast={showToast}
          />
        ) : (
          /* Home Page with Clean Layout */
          <>
            {/* 1. Hero Section */}
            <section id="beranda">
              <Hero
                onExploreCatalog={() => handleNavigate('katalog')}
                onGoToBooking={() => handleNavigate('booking')}
              />
            </section>

            {/* 2. Teaser Katalog Section (3D Carousel Pilihan Genset) */}
            <CatalogTeaserSection
              onOpenCatalog={() => handleNavigate('katalog')}
              onGoToBooking={(genset) => {
                if (genset) {
                  handleSelectGensetForBooking(genset);
                } else {
                  handleNavigate('booking');
                }
              }}
            />

            {/* 3. Mengapa Memilih (Why Choose Us & SGC Advantages) */}
            <WhyChooseUs />

            {/* 4. Cakupan Wilayah Layanan (Service Coverage Areas) */}
            <ServiceAreas />

            {/* 5. FAQ (Tanya Jawab Seputar Sewa Genset) */}
            <FAQSection />

            {/* 6. Portofolio (Event Documentation / Portfolio Gallery) */}
            <GallerySection
              onOpenPortfolio={() => handleNavigate('portofolio')}
            />

            {/* 7. Artikel (News & Blog Section - 3 Latest Posts) */}
            <BlogHomePreview
              onOpenAllArticles={() => handleNavigate('artikel')}
              onGoToBooking={() => handleNavigate('booking')}
              onToast={showToast}
            />

            {/* 8. Testimoni (Ulasan Pengguna & Klien) */}
            <TestimonialsSection
              onToast={showToast}
            />

            {/* 9. Formulir Pemesanan (Automatic WhatsApp Booking Form) */}
            <BookingForm
              preselectedProduct={selectedGenset}
              onToast={showToast}
            />
          </>
        )}
      </main>

      {/* Floating 24/7 WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* Interactive Toast Alerts */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}


