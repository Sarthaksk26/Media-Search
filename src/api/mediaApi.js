import axios from 'axios'

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY
const TENOR_KEY = import.meta.env.VITE_TENOR_KEY

export async function fetchPhotos(query, page = 1) {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, page, per_page: 20 },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    })
    return res.data;
}

export async function fetchVideos(query, page = 1) {
    const res = await axios.get('https://api.pexels.com/videos/search', {
        params: { query, page, per_page: 20 },
        headers: { Authorization: PEXELS_KEY }
    })
    return res.data;
}

export async function fetchGIF(query, page = 1) {
    const limit = 20;
    const pos = (page - 1) * limit;
    const res = await axios.get('https://tenor.googleapis.com/v2/search', {
        params: { q: query, key: TENOR_KEY, limit, pos }
    })
    return res.data;
}