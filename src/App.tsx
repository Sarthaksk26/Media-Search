import SearchBar from "./components/SearchBar"
import Tabs from "./components/Tabs"
import ResultGrid from "./components/ResultGrid"

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <SearchBar />
        <Tabs />
      </div>
      
      <main className="max-w-[1600px] mx-auto">
        <ResultGrid />
      </main>
    </div>
  )
}

export default App