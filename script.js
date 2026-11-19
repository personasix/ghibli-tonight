const pickButton = document.querySelector("#pick-movie");
const statusMessage = document.querySelector("#movie-status");
const movieCard = document.querySelector("#movie-card");
const movieTitle = document.querySelector("#movie-title");
const moviePoster = document.querySelector("#movie-poster");
const movieDetails = document.querySelector("#movie-details");
const movieDescription = document.querySelector("#movie-description");

let films = [];
let previousFilmId = null;

async function loadFilms() {
  try {
    const response = await fetch("https://ghibliapi.vercel.app/films");

    if (!response.ok) {
      throw new Error(`Studio Ghibli API returned HTTP ${response.status}`);
    }

    films = await response.json();

    if (!Array.isArray(films) || films.length === 0) {
      throw new Error("The API returned an empty or invalid film list.");
    }

    pickButton.disabled = false;
    statusMessage.textContent = "Ready to pick a movie.";
  } catch (error) {
    console.error(error);
    statusMessage.textContent = "Couldn’t load the films. Refresh to try again.";
  }
}

pickButton.addEventListener("click", () => {
  // Skip the previous pick when there is another film available.
  const choices = films.length > 1
    ? films.filter(film => film.id !== previousFilmId)
    : films;

  const randomIndex = Math.floor(Math.random() * choices.length);
  const film = choices[randomIndex];
  previousFilmId = film.id;

  movieTitle.textContent = film.title;
  movieDetails.textContent = `${film.release_date} · ${film.running_time} minutes`;
  movieDescription.textContent = film.description;

  moviePoster.replaceChildren();
  if (film.image) {
    const poster = document.createElement("img");
    poster.src = film.image;
    poster.alt = `Poster for ${film.title}`;
    poster.width = 200;
    moviePoster.append(poster);
  }

  movieCard.hidden = false;
  pickButton.textContent = "Pick another";
  statusMessage.textContent = `Tonight’s pick is ${film.title}.`;
});

loadFilms();