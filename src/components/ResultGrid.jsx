import { useDispatch, useSelector } from "react-redux";
import { fetchGIF, fetchPhotos, fetchVideos } from "../api/mediaApi";
import { setQuery, setLoading, setError, setResults } from "../redux/features/searchSlice";
import { useEffect } from "react";
import ResultCard from "./ResultCard";



const ResultGrid = () => {

    const { query, activeTab, results, loading, error } = useSelector((store) => store.search)

    const dispatch = useDispatch()


    useEffect(function () {
        const getData = async () => {
            if(!query) return;
            try {
                dispatch(setLoading())
                let data = [];
                if (activeTab == 'photos') {
                    let response = await fetchPhotos(query);
                    data = response.results.map((item) => ({
                        id: item.id,
                        type: 'photo',
                        title: item.alt_description,
                        thumbnail: item.urls.thumb,
                        src: item.urls.full
                    }))
                    console.log(data)
                }
                if (activeTab == 'videos') {
                    let response = await fetchVideos(query);
                    data = response.videos.map((item) => ({
                        id: item.id,
                        type: 'video',
                        title: item.user.name || 'video',
                        thubnail: item.image,
                        src: item.video_files[0].link
                    }))
                    console.log(data)
                }
                if (activeTab == 'gif') {
                    let response = await fetchGIF(query);
                    data = response.results.map((item) => ({
                        id: item.id,
                        type: 'gif',
                        title: item.title || 'GIF',
                        thubnail: item.media_formats.tinygif.url,
                        src: item.media_formats.gif.url
                    }))
                    console.log(data)
                }

                dispatch(setResults(data))
            } catch (error) {
                dispatch(setError(error.message))
            }
        }
        getData()
    }, [query, activeTab])

    if (error) {
        return <h1>Error</h1>
    }
    if (loading) {
        return <h1>Loading....</h1>
    }

    return (
        <div className="flex justify-center flex-wrap gap-6 rounded overflow-auto px-10">
            {
                results.map((item) => {
                    return <div key={item.id}>
                        <a href="">
                            <ResultCard 
                            item={item}
                        /> </a>                    
                    </div>
                })
            }
        </div>
    )
}

export default ResultGrid