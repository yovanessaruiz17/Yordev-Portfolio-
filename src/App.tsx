import React, { useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TechnologiesSection } from './components/TechnologiesSection';
import { WhyWorkWithMe } from './components/WhyWorkWithMe';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AboutModal } from './components/AboutModal';
import { BlogModal } from './components/BlogModal';
import { AdminModal } from './components/admin/AdminModal';

function PortfolioApp() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white relative">
      {/* Background ambient lighting accents */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-10 w-[600px] h-[600px] bg-indigo-700/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header */}
      <Header
        onOpenAbout={() => setAboutOpen(true)}
        onOpenBlog={() => setBlogOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <ProjectsSection />
        <TechnologiesSection />
        <WhyWorkWithMe />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setAdminOpen(true)} />

      {/* Interactive Modals */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <BlogModal isOpen={blogOpen} onClose={() => setBlogOpen(false)} />
      <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
