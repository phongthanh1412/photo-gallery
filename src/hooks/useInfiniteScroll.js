import { useEffect, useRef } from 'react';

/**
 * Custom hook for implementing infinite scroll functionality
 * @param {Function} callback - Function to call when user scrolls to bottom
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} isLoading - Whether data is currently being loaded
 * @returns {Object} Reference to attach to the loading indicator element
 */
export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef();
  const loadingRef = useRef(null);

  useEffect(() => {
    if (isLoading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    });

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [callback, hasMore, isLoading]);

  return loadingRef;
};
