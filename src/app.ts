interface Movie {
    id: number;
    name: string;
    year: string;
    director: string;
    genres: string[];
    poster: string;
    watched: boolean;
}

let allMovies: Movie[] = [];

async function fetchMovies() {
    try {
        const response = await fetch("/movies");

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data: Movie[] = await response.json();

        allMovies = data;

        renderMovies(data);

    } catch (error) {
        console.error("Failed to fetch movies:", error);
    }
}


function renderMovies(movies: Movie[]) {
    const container = document.getElementById("movie-list")!;

    console.log(movies);
    const html = movies.map(movie => {
        return `
            <div class="movie-card">
                <img src="${movie.poster}" alt="${movie.name}" />

                <h3>${movie.name} (${movie.year})</h3>

                <p>${movie.genres.join(", ")}</p>

                <button class="watch-btn" data-id="${movie.id}" data-watched="${movie.watched}">
                    ${movie.watched ? "Watched" : "Mark Watched"}
                </button>

                <button class="delete-btn" data-id="${movie.id}">
                    Remove
                </button>
            </div>
        `;
    });

    container.innerHTML = html.join("");
}

const movieListEl = document.getElementById('movie-list')!;


movieListEl.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;


    const id = target.dataset.id
    if (!id) return;

    try {

        if (target.classList.contains("watch-btn")) {
            const isWatched = target.dataset.watched === "true";
            await fetch(`/movies/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ watched: !isWatched }),
            });
        }

        if (target.classList.contains("delete-btn")) {
            await fetch(`/movies/${id}`, {
                method: "DELETE",
            });
        }

        fetchMovies()

    } catch (error) {
        console.error("Action failed:", error);
    }
});

const addBtn = document.getElementById("add-btn")
const titleInput = document.getElementById("title-input") as HTMLInputElement;

addBtn!.addEventListener("click", async () => {
    const title = titleInput.value.trim();

    if (!title) return;

    try {
        const response = await fetch("/movies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                alert("Movie not found");
            } else {
                alert("Something went wrong");
            }
            return;
        }

        titleInput.value = "";
        await fetchMovies();

    } catch (error) {
        console.error("Failed to add movie:", error);
        alert("Network error");
    }
});



const randomizeBtn = document.getElementById("randomize-btn") as HTMLButtonElement;
const ignoreWatchedCheckbox = document.getElementById("ignore-watched-checkbox") as HTMLInputElement;
const resultEl = document.getElementById("result")!;

let spinInterval: number | null = null;

randomizeBtn.addEventListener("click", () => {
    const filtered = ignoreWatchedCheckbox.checked
        ? allMovies.filter(movie => !movie.watched)
        : allMovies;

    if (filtered.length === 0) {
        resultEl.textContent = "No movies available";
        return;
    }

    randomizeBtn.disabled = true;

    const winnerIndex = Math.floor(Math.random() * filtered.length);
    const winner = filtered[winnerIndex];

    spinInterval = setInterval(() => {
        const randomMovie = filtered[Math.floor(Math.random() * filtered.length)]!;
        resultEl.textContent = `${randomMovie.name}`;
    }, 100);

    setTimeout(() => {
        if (spinInterval) clearInterval(spinInterval);

        resultEl.textContent = `${winner!.name.toUpperCase()}`;

        randomizeBtn.disabled = false;

        localStorage.setItem("lastWinner", winner!.name);

    }, 2200);
});

const lastWinner = localStorage.getItem("lastWinner");

if (lastWinner) {
    resultEl.innerHTML = `Last movie chosen:<br><b>${lastWinner}</b>`;
}

fetchMovies();  