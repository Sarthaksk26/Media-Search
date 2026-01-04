import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGIF, fetchPhotos, fetchVideos } from "../api/mediaApi";
import { setLoading, setError, setResults, appendResults, incrementPage } from "../redux/features/searchSlice";
import { transformPhotoData, transformVideoData, transformGifData } from "../utils/transformers";
import ResultCard from "./ResultCard";
import { LoadingSpinner, ErrorMessage, EmptyState } from "./StatusMessages";

const ResultGrid = () => {
    const { query, activeTab, results, loading, error, page, hasMore } = useSelector((store) => store.search)
    const dispatch = useDispatch()

    const fetchData = async (isLoadMore = false) => {
        if (!query) return;

        try {
            if (!isLoadMore) dispatch(setLoading());
            
            let rawData;
            let transformedData = [];

            switch (activeTab) {
                case 'photos':
                    rawData = await fetchPhotos(query, page);
                    transformedData = transformPhotoData(rawData);
                    break;
                case 'videos':
                    rawData = await fetchVideos(query, page);
                    transformedData = transformVideoData(rawData);
                    break;
                case 'gif':
                    rawData = await fetchGIF(query, page);
                    transformedData = transformGifData(rawData);
                    break;
            }

            if (isLoadMore) {
                dispatch(appendResults(transformedData));
            } else {
                dispatch(setResults(transformedData));
            }
        } catch (err) {
            dispatch(setError(err.message));
        }
    }

    // Reset and fetch when query or tab changes
    useEffect(() => {
        if (query) fetchData(false);
    }, [query, activeTab]);

    // Load more when page increments
    useEffect(() => {
        if (page > 1) fetchData(true);
    }, [page]);

    if (error) return <ErrorMessage message={error} />;
    if (!query) return <EmptyState />;
    if (loading && results.length === 0) return <LoadingSpinner fullScreen />;
    if (!results.length && !loading) {
        return (
            <div className="text-center py-24 text-gray-500">
                <p className="text-xl">No results for <span className="font-bold text-black">"{query}"</span></p>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 md:px-8">
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {results.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="break-inside-avoid">
                        <ResultCard item={item} />
                    </div>
                ))}
            </div>

            {hasMore && results.length > 0 && (
                <div className="flex justify-center py-12">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <button
                            onClick={() => dispatch(incrementPage())}
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black hover:border-black px-8 py-3 rounded-full font-medium transition-all shadow-sm"
                        >
                            Load More
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

export default ResultGrid