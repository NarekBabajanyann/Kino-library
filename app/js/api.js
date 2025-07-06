import { apiKey } from "./config.js";
const baseLink = "https://api.themoviedb.org/3";

const fetchMovies = async (category) => {
    const url = `${baseLink}/movie/${category}?api_key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error loading movies');
    return res.json();
}

const searchMovie = async (query) => {
    const url = `${baseLink}/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results;
};


const getMovieById = async (id) => {
    const response = await fetch(`${baseLink}/movie/${id}?api_key=${apiKey}&language=en-US`);
    if (!response.ok) throw new Error('Movie loading error');
    return await response.json();
};

const getMovieTrailer = async (id) => {
    const res = await fetch(`${baseLink}/movie/${id}/videos?api_key=${apiKey}&language=en-US`);
    const data = await res.json();
    const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    return trailer ? trailer.key : null;
};

export { fetchMovies, searchMovie, getMovieById, getMovieTrailer };