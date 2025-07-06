import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { searchMovie, getMovieById, getMovieTrailer } from './api.js'

const headerWhileScrolling = () => {
    const mainHeader = document.querySelector('.main-header');
    const headerLinks = document.querySelectorAll('.main-header>nav>a');
    window.onscroll = () => {
        if (scrollY > 100) {
            mainHeader.style.height = '18vh';
            headerLinks.forEach(link => {
                link.style.color = '#2f2f2f';
                link.style.backgroundColor = '#f1f2f3';
            })
        } else {
            mainHeader.style.height = '12vh';
            headerLinks.forEach(link => {
                link.style.backgroundColor = 'transparent';
                link.style.color = 'white';
            })
        }
    }
}

const wrapper = () => {
    let isDown = false;
    let startX;
    let scrollLeft;
    const wrappers = document.getElementsByClassName('card-wrapper');
    Array.from(wrappers).forEach(wrapZone => {
        let scrollStep = 1;
        let scrollTurn = 'right';
        wrapZone.onmousedown = (e) => {
            isDown = true;
            startX = e.pageX - wrapZone.offsetLeft;
            scrollLeft = wrapZone.scrollLeft;

        }
        wrapZone.onmouseover = () => {
            scrollStep = 0;
        }

        wrapZone.onmouseleave = () => {
            isDown = false;
            if (scrollTurn === 'right') {
                scrollStep = 0.5;
            } else {
                scrollStep = -0.5;
            }
        }

        wrapZone.onmouseup = () => {
            isDown = false;
        }


        wrapZone.onmousemove = (e) => {
            if (!isDown) return;
            if (e.target.closest('.card') !== null) return;

            const x = e.pageX - wrapZone.offsetLeft;
            const walk = (x - startX) * 1.1;

            wrapZone.scrollLeft = scrollLeft - walk;
        }

        setInterval(() => {
            if (wrapZone.classList.contains('search-card-wrapper')) return;
            if (isDown) return;

            wrapZone.scrollLeft += scrollStep;

            if (wrapZone.scrollLeft + wrapZone.clientWidth >= wrapZone.scrollWidth) {
                scrollTurn = 'left';
                scrollStep = -0.5;
            } else if (wrapZone.scrollLeft <= 0) {
                scrollTurn = 'right';
                scrollStep = 0.5;
            }
        }, 20);
    })
}


const renderCards = (containerSelector, movies) => {
    const container = document.querySelector(containerSelector);

    container.innerHTML = '';

    movies.forEach(movie => {
        const card = document.createElement('article');
        card.classList.add('card');
        card.classList.add('fade-in');
        card.innerHTML = `
      <header>
        <h2>${movie.title}</h2>
        <p>${movie.overview.slice(0, 100)}... <em>view more</em></p>
      </header>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    `;
        container.appendChild(card);
        card.setAttribute('data-id', movie.id)
    })
}

const logout = () => {
    const logoutButton = document.getElementById('logout-button');

    logoutButton.addEventListener('click', () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('Logout error:', error);
            });
    })
}

const search = () => {
    const searchInput = document.querySelector('.search>div>form>input');
    const searchZone = document.querySelector('.search>div>.search-card-wrapper');
    const searchButton = document.querySelector('.search>div>form>button');
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() !== '') {
            searchZone.classList.add('search-zone');
        } else {
            searchZone.classList.remove('search-zone');
        }
    })
    searchInput.addEventListener('blur', () => {
        searchZone.classList.remove('search-zone');
    })
    const searchFunction = async () => {
        const searchQuery = searchInput.value.trim()
        if (!searchQuery) return;


        try {
            const results = await searchMovie(searchQuery);
            renderCards('.search>div>.search-card-wrapper', results);

            searchZone.classList.add('search-zone');
        } catch (error) {
            console.error('Search error:', error);
        }

    }

    searchZone.addEventListener('mousedown', (e) => {
        e.preventDefault();
    })

    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    searchInput.addEventListener('input', debounce(() => {
        searchFunction();
    }, 800));
    searchButton.addEventListener('click', searchFunction)
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchFunction();
        }
    })

}

const cardPageRender = () => {
    document.body.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (!card) return;
        const id = card.dataset.id;

        if (id) {
            window.open(`movie-page.html?id=${id}`, '_blank');
        }
    })
}

const renderMovieDetails = async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    try {
        const movie = await getMovieById(id);
        const trailerKey = await getMovieTrailer(id);
        const container = document.querySelector('.movie-details');

        document.title = movie.title;

        container.innerHTML = `
            <header class="page-header">
                <h2>${movie.title}</h2>
                <div class="movie-poster">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" width="100%" height="100%">
                </div>
            </header>
            <main>
                <div class="info">
                    <p><strong>Overview:</strong> ${movie.overview}</p>
                    <p><strong style = "color: #e50914">Genres:</strong> <em>${movie.genres.map(g => g.name).join(', ')}</em></p>
                    <p><strong style = "color: #e50914">Rating:</strong> <em>${Math.round(movie.vote_average * 10) / 10}/10</em></p>
                    <p><strong style = "color: #e50914">Release date:</strong> <em>${movie.release_date}</em></p>
                </div>
                ${trailerKey ? `
            <div class="trailer">
                <iframe width="100%" height="100%" 
                    src="https://www.youtube.com/embed/${trailerKey}" 
                    frameborder="0" allowfullscreen>
                </iframe>
            </div>` : ``}

            </main>
            <footer>
                <div class="footer-content">
                    <p>© 2025 KinoLibrary. Created by Narek Babajanyan.</p>
                    <ul>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="https://github.com/NarekBabajanyann" target="_blank">GitHub</a></li>
                    </ul>
                </div>
            </footer>
        `;
    } catch (err) {
        console.error('Failed to load movie info:', err);
    }
};


export { headerWhileScrolling, wrapper, renderCards, logout, search, cardPageRender, renderMovieDetails };