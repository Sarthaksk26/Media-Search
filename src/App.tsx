import SearchBar from "./components/SearchBar"
import Tabs from "./components/Tabs"
import ResultGrid from "./components/ResultGrid"
import { motion, useScroll, useSpring } from "framer-motion"

const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 pb-20 selection:bg-black selection:text-white">
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
        <ResultGrid />
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