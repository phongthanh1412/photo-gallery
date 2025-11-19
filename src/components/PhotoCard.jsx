import { Link } from 'react-router-dom';
import { getPhotoThumbnailUrl } from '../services/api';

/**
 * PhotoCard component - Displays a single photo card in the grid
 * @param {Object} props - Component props
 * @param {Object} props.photo - Photo object containing id, author, and other details
 */
const PhotoCard = ({ photo }) => {
  const thumbnailUrl = getPhotoThumbnailUrl(photo.id, 400, 300);

  return (
    <Link
      to={`/photos/${photo.id}`}
      className="group block relative overflow-hidden rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-500 border border-purple-500/20 hover:border-purple-500/50"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-900">
        <img
          src={thumbnailUrl}
          alt={`Photo by ${photo.author}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:brightness-75"
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5">
        <h3 className="text-white font-bold text-base mb-3 drop-shadow-lg">
          {photo.author}
        </h3>
        <div className="flex items-center space-x-4 text-purple-300 text-sm">
          <span className="flex items-center backdrop-blur-sm bg-white/5 px-3 py-1 rounded-full border border-purple-500/30">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            {Math.floor(Math.random() * 1000) + 500}
          </span>
          <span className="flex items-center backdrop-blur-sm bg-white/5 px-3 py-1 rounded-full border border-pink-500/30">
            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
            {Math.floor(Math.random() * 100) + 20}
          </span>
        </div>
      </div>
      {/* Mystical glow overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20"></div>
      </div>
    </Link>
  );
};

export default PhotoCard;
