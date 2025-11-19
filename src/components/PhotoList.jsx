import { useState, useEffect, useCallback } from 'react';
import { fetchPhotos } from '../services/api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import PhotoCard from './PhotoCard';
import ErrorMessage from './ErrorMessage';

/**
 * PhotoList component - Displays a grid of photos with infinite scroll
 * Fetches photos from Lorem Picsum API and loads more as user scrolls
 */
const PhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const PHOTOS_PER_PAGE = 32;


  const loadPhotos = useCallback(async (pageNum, isInitial = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const newPhotos = await fetchPhotos(pageNum, PHOTOS_PER_PAGE);
      
      if (newPhotos.length === 0) {
        setHasMore(false);
      } else {
        setPhotos(prev => isInitial ? newPhotos : [...prev, ...newPhotos]);
        setPage(pageNum);
      }
    } catch (err) {
      setError('Failed to load photos. Please try again.');
      console.error('Error loading photos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Load initial photos on component mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialPhotos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const newPhotos = await fetchPhotos(1, PHOTOS_PER_PAGE);
        
        if (isMounted) {
          if (newPhotos.length === 0) {
            setHasMore(false);
          } else {
            setPhotos(newPhotos);
            setPage(1);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load photos. Please try again.');
          console.error('Error loading photos:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialPhotos();

    // Cleanup: prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []); 

  // Load more photos when user scrolls to bottom
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadPhotos(page + 1);
    }
  }, [page, isLoading, hasMore, loadPhotos]);

  // Set up infinite scroll observer
  const loadingRef = useInfiniteScroll(loadMore, hasMore, isLoading);

  // Retry loading photos after an error
  const handleRetry = () => {
    if (photos.length === 0) {
      loadPhotos(1, true);
    } else {
      loadPhotos(page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header - Dark & Mysterious */}
      <header className="bg-black/40 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 tracking-wider">
                PIXELVAULT
              </h1>
              <nav className="hidden lg:flex space-x-6 text-sm font-medium">
                {['Explore', 'Dark Gallery', 'Curated', 'Artists', 'Collections'].map((item) => (
                  <a key={item} href="#" className="text-purple-300 hover:text-pink-300 transition-colors duration-300">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button className="hidden md:inline-flex px-5 py-2 rounded-full border border-purple-500/30 text-sm font-medium text-purple-300 hover:bg-purple-500/10 backdrop-blur-sm transition-all duration-300">
                Share
              </button>
              <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all duration-300">
                Follow
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-purple-500/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full px-5 py-3 border border-purple-500/20 hover:border-purple-500/40 transition-all">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search the darkness..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-purple-200 placeholder-purple-400/50 ml-3"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3 text-sm font-medium">
              {['Mystical', 'Gothic', 'Ethereal', 'Noir'].map((item, index) => (
                <button
                  key={item}
                  className={`px-5 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                      : 'bg-white/5 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 hover:bg-white/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Featured categories - Dark & Eerie */}
      <section className="bg-gradient-to-b from-black/40 to-transparent border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="relative group">
            {/* Left scroll button */}
            <button
              onClick={() => {
                const container = document.getElementById('category-scroll');
                container.scrollBy({ left: -300, behavior: 'smooth' });
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:shadow-[0_0_30px_rgba(168,85,247,0.9)] transition-all duration-300"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Category scroll container */}
            <div id="category-scroll" className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide">
              {[
                { name: 'Dark Arts', active: false },
                { name: 'Gothic', active: false },
                { name: 'Photography', active: true },
                { name: 'Mystical', active: false },
                { name: 'Macabre', active: false },
                { name: 'Noir', active: false },
                { name: 'Ethereal', active: false },
                { name: 'Neon Dreams', active: false },
                { name: 'Cosmic', active: false },
                { name: 'Surreal', active: false },
              ].map((item) => (
                <button
                  key={item.name}
                  className={`min-w-[180px] px-6 py-4 rounded-2xl text-sm font-bold backdrop-blur-sm transition-all duration-300 ${
                    item.active
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-[0_0_25px_rgba(168,85,247,0.7)]'
                      : 'bg-white/5 text-purple-300 border border-purple-500/20 hover:border-purple-500/50 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Right scroll button */}
            <button
              onClick={() => {
                const container = document.getElementById('category-scroll');
                container.scrollBy({ left: 300, behavior: 'smooth' });
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.6)] flex items-center justify-center opacity-0 group-hover:opacity-100 hover:shadow-[0_0_30px_rgba(168,85,247,0.9)] transition-all duration-300"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section - Mysterious & Beautiful */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="mb-6 inline-block">
            <span className="text-sm uppercase tracking-[0.3em] text-purple-400 font-bold bg-purple-500/10 px-6 py-2 rounded-full border border-purple-500/30">
              Curated Darkness
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-8 tracking-tight leading-tight pb-4">
            Photography
          </h2>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed mb-12 pb-2">
            Venture into the shadows where light meets darkness. Discover hauntingly beautiful portraits, 
            ethereal landscapes, and mystical captures from artists who dare to explore the unseen.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {['All Mysteries', 'Dark Photography', 'Gothic', 'Noir', 'Ethereal', 'Surreal'].map((tag, index) => (
              <button
                key={tag}
                className={`px-6 py-3 rounded-full text-sm font-bold backdrop-blur-sm transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                    : 'bg-white/5 border border-purple-500/30 text-purple-300 hover:border-purple-500/50 hover:bg-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center px-10 py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:shadow-[0_0_50px_rgba(168,85,247,1)] transform hover:scale-105 transition-all duration-300">
            Enter the Realm
          </button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Initial Loading State */}
        {isLoading && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
            <p className="mt-6 text-purple-300 text-lg">Summoning images from the void...</p>
          </div>
        )}

        {/* Error State (Initial) */}
        {error && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-red-900/20 backdrop-blur-sm rounded-2xl border border-red-500/30">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}

        {/* Loading More Indicator */}
        {photos.length > 0 && hasMore && (
          <div ref={loadingRef} className="mt-16">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)]"></div>
                <p className="mt-6 text-purple-300">Revealing more mysteries...</p>
              </div>
            )}
          </div>
        )}

        {/* Error State (While Loading More) */}
        {error && photos.length > 0 && (
          <div className="mt-16">
            <div className="p-8 bg-red-900/20 backdrop-blur-sm rounded-2xl border border-red-500/30">
              <ErrorMessage message={error} onRetry={handleRetry} />
            </div>
          </div>
        )}

        {/* End of List Message */}
        {!hasMore && photos.length > 0 && (
          <div className="text-center py-16 mt-12 border-t border-purple-500/20">
            <div className="inline-block mb-4">
              <span className="text-6xl animate-pulse"></span>
            </div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
              The End of the Journey
            </p>
            <p className="text-purple-300 text-lg">You've explored all the mysteries. Check back soon for more enchantment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PhotoList;
