const API_KEY = process.env.REACT_APP_API_KEY;

const requests = {
    
    fetchTrending: `video/trending?api_key=${API_KEY}`,
    fetchBanner: `video/banner?api_key=${API_KEY}`,
    fetchTopRated: `video/trending?api_key=${API_KEY}`,
    fetchActionMovies: `video/trending?api_key=${API_KEY}`,
    fetchComedyMovies: `video/trending?api_key=${API_KEY}`,
    fetchHorrorMovies: `video/trending?api_key=${API_KEY}`,
    fetchRomanceMovies: `video/trending?api_key=${API_KEY}`,
    fetchDocumentaries: `video/trending?api_key=${API_KEY}`,
    // fetchActionMovies: `/video/genre?api_key=${API_KEY}&genre_id=1`,
    // fetchComedyMovies: `/video/genre?api_key=${API_KEY}&genre_id=1`,
    // fetchHorrorMovies: `/video/genre?api_key=${API_KEY}&genre_id=1`,
    // fetchRomanceMovies: `/video/genre?api_key=${API_KEY}&genre_id=1`,
    // fetchDocumentaries: `/video/genre?api_key=${API_KEY}&genre_id=1`,
    fetchEpisodes: `video/episodes`,
    fetchSuggestions: `search/suggestions`,
}

export default requests;


  