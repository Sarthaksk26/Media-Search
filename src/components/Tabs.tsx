import { useDispatch, useSelector } from "react-redux"
import { setActiveTabs, type SearchState } from "../redux/features/searchSlice"
import { motion } from "framer-motion"
import { Image, Video, Ghost, Heart } from "lucide-react"

const Tabs = () => {
    const tabs = [
        { id: 'photos', label: 'Photos', icon: Image },
        { id: 'videos', label: 'Videos', icon: Video },
        { id: 'gif', label: 'GIFs', icon: Ghost },
        { id: 'favorites', label: 'Favorites', icon: Heart }
    ]
    const dispatch = useDispatch()
    const activeTab = useSelector((state: { search: SearchState }) => state.search.activeTab)

    return (
        <div className='pb-6 pt-2 px-4'>
            <div className='flex justify-center items-center p-1.5 bg-gray-100 rounded-2xl w-fit mx-auto shadow-inner'>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => dispatch(setActiveTabs(tab.id as any))}
                            className={`
                                relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2
                                ${isActive ? 'text-white' : 'text-gray-500 hover:text-black'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-black rounded-xl shadow-lg z-0"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={16} className="relative z-10" />
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Tabs