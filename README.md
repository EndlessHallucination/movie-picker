# Movie Picker

A full-stack movie selection application built with **TypeScript**, **Node.js**, and **Express**.

Users can search for movies using the OMDb API, maintain a personal watch list, mark movies as watched, remove movies, and let the application randomly choose what to watch next.

---

## Features

* Search movies by title
* Fetch movie data from the OMDb API
* Display movie posters and information
* Mark movies as watched
* Delete movies from the list
* Ignore watched movies during random selection
* Save the last selected movie with `localStorage`
* Store movie data in a local JSON file

---

## Technologies Used

### Frontend

* HTML5
* CSS3
* TypeScript
* Fetch API
* localStorage

### Backend

* Node.js
* Express
* TypeScript

### Dependencies

* express
* cors
* dotenv
* concurrently
* tsx

### External API

* OMDb API

---

## Project Structure

```text
movie-picker
│
├── public/
│   ├── index.html
│   └── style.css
│
├── src/
│   └── app.ts          # Frontend TypeScript
│
├── dist/
│   └── app.js          # Compiled JavaScript output
│
├── server.ts           # Express server and API routes
├── movies.json         # Local movie storage
├── package.json
├── tsconfig.json
└── .env
```

---

## API Endpoints

### Get all movies

```http
GET /movies
```

Returns the current movie collection.

---

### Add a movie

```http
POST /movies
```

Request body:

```json
{
  "title": "Inception"
}
```

The server retrieves movie information from the OMDb API and stores it in `movies.json`.

---

### Update watched status

```http
PATCH /movies/:id
```

Request body:

```json
{
  "watched": true
}
```

---

### Delete a movie

```http
DELETE /movies/:id
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd movie-picker
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
OMDB_API_KEY=your_api_key
```

Start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```



---

