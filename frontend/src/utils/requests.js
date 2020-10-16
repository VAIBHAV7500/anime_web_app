const API_KEY = process.env.REACT_APP_API_KEY;

const requests = {
    fetchTrending: `api/video/trending?api_key=${API_KEY}`,
    fetchBanner: `api/video/banner`,
    fetchTopRated: `api/video/genre?genre_id=Supernatural`,
    fetchActionMovies: `api/video/genre?genre_id=action`,
    fetchComedyMovies: `api/video/genre?genre_id=comedy`,
    fetchHorrorMovies: `api/video/genre?genre_id=horror`,
    fetchRomanceMovies: `api/video/genre?genre_id=romance`,
    fetchDrama: `api/video/genre?genre_id=drama`,
    fetchDocumentaries: `api/video/trending?api_key=${API_KEY}`,
    fetchEpisodes: `api/video/episodes`,
    fetchSuggestions: `api/search/suggestions`,
    fetchShowDetails: `api/shows/details`,
    characters: `/api/character`,
    reviews: `/api/review`,
}

export default requests;


  