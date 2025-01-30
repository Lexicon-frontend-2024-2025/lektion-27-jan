console.log("koden är länkad");
const BASE_URL = "https://ghibliapi.vercel.app/films/";

checkMovies();

// ########## functions below #########

// få data från API:et
async function fetchMovies() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Error status: ${response.status}`);
        }
        const data = await response.json();

        // ändra i varje filmobjekt, så den får review och rating
        // loopa över listan
        data.forEach(movie => {
            movie.seen = false;
            movie.rating = 0;
            movie.review = "";
        });
        // spara svaret från API till LS
        localStorage.setItem("all_movies", JSON.stringify(data));
    }
    catch (error) {
        console.error(error);
    }
};

function checkMovies() {
    // kolla om det redan finns filmer i LS
    const all_movies = JSON.parse(localStorage.getItem("all_movies"));

    if (all_movies) {
        // i så fall: rendera från LS
        renderMoviesToUI(all_movies);
    } else {
        // annars hämta data från API
        fetchMovies().then(() => {
            const updated_all_movies = JSON.parse(localStorage.getItem("all_movies"));
            console.log(updated_all_movies)
            renderMoviesToUI(updated_all_movies);

            // Vi kopplar på en .then-metod för att "vänta" in fetchMovies innan vi anropar renderMoviesToUi som faktiskt förösker rendera ut saker i browsern.
        });
    }
};

// rendera från LS till mitt UI
function renderMoviesToUI(movies) {
    const moviesContainerEl = document.getElementById('movies-container');
    const movieCardsAsString = movies.map((m) => createMovieCard(m)).join("")
    moviesContainerEl.innerHTML = movieCardsAsString;

    //     movieContainerEl.addEventListener("click", () => {
    //         console.log(movie);
    //         // den skall slussa mig till en ny sida
    //         window.location.href = `/movieView.html?id=${encodeURIComponent(movie.id)}`;
    //     });

    

};

function createMovieCard (movie){
    return `
        <article>
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
    `
}
