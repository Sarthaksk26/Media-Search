import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetPhotosQuery, useGetVideosQuery, useGetGifsQuery } from "../redux/services/mediaApi";
import { incrementPage } from "../redux/features/searchSlice";
import { type SearchState } from "../redux/features/searchSlice";
import ResultCard from "./ResultCard";
import { LoadingSpinner, ErrorMessage, EmptyState } from "./StatusMessages";
import { motion, AnimatePresence } from "framer-motion";

const ResultGrid = () => {
    const { query, activeTab, page } = useSelector((store: { search: SearchState }) => store.search)
    const dispatch = useDispatch()
    const observer = useRef<IntersectionObserver | null>(null)

    // Select the appropriate query hook based on active tab
    const photoQuery = useGetPhotosQuery({ query, page }, { skip: activeTab !== 'photos' || !query });
    const videoQuery = useGetVideosQuery({ query, page }, { skip: activeTab !== 'videos' || !query });
    const gifQuery = useGetGifsQuery({ query, page }, { skip: activeTab !== 'gif' || !query });

    // Determine current query state
    const currentQuery = activeTab === 'photos' ? photoQuery : activeTab === 'videos' ? videoQuery : gifQuery;
    const { data, isLoading, isFetching, error } = currentQuery;
    
    const results = data?.results || [];
    const hasMore = data?.hasMore || false;

    // Infinite Scroll Observer
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading || isFetching) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                dispatch(incrementPage());
            }
        });
        
        if (node) observer.current.observe(node);
    }, [isLoading, isFetching, hasMore, dispatch]);

    if (error) return <ErrorMessage message={"Failed to fetch results. Please check your API keys."} />;
    if (!query) return <EmptyState />;
    
    if (isLoading && results.length === 0) return <LoadingSpinner fullScreen />;

    return (
        <div className="px-4 py-8 md:px-8">
            <motion.div 
                layout
                className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6"
            >
                <AnimatePresence>
                    {results.map((item, index) => (
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
                            <ResultCard item={item} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Trigger element for infinite scroll */}
            <div ref={lastElementRef} className="h-20 w-full flex justify-center items-center mt-12">
                {(isFetching || isLoading) && results.length > 0 && (
                    <div className="flex flex-col items-center gap-2">
                         <LoadingSpinner />
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading more magic...</span>
                    </div>
                )}
                {!hasMore && results.length > 0 && (
                    <p className="text-gray-400 font-medium text-sm">You've reached the end of the universe ✨</p>
                )}
            </div>
        </div>
    )
}

export default ResultGrid