import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import fs from 'fs';



const MOVIES_FILE = './movies.json';
const app = express();

interface Movie {
    id: number;
    name: string;
    year: string;
    director: string;
    genres: string[];
    poster: string;
    watched: boolean;
}

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.get('/movies', (req, res) => {

    const moviesString = fs.readFileSync(MOVIES_FILE, 'utf-8');
    const movies: Movie[] = JSON.parse(moviesString);
    res.json(movies);

})


app.post("/movies", async (req, res) => {
    const { title } = req.body;

    try {
        const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "False") {
            return res.status(404).json({ message: "Movie not found" });
        }

        const newMovie: Movie = {
            id: Date.now(),
            name: data.Title,
            year: data.Year,
            director: data.Director,
            genres: data.Genre.split(", "),
            poster: data.Poster,
            watched: false
        };

        const fileData = fs.readFileSync(MOVIES_FILE, "utf-8");
        const movies: Movie[] = JSON.parse(fileData);

        movies.push(newMovie);

        fs.writeFileSync("./movies.json", JSON.stringify(movies, null, 2));

        res.json(movies);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params;

    const fileData = fs.readFileSync(MOVIES_FILE, 'utf-8');
    const movies: Movie[] = JSON.parse(fileData)

    const updatedMovies = movies.filter(movie => movie.id !== Number(id))


    fs.writeFileSync(
        MOVIES_FILE,
        JSON.stringify(updatedMovies)
    )
    res.json(updatedMovies);

});

app.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const { watched } = req.body;

    const fileData = fs.readFileSync(MOVIES_FILE, 'utf-8');
    const movies: Movie[] = JSON.parse(fileData)

    const movie: Movie | undefined = movies.find(movie => movie.id === Number(id))
    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    movie.watched = Boolean(watched);

    fs.writeFileSync(
        MOVIES_FILE,
        JSON.stringify(movies, null, 2)
    );
    res.json(movie);
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));
