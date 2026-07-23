const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
const FALLBACK = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';

export function resolveImage(imagePath) {
  if (!imagePath) return FALLBACK;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_ORIGIN}${imagePath}`;
}