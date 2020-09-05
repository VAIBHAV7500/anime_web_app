const API_KEY = process.env.REACT_APP_API_KEY;

const requests = {
    
    fetchTrending: `video/trending?api_key=${API_KEY}`,
    fetchBanner: `video/banner?api_key=${API_KEY}`,
    fetchTopRated: `video/trending?api_key=${API_KEY}`,
    fetchActionMovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedyMovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomanceMovies: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,

}

export default requests;


  