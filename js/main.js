import { listenAuthState } from './auth.js';
import { headerWhileScrolling, wrapper, renderCards, logout, search, cardPageRender } from './ui.js';
import { fetchMovies } from './api.js'

listenAuthState();
headerWhileScrolling();
wrapper();
logout();
search();
cardPageRender();

const loadCards = async () => {
    try {
        const bestMovies = await fetchMovies('top_rated');
        renderCards('#container-best>.card-wrapper', bestMovies.results);

        const popularMovies = await fetchMovies('popular');
        renderCards('#container-popular>.card-wrapper', popularMovies.results);

        const newMovies = await fetchMovies('now_playing');
        renderCards('#container-new>.card-wrapper', newMovies.results);
    } catch (error) {
        console.error('Loading error:', error);
    }

}
loadCards();