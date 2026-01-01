import { useDispatch, useSelector } from "react-redux"
import { setActiveTabs } from "../redux/features/searchSlice"


const Tabs = () => {

    const tabs = ['Photos', 'Videos', 'GIF']
    const dispatch = useDispatch()

    const activeTab = useSelector((state)=>state.search.activeTab)

  return (
    <div className='flex gap-10 p-10'>
        {
            tabs.map(function(elem){
                return (<button key={elem} className={`${(activeTab==elem?'bg-blue-700':'bg-gray-600')}  px-5 py-2 rounded-lg cursor-pointer active:scale-x-95`}
                onClick={()=>{
                    dispatch(setActiveTabs(elem))
                }}>{elem}</button>)
            })
        }
    </div>
  )
}

export default Tabs