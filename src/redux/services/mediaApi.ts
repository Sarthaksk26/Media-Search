import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { transformPhotoData, transformVideoData, transformGifData, type UnsplashResponseDTO, type PexelsResponseDTO, type TenorResponseDTO } from '../../utils/transformers';
import { type SearchResult } from '../features/searchSlice';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY as string;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY as string;
const TENOR_KEY = import.meta.env.VITE_TENOR_KEY as string;

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Media'],
  endpoints: (builder) => ({
    getPhotos: builder.query<{ results: SearchResult[]; hasMore: boolean }, { query: string; page: number }>({
      query: ({ query, page }) => ({
        url: 'https://api.unsplash.com/search/photos',
        params: { query, page, per_page: 20 },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      }),
      transformResponse: (response: UnsplashResponseDTO, _meta, arg) => ({
        results: transformPhotoData(response),
        hasMore: arg.page < (response.total_pages || 0),
      }),
      // For Infinite Scroll
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.query}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          results: [...currentCache.results, ...newItems.results],
          hasMore: newItems.hasMore,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.query !== previousArg?.query;
      },
    }),
    getVideos: builder.query<{ results: SearchResult[]; hasMore: boolean }, { query: string; page: number }>({
      query: ({ query, page }) => ({
        url: 'https://api.pexels.com/videos/search',
        params: { query, page, per_page: 20 },
        headers: { Authorization: PEXELS_KEY },
      }),
      transformResponse: (response: PexelsResponseDTO) => ({
        results: transformVideoData(response),
        hasMore: !!response.next_page,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.query}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) return newItems;
        return {
          results: [...currentCache.results, ...newItems.results],
          hasMore: newItems.hasMore,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.query !== previousArg?.query;
      },
    }),
    getGifs: builder.query<{ results: SearchResult[]; hasMore: boolean }, { query: string; page: number }>({
      query: ({ query, page }) => {
        const limit = 20;
        const pos = (page - 1) * limit;
        return {
          url: 'https://tenor.googleapis.com/v2/search',
          params: { q: query, key: TENOR_KEY, limit, pos },
        };
      },
      transformResponse: (response: TenorResponseDTO) => ({
        results: transformGifData(response),
        hasMore: !!response.next,
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.query}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) return newItems;
        return {
          results: [...currentCache.results, ...newItems.results],
          hasMore: newItems.hasMore,
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page || currentArg?.query !== previousArg?.query;
      },
    }),
  }),
});

export const { useGetPhotosQuery, useGetVideosQuery, useGetGifsQuery } = mediaApi;
