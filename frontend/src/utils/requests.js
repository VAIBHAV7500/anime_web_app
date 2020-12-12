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
    fetchFantasy: `api/video/genre?genre_id=fantasy`,
    fetchAdventure: `api/video/genre?genre_id=adventure`,
    fetchEpisodes: `api/video/episodes`,
    fetchSuggestions: `api/search/suggestions`,
    fetchShowDetails: `api/shows/details`,
    characters: `/api/character`,
    reviews: `/api/review`,
    relatedShows: `/api/shows/similar`,
    fetchWatchlist : `/api/list/watchlist`,
    postWatchlist: `/api/list/add-watchlist`,
    removeWatchlist: `/api/list/remove-watchlist`,
    fetchCurrentlyWatching : `/api/list/currently-watching`,
    postCurrentlyWatching: `/api/list/add-currently-watching`,
    fetchCompletedShows : `/api/list/completed`,
    postCompletedShows: `/api/list/add-completed`,
    fetchVideoDetails: `/api/video/details`,
    postVideoSessions: `/api/video/sessions`,
    myReviews: '/api/review/my-reviews',
    notification: '/api/notification/unread',
    notificationRead: '/api/notification/mark-read',
    userDetails: '/api/user/details',
}

export default requests;


  