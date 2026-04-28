import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetPhotosQuery, useGetVideosQuery, useGetGifsQuery } from "../redux/services/mediaApi";
import { incrementPage } from "../redux/features/searchSlice";
import { type SearchState, type SearchResult } from "../redux/features/searchSlice";
import ResultCard from "./ResultCard";
import MediaModal from "./MediaModal";
import { LoadingSpinner, ErrorMessage, EmptyState } from "./StatusMessages";
import { motion, AnimatePresence } from "framer-motion";
import { useFavoriteItems } from "../hooks/useFavorites";

const ResultGrid = () => {
    const { query, activeTab, page } = useSelector((store: { search: SearchState }) => store.search)
    const dispatch = useDispatch()
    const observer = useRef<IntersectionObserver | null>(null)
    const [allResults, setAllResults] = useState<SearchResult[]>([])
    const [selectedMedia, setSelectedMedia] = useState<SearchResult | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Select the appropriate query hook based on active tab
    const photoQuery = useGetPhotosQuery({ query, page }, { skip: activeTab !== 'photos' || !query });
    const videoQuery = useGetVideosQuery({ query, page }, { skip: activeTab !== 'videos' || !query });
    const gifQuery = useGetGifsQuery({ query, page }, { skip: activeTab !== 'gif' || !query });

    // Determine current query state
    const currentQuery = activeTab === 'photos' ? photoQuery : activeTab === 'videos' ? videoQuery : gifQuery;
    const { data, isLoading, isFetching, error } = currentQuery;
    
    // Get favorite items
    const favoriteItems = useFavoriteItems(allResults)
    
    // Store all results when they load
    useEffect(() => {
        if (data?.results && activeTab !== 'favorites') {
            setAllResults(prev => {
                // Combine new results with existing ones, avoid duplicates
                const newResults = [...prev];
                data.results.forEach((result: SearchResult) => {
                    if (!newResults.some(r => r.id === result.id)) {
                        newResults.push(result);
                    }
                });
                return newResults;
            });
        }
    }, [data?.results, activeTab]);

    // Determine which results to show based on active tab
    const resultsToShow = activeTab === 'favorites' ? favoriteItems : (data?.results || []);
    const hasMore = activeTab === 'favorites' ? false : (data?.hasMore || false);

    // Infinite Scroll Observer (only for non-favorites tabs)
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (activeTab === 'favorites') return;
        if (isLoading || isFetching) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                dispatch(incrementPage());
            }
        });
        
        if (node) observer.current.observe(node);
    }, [isLoading, isFetching, hasMore, dispatch, activeTab]);

    if (error) return <ErrorMessage message={"Failed to fetch results. Please check your API keys."} />;
    if (!query) return <EmptyState />;
    
    if (isLoading && resultsToShow.length === 0) return <LoadingSpinner fullScreen />;

    return (
        <div className="px-4 py-8 md:px-8">
            <motion.div 
                layout
                className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6"
            >
                <AnimatePresence>
                    {resultsToShow.map((item, index) => (
                        <motion.div
                            key={`${item.type}-${item.id}-${index}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                                duration: 0.4, 
                                delay: (index % 10) * 0.05,
                                ease: "easeOut"
                            }}
                            className="break-inside-avoid"
                        >
                            <div onClick={() => { setSelectedMedia(item); setIsModalOpen(true); }}>
                                <ResultCard item={item} />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Trigger element for infinite scroll */}
            <div ref={lastElementRef} className="h-20 w-full flex justify-center items-center mt-12">
                {(isFetching || isLoading) && resultsToShow.length > 0 && (
                    <div className="flex flex-col items-center gap-2">
                         <LoadingSpinner />
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading more magic...</span>
                    </div>
                )}
                {!hasMore && resultsToShow.length > 0 && (
                    <p className="text-gray-400 font-medium text-sm">You've reached the end of the universe ✨</p>
                )}
            </div>

            <MediaModal 
                item={selectedMedia} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    )
}

export default ResultGrid