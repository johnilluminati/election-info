import { QueryClient } from '@tanstack/react-query'

// Interface for error objects that may have a status property
interface ErrorWithStatus extends Error {
  status?: number
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds that data is cached
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        const errorWithStatus = error as ErrorWithStatus
        if (error instanceof Error && 'status' in error && errorWithStatus.status !== undefined && errorWithStatus.status >= 400 && errorWithStatus.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      // Refetch on window focus
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
}) 