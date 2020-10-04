const API_KEY = process.env.REACT_APP_API_KEY;

const requests = {
    fetchTrending: `video/trending?api_key=${API_KEY}`,
    fetchBanner: `video/banner`,
    fetchTopRated: `video/genre?genre_id=Supernatural`,
    fetchActionMovies: `video/genre?genre_id=action`,
    fetchComedyMovies: `video/genre?genre_id=comedy`,
    fetchHorrorMovies: `video/genre?genre_id=horror`,
    fetchRomanceMovies: `video/genre?genre_id=romance`,
    fetchDrama: `video/genre?genre_id=drama`,
    fetchDocumentaries: `video/trending?api_key=${API_KEY}`,
    fetchEpisodes: `video/episodes`,
    fetchSuggestions: `search/suggestions`,
    fetchShowDetails: `shows/details`,
}

export default requests;


  