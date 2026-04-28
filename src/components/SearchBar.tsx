import { useState, useEffect } from 'react'
import { useDispatch } from "react-redux";
import { setQuery } from '../redux/features/searchSlice';
import { Search, X, Sparkles, Loader2 } from 'lucide-react';
import { expandSearchQuery } from '../redux/services/geminiApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
    const [inputVal, setInputVal] = useState('')
    const [isAiLoading, setIsAiLoading] = useState(false)
    const dispatch = useDispatch()

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputVal.trim()) {
                dispatch(setQuery(inputVal.trim()))
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [inputVal, dispatch]);

    const submitHandler = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (inputVal.trim()) {
            dispatch(setQuery(inputVal.trim()))
        }
    }

    const handleAiEnhance = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!inputVal.trim()) return;
        
        setIsAiLoading(true);
        const toastId = toast.loading('AI is expanding your search...');
        try {
            const expanded = await expandSearchQuery(inputVal.trim());
            setInputVal(expanded);
            dispatch(setQuery(expanded));
            toast.success('Search enhanced!', { id: toastId });
        } catch (error) {
            toast.error('AI enhancement failed', { id: toastId });
        } finally {
            setIsAiLoading(false);
        }
    }

    return (
        <div className="pt-8 pb-4 px-4 md:px-8 max-w-5xl mx-auto w-full">
            <form onSubmit={submitHandler} className="relative group">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex items-center"
                >
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                    </div>
                    
                    <input
                        required
                        className="block w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all shadow-sm hover:border-gray-300"
                        onChange={(e) => setInputVal(e.target.value)}
                        type="text"
                        placeholder="Search for anything..."
                        value={inputVal}
                    />

                    <div className="absolute right-4 flex items-center gap-1">
                        <AnimatePresence>
                            {inputVal && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    type="button"
                                    onClick={() => setInputVal('')}
                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <button
                            type="button"
                            onClick={handleAiEnhance}
                            disabled={!inputVal || isAiLoading}
                            className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed group relative"
                            title="Enhance search with Gemini AI"
                        >
                            {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                            
                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Enhance with AI
                            </span>
                        </button>
                    </div>
                </motion.div>
                
                <div className="mt-2 flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-gray-400 px-2">
                    <span>Trending:</span>
                    <button onClick={() => setInputVal('Cyberpunk')} className="hover:text-black transition-colors">Cyberpunk</button>
                    <button onClick={() => setInputVal('Nature')} className="hover:text-black transition-colors">Nature</button>
                    <button onClick={() => setInputVal('Abstract')} className="hover:text-black transition-colors">Abstract</button>
                </div>
            </form>
        </div>
    )
}

export default SearchBar