import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, Sparkles, Loader2 } from 'lucide-react';
import { type SearchResult } from '../redux/features/searchSlice';
import { analyzeImage } from '../redux/services/geminiApi';
import toast from 'react-hot-toast';

interface MediaModalProps {
    item: SearchResult | null;
    isOpen: boolean;
    onClose: () => void;
}

const MediaModal = ({ item, isOpen, onClose }: MediaModalProps) => {
    const [aiData, setAiData] = useState<{ caption: string, tags: string[] } | null>(null);
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    useEffect(() => {
        if (isOpen && item && item.type === 'photo') {
            const fetchAiAnalysis = async () => {
                setIsLoadingAi(true);
                try {
                    const data = await analyzeImage(item.src, item.title || '');
                    setAiData(data);
                } catch (error) {
                    console.error("Failed to analyze image", error);
                    toast.error("Failed to generate AI analysis.");
                } finally {
                    setIsLoadingAi(false);
                }
            };
            fetchAiAnalysis();
        } else {
            setAiData(null);
        }

        // Prevent body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, item]);

    const handleDownload = async () => {
        if (!item) return;
        const toastId = toast.loading('Downloading media...');
        try {
            const response = await fetch(item.src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${item.type}-${item.id}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Download complete!', { id: toastId });
        } catch (error) {
            console.error('Download failed', error);
            toast.error('Download failed. Please try again.', { id: toastId });
        }
    };

    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/10 hover:bg-black/20 text-black md:text-white md:bg-white/20 md:hover:bg-white/30 backdrop-blur-md rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Media Container */}
                        <div className="w-full md:w-2/3 bg-black flex items-center justify-center min-h-[40vh] md:min-h-full">
                            {item.type === 'video' ? (
                                <video
                                    src={item.src}
                                    poster={item.thumbnail}
                                    className="w-full h-full object-contain max-h-[90vh]"
                                    controls
                                    autoPlay
                                    playsInline
                                />
                            ) : (
                                <img
                                    src={item.src}
                                    alt={item.title || "Media"}
                                    className="w-full h-full object-contain max-h-[90vh]"
                                />
                            )}
                        </div>

                        {/* Sidebar Details */}
                        <div className="w-full md:w-1/3 bg-white p-6 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[90vh]">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 rounded-full mb-3">
                                    {item.type}
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {item.title || "Untitled Media"}
                                </h2>
                            </div>

                            {/* AI Insights Section */}
                            <div className="flex-1">
                                {item.type === 'photo' && (
                                    <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Sparkles size={64} className="text-blue-500" />
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-blue-600 font-bold mb-3">
                                            <Sparkles size={18} />
                                            <h3>Gemini Flash AI Analysis</h3>
                                        </div>

                                        {isLoadingAi ? (
                                            <div className="flex items-center gap-2 text-gray-500 py-4">
                                                <Loader2 size={16} className="animate-spin" />
                                                <span className="text-sm">Analyzing visual contents...</span>
                                            </div>
                                        ) : aiData ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                                    "{aiData.caption}"
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {aiData.tags.map((tag, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 bg-white text-blue-600 text-xs font-semibold rounded-lg shadow-sm border border-blue-100">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <p className="text-gray-400 text-sm">AI analysis could not be generated.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col gap-3">
                                <button
                                    onClick={handleDownload}
                                    className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-black/10"
                                >
                                    <Download size={20} />
                                    Download High-Res
                                </button>
                                <button
                                    onClick={() => window.open(item.src, '_blank')}
                                    className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <ExternalLink size={20} />
                                    Open Original
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MediaModal;
