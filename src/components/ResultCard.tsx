import { useState, useRef, useEffect } from 'react'
import { type SearchResult } from '../redux/features/searchSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ExternalLink, Copy, Check } from 'lucide-react';

interface ResultCardProps {
    item: SearchResult;
}

const ResultCard = ({ item }: ResultCardProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [copied, setCopied] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (item.type === 'video' && videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(() => { });
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isHovered, item.type])

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
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
        } catch (error) {
            console.error('Download failed', error);
        }
    }

    const handleCopyLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(item.src);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <motion.div
            className="group relative rounded-2xl overflow-hidden bg-gray-100 mb-6 break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500 cursor-zoom-in"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -4 }}
        >
            {/* Media Content */}
            <div className="relative w-full overflow-hidden bg-gray-200 aspect-auto">
                <AnimatePresence>
                    {!isLoaded && (
                        <motion.div 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer z-10" 
                            style={{ backgroundSize: '200% 100%' }}
                        />
                    )}
                </AnimatePresence>

                {item.type === 'video' ? (
                    <video
                        ref={videoRef}
                        src={item.src}
                        poster={item.thumbnail}
                        className={`w-full h-auto object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loop
                        muted
                        playsInline
                        onLoadedData={() => setIsLoaded(true)}
                    />
                ) : (
                    <img
                        src={item.type === 'photo' ? item.thumbnail : item.src}
                        alt={item.title}
                        className={`w-full h-auto object-cover transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsLoaded(true)}
                        loading="lazy"
                    />
                )}
            </div>

            {/* Premium Overlay */}
            <div className={`absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4 z-20`}>
                <div className="flex justify-end gap-2 translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
                     <button 
                        onClick={handleCopyLink}
                        className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-colors"
                        title="Copy Link"
                    >
                        {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                    <button 
                        onClick={() => window.open(item.src, '_blank')}
                        className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white transition-colors"
                        title="View Original"
                    >
                        <ExternalLink size={18} />
                    </button>
                </div>

                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
                        {item.type}
                    </p>
                    <p className="text-white text-sm font-semibold line-clamp-2 mb-4 drop-shadow-md">
                        {item.title}
                    </p>
                    <button 
                        onClick={handleDownload}
                        className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
                    >
                        <Download size={16} />
                        DOWNLOAD FREE
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default ResultCard