import { useState, useRef, useEffect } from 'react'
import { type SearchResult } from '../redux/features/searchSlice';


interface ResultCardProps{
    item: SearchResult;
}

const ResultCard = ({ item}:ResultCardProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Handle Video Autoplay on Hover
    useEffect(() => {
        if (item.type === 'video' && videoRef.current) {
            if (isHovered) {
                videoRef.current.play().catch(() => {});
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }
    }, [isHovered, item.type])

    const handleDownload = async (e:React.MouseEvent<HTMLButtonElement>) => {
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

    return (
        <div 
            className="group relative rounded-xl overflow-hidden bg-gray-200 mb-4 break-inside-avoid"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Loading Placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
            )}

            {/* Media Content */}
            <div className="relative w-full">
                {item.type === 'video' ? (
                    <video
                        ref={videoRef}
                        src={item.src}
                        poster={item.thumbnail}
                        className={`w-full h-auto object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        loop
                        muted
                        playsInline
                        onLoadedData={() => setIsLoaded(true)}
                    />
                ) : (
                    <img
                        src={item.type === 'photo' ? item.thumbnail : item.src}
                        alt={item.title}
                        className={`w-full h-auto object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsLoaded(true)}
                        loading="lazy"
                    />
                )}
            </div>

            {/* Modern Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4`}>
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium line-clamp-1 mb-3 drop-shadow-md">
                        {item.title}
                    </p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => window.open(item.src, '_blank')}
                            className="flex-1 bg-white/90 hover:bg-white text-black py-2 rounded-lg text-xs font-bold transition-colors"
                        >
                            Open
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 rounded-lg text-xs font-bold border border-white/50 transition-colors"
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResultCard