import { Client, Databases, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const databases = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const documentId = `movie_${movie.id}`;
    
    try {
      const doc = await databases.getDocument(DATABASE_ID, TABLE_ID, documentId);
      await databases.updateDocument(DATABASE_ID, TABLE_ID, documentId, {
        count: doc.count + 1,
      });
    } catch (error) {
      if (error.code === 404) {
        try {
          await databases.createDocument(DATABASE_ID, TABLE_ID, documentId, {
            searchTerm: searchTerm || 'discover',
            movie_id: movie.id,
            title: movie.title,
            poster_url: movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
              : 'https://via.placeholder.com/500x750?text=No+Image',
            count: 1,
          });
        } catch (createError) {
          if (createError.code === 409) {
            const doc = await databases.getDocument(DATABASE_ID, TABLE_ID, documentId);
            await databases.updateDocument(DATABASE_ID, TABLE_ID, documentId, {
              count: doc.count + 1,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating search count:', error);
  }
};

export const getTrendingMovies = async (limit = 10) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, TABLE_ID, [
      Query.orderDesc('count'),
      Query.limit(limit),
    ]);
    return result.documents;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};
