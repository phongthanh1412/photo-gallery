import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPhotoById, getPhotoUrl } from '../services/api';

/**
 * PhotoDetail component - Displays detailed view of a single photo
 * Shows full-size image, author, title, and description
 */
const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadPhotoDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const photoData = await fetchPhotoById(id);
        
        if (isMounted) {
          setPhoto(photoData);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load photo details. Please try again.');
          console.error('Error loading photo details:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPhotoDetails();

    // Cleanup: prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [id]); 

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
          </div>
          <p className="mt-6 text-purple-300 text-lg animate-pulse">Unveiling the mystery...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-md bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <div className="text-red-400 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-semibold mb-2">Lost in the Void</p>
            <p className="text-red-300/80">{error}</p>
            <button
              onClick={() => navigate('/photos')}
              className="mt-6 inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Photo details
  if (!photo) {
    return null;
  }

  const fullImageUrl = getPhotoUrl(photo.id, 1200, 800);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/photos"
              className="inline-flex items-center text-purple-300 hover:text-purple-100 font-medium transition-colors group"
            >
              <svg
                className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Gallery
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PIXELVAULT
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="backdrop-blur-md bg-black/30 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden border border-purple-500/20">
          {/* Photo Image */}
          <div className="relative aspect-[3/2] bg-slate-900">
            <img
              src={fullImageUrl}
              alt={`Photo by ${photo.author}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Photo Information */}
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider">
                  Title
                </h3>
                <h1 className="text-3xl font-bold text-white mt-1">
                  {photo.author ? `Photo by ${photo.author}` : 'Untitled Photo'}
                </h1>
              </div>

              {/* Author */}
              <div>
                <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider">
                  Author
                </h3>
                <p className="text-xl text-purple-100 mt-1 flex items-center">
                  <span className="mr-2"></span>
                  {photo.author || 'Unknown Author'}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-purple-200/80 mt-1 leading-relaxed">
                  {photo.description || 
                    'A mystical capture from the depths of imagination. This ethereal photograph transcends reality, ' +
                    'weaving shadows and light into a tapestry of visual poetry. Each frame whispers secrets ' +
                    'that only the observant eye can decipher.'}
                </p>
              </div>

              {/* Photo Metadata */}
              <div className="pt-4 border-t border-purple-500/20">
                <h3 className="text-sm font-medium text-purple-400 uppercase tracking-wider mb-3">
                  Photo Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="backdrop-blur-sm bg-white/5 p-3 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-purple-300">Photo ID</p>
                    <p className="text-white font-medium">{photo.id}</p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/5 p-3 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-purple-300">Dimensions</p>
                    <p className="text-white font-medium">
                      {photo.width} × {photo.height}
                    </p>
                  </div>
                  <div className="backdrop-blur-sm bg-white/5 p-3 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-purple-300">Source</p>
                    <a
                      href={photo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 font-medium flex items-center transition-colors"
                    >
                      View Original
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="pt-4">
                <a
                  href={photo.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Full Resolution
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PhotoDetail;
