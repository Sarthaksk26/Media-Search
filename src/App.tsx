import { lazy, Suspense } from 'react';
import SearchBar from "./components/SearchBar"
import Tabs from "./components/Tabs"
import { motion, useScroll, useSpring } from "framer-motion"
import { Toaster } from 'react-hot-toast';

const ResultGrid = lazy(() => import('./components/ResultGrid'));

const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 pb-20 selection:bg-black selection:text-white">
      <Toaster position="bottom-right" toastOptions={{ style: { borderRadius: '1rem', background: '#333', color: '#fff', fontSize: '14px', fontWeight: 'bold' } }} />
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-[100]" 
        style={{ scaleX }} 
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-[1600px] mx-auto">
          <SearchBar />
          <Tabs />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto pt-4">
        <Suspense fallback={
          <div className="w-full h-40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <ResultGrid />
        </Suspense>
      </main>

      {/* Footer / Branding */}
      <footer className="mt-20 py-12 border-t border-gray-100 text-center">
        <p className="text-sm font-bold text-gray-300 uppercase tracking-[0.2em]">
          Media Search Engine &bull; Built with RTK Query
        </p>
      </footer>
    </div>
  )
}

export default App