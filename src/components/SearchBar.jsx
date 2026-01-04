import { useState } from 'react'
import { useDispatch } from "react-redux";
import { setQuery } from '../redux/features/searchSlice';

const SearchBar = () => {
    const [inputVal, setInputVal] = useState('')
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault();
        if (inputVal.trim()) {
            dispatch(setQuery(inputVal.trim()))
        }
    }

    return (
        <div className="pt-6 pb-2 px-4 md:px-8 max-w-4xl mx-auto">
            <form onSubmit={submitHandler} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    required
                    className="block w-full pl-11 pr-24 py-3.5 bg-gray-100 border-none rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white transition-all shadow-sm"
                    onChange={(e) => setInputVal(e.target.value)}
                    type="text"
                    placeholder="Search photos, videos, or GIFs..."
                    value={inputVal}
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-transform active:scale-95"
                >
                    Search
                </button>
            </form>
        </div>
    )
}

export default SearchBar