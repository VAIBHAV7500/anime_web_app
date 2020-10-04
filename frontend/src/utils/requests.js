const API_KEY = process.env.REACT_APP_API_KEY;

const requests = {
    fetchTrending: `video/trending?api_key=${API_KEY}`,
    fetchBanner: `video/banner?api_key=${API_KEY}`,
    fetchTopRated: `video/trending?api_key=${API_KEY}`,
    fetchActionMovies: `video/genre?genre_id=action`,
    fetchComedyMovies: `video/trending?api_key=${API_KEY}`,
    fetchHorrorMovies: `video/trending?api_key=${API_KEY}`,
    fetchRomanceMovies: `video/trending?api_key=${API_KEY}`,
    fetchDocumentaries: `video/trending?api_key=${API_KEY}`,
    fetchEpisodes: `video/episodes`,
    fetchSuggestions: `search/suggestions`,
    fetchShowDetails: `shows/details`,
}

export default requests;


  