import { useDispatch, useSelector } from "react-redux"
import { setActiveTabs } from "../redux/features/searchSlice"

const Tabs = () => {
    const tabs = [
        { id: 'photos', label: 'Photos' },
        { id: 'videos', label: 'Videos' },
        { id: 'gif', label: 'GIFs' }
    ]
    const dispatch = useDispatch()
    const activeTab = useSelector((state) => state.search.activeTab)

    return (
        <div className='pb-4 pt-2 px-4'>
            <div className='flex justify-center gap-2 overflow-x-auto no-scrollbar'>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => dispatch(setActiveTabs(tab.id))}
                        className={`
                            px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                            ${activeTab === tab.id
                                ? 'bg-black text-white border-black shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Tabs