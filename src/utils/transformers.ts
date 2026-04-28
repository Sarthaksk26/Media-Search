import { type SearchResult } from "../redux/features/searchSlice";

// --- Unsplash DTOs ---
export interface UnsplashPhotoDTO {
    id: string;
    alt_description: string | null;
    urls: {
        small: string;
        full: string;
    };
    links?: {
        download_location: string;
    };
}

export interface UnsplashResponseDTO {
    total: number;
    total_pages: number;
    results: UnsplashPhotoDTO[];
}

export const transformPhotoData = (response: UnsplashResponseDTO): SearchResult[] => {
    if (!response || !response.results) {
        return [];
    }

    return response.results.map((item) => ({
        id: item.id,
        type: 'photo',
        title: item.alt_description || 'Untitled Photo',
        thumbnail: item.urls.small,
        src: item.urls.full,
        download: item.links?.download_location
    }));
};

// --- Pexels DTOs ---
export interface PexelsVideoFileDTO {
    link: string;
}

export interface PexelsVideoDTO {
    id: number;
    user?: { name: string };
    image: string;
    video_files: PexelsVideoFileDTO[];
}

export interface PexelsResponseDTO {
    page: number;
    per_page: number;
    total_results: number;
    url: string;
    next_page?: string;
    videos: PexelsVideoDTO[];
}

export const transformVideoData = (response: PexelsResponseDTO): SearchResult[] => {
    if (!response || !response.videos) return [];

    return response.videos.map((item) => ({
        id: String(item.id),
        type: 'video',
        title: item.user?.name ? `Video by ${item.user.name}` : 'Untitled Video',
        thumbnail: item.image,
        src: item.video_files[0]?.link || ''
    }));
};

// --- Tenor DTOs ---
export interface TenorMediaFormatDTO {
    url: string;
}

export interface TenorGifDTO {
    id: string;
    title: string;
    media_formats: {
        tinygif: TenorMediaFormatDTO;
        gif: TenorMediaFormatDTO;
    };
}

export interface TenorResponseDTO {
    next: string;
    results: TenorGifDTO[];
}

export const transformGifData = (response: TenorResponseDTO): SearchResult[] => {
    if (!response || !response.results) return [];
    return response.results.map((item) => ({
        id: item.id,
        type: 'gif',
        title: item.title || 'Untitled GIF',
        thumbnail: item.media_formats.tinygif.url,
        src: item.media_formats.gif.url
    }));
};