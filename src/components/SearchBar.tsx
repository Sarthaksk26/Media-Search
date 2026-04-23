import { useState, useEffect } from 'react'
import { useDispatch } from "react-redux";
import { setQuery } from '../redux/features/searchSlice';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
    const [inputVal, setInputVal] = useState('')
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
                        className="block w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all shadow-sm hover:border-gray-300"
                        onChange={(e) => setInputVal(e.target.value)}
                        type="text"
                        placeholder="Search for anything..."
                        value={inputVal}
                    />

                    <AnimatePresence>
                        {inputVal && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                onClick={() => setInputVal('')}
                                className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </motion.button>
                        )}
                    </AnimatePresence>
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