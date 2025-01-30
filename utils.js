import { BASE_URL, MOVIES } from './constants.js';
import { getFromLS, saveToLS } from './localStorage.js';

const moviesContainerEl = document.getElementById('movies-container');

// Hämta data från API:et
async function fetchMovies() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Error status: ${response.status}`);
    }
    const data = await response.json();

    // Ändra i varje filmobjekt, så den får review och rating. Loopa över listan
    data.forEach((movie) => {
      movie.seen = false;
      movie.rating = 0;
      movie.review = '';
    });

    // Spara svaret från API till LS
    saveToLS(MOVIES, data);
  } catch (error) {
    console.error(error);
  }
}

// Genom att lägga till export-nyckelordet innan så gör jag denna funktionen tillgänglig för externa filer att importera, att använda sig utav helt enkelt. Detta är en namngiven export, vilket betyder att vi måste importera den med exakt samma namn och i curly brackets i den andra filen.
export function checkMovies() {
  // Kolla om det redan finns filmer i LS
  const movies = getFromLS(MOVIES);

  if (movies) {
    // I så fall: rendera från LS
    renderMoviesToUI(movies);
  } else {
    // Annars hämta data från API
    fetchMovies().then(() => {
      // Vi kopplar på en .then-metod för att "vänta" in fetchMovies innan vi anropar renderMoviesToUi som försöker rendera ut saker i browsern.
      const UpdatedMovies = getFromLS(MOVIES);
      renderMoviesToUI(UpdatedMovies);
    });
  }
}

// Rendera movies till UI
function renderMoviesToUI(movies) {
  const movieCardsAsString = movies.map((m) => createMovieCard(m)).join('');
  moviesContainerEl.innerHTML = movieCardsAsString;

  // Vi reggar en eventlyssnare för hela sidan istället för en per movie.
  moviesContainerEl.addEventListener('click', (e) => {
    const target = e.target;

    // closest() leter efter närmsta förälderelement som matchar den givna selektorn. Den startar sökningen på elementet som anropade metoden, för att sen "klättra" uppåt.
    const article = target.closest('article');

    if (article) {
      window.location.href = `/movieView.html?id=${encodeURIComponent(article.id)}`;
    }
  });
}

function createMovieCard(movie) {
  return `
    <article id="${movie.id}">
      <figure style="background-image: url(${movie.image})">
        <p>
            <span class="rt-score">${movie.rt_score}%</span>
        </p>
      </figure>
      <h3>
          ${movie.title}
      </h3>
      <p>
          ${movie.release_date}
      </p>
    </article>
  `;
}
