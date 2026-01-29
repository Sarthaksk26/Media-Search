import { type SearchResult } from "../redux/features/searchSlice";

export const transformPhotoData = (response:any) : SearchResult[]=> {
    
    if(!response || !response.results){
        return [];
    }
    
    return response.results.map((item : any) => ({
        id: item.id,
        type: 'photo',
        title: item.alt_description || 'Untitled Photo',
        thumbnail: item.urls.small, // Better for grid loading
        src: item.urls.full,
        // If your SearchResult interface doesn't have 'download' explicitly, 
        // the [key: string]: any wildcard handles this.
        download: item.links?.download_location
    }))
}

export const transformVideoData = (response:any) : SearchResult[]=> {
    if (!response || !response.videos) return [];

    return response.videos.map((item :any) => ({
        id: item.id,
        type: 'video',
        title: item.user?.name ? `Video by ${item.user.name}` : 'Untitled Video',
        thumbnail: item.image,
        src: item.video_files[0]?.link || ''
    }))
}

export const transformGifData = (response:any): SearchResult[] => {
    if (!response || !response.results) return [];
    return response.results.map((item:any) => ({
        id: item.id,
        type: 'gif',
        title: item.title || 'Untitled GIF',
        thumbnail: item.media_formats.tinygif.url,
        src: item.media_formats.gif.url
    }))
}