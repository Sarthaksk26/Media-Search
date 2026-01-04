// Combining small components into one file to reduce clutter

export const LoadingSpinner = ({ fullScreen = false }) => (
    <div className={`flex flex-col justify-center items-center gap-3 ${fullScreen ? 'min-h-[50vh]' : ''}`}>
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
    </div>
);

export const ErrorMessage = ({ message }) => (
    <div className="flex justify-center p-8">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl text-sm border border-red-100">
            {message}
        </div>
    </div>
);

export const EmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Search</h3>
        <p className="text-gray-500 max-w-sm">Enter a keyword above to discover high-quality photos, videos, and GIFs.</p>
    </div>
);