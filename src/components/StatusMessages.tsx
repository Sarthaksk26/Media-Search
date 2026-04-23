import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
}

export const LoadingSpinner = ({ fullScreen = false }: LoadingSpinnerProps) => (
    <div className={`flex flex-col justify-center items-center gap-4 ${fullScreen ? 'min-h-[70vh]' : ''}`}>
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
            <Loader2 className="w-10 h-10 text-black" />
        </motion.div>
        {fullScreen && <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Curating your results...</p>}
    </div>
);

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center p-12"
    >
        <div className="bg-white border border-red-100 p-8 rounded-3xl shadow-xl shadow-red-500/5 max-w-md w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>
            <button 
                onClick={() => window.location.reload()}
                className="bg-black text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
            >
                Try Again
            </button>
        </div>
    </motion.div>
);

export const EmptyState = () => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
        <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner border border-white">
            <Search className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Explore the Visual World</h3>
        <p className="text-gray-500 max-w-sm text-lg leading-relaxed font-medium">
            Discover stunning high-quality photos, cinematic videos, and trending GIFs from across the web.
        </p>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
             {['Nature', 'Tech', 'Minimal', 'Art'].map(tag => (
                 <span key={tag} className="px-6 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-400">#{tag}</span>
             ))}
        </div>
    </motion.div>
);