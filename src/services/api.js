/**
 * API service for interacting with Lorem Picsum API
 * Documentation: https://picsum.photos/
 */

const BASE_URL = 'https://picsum.photos';
const API_LIST_URL = `${BASE_URL}/v2/list`;

/* Fetch a list of photos from Lorem Picsum API */
export const fetchPhotos = async (page = 1, limit = 30) => {
  try {
    const response = await fetch(`${API_LIST_URL}?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};

/* Fetch details for a specific photo by ID */
export const fetchPhotoById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/id/${id}/info`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching photo ${id}:`, error);
    throw error;
  }
};

/* Get the URL for a photo thumbnail */
export const getPhotoThumbnailUrl = (id, width = 400, height = 300) => {
  return `${BASE_URL}/id/${id}/${width}/${height}`;
};

/* Get the URL for a full-size photo */
export const getPhotoUrl = (id, width = 1200, height = 800) => {
  return `${BASE_URL}/id/${id}/${width}/${height}`;
};
