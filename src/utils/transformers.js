export const transformPhotoData = (response) => {
    return response.results.map((item) => ({
        id: item.id,
        type: 'photo',
        title: item.alt_description || 'Untitled Photo',
        thumbnail: item.urls.small, // Better for grid loading
        src: item.urls.full,
        download: item.links?.download_location
    }))
}

export const transformVideoData = (response) => {
    return response.videos.map((item) => ({
        id: item.id,
        type: 'video',
        title: item.user?.name ? `Video by ${item.user.name}` : 'Untitled Video',
        thumbnail: item.image,
        src: item.video_files[0]?.link || ''
    }))
}

export const transformGifData = (response) => {
    return response.results.map((item) => ({
        id: item.id,
        type: 'gif',
        title: item.title || 'Untitled GIF',
        thumbnail: item.media_formats.tinygif.url,
        src: item.media_formats.gif.url
    }))
}