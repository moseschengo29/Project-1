// Titles: https://omdbapi.com/?s=thor&page=1&apikey=a9db0233&
// details: http://www.omdbapi.com/?i=tt3896198&apikey=a9db0233

const search = document.querySelector("#search");
const searchList = document.getElementById("search-list");
const main = document.querySelector("#main");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");

const reviewForm = document.querySelector(".modal__form");
const allReviews = document.querySelector(".reviews");

let addRev = document.querySelector(".add-review-btn");
const movie = document.querySelector("#movie_title");

const reviewSection = document.querySelector(".all_reviews");

const featured = document.querySelector(".featured");
const featuredHeader = document.querySelector(".featured-header");

let inputData;

addRev.addEventListener("click", function (e) {
  openModal();
  console.log("clicked");
});

const fetchReviews = function () {
  fetch("http://localhost:3000/Reviews")
    .then((res) => res.json())
    .then(function (data) {
      data.forEach(function (dat) {
        // renderReview(dat);
        main.innerHTML = "";
        featured.innerHTML = "";
        featuredHeader.classList.add("hidden");
        let oneReview = document.createElement("div");
        oneReview.innerHTML = `

        <div class="review__data">
        <button class="close-review">&times;</button>
            <h3 class="review__name">REVIEW</h3>
            <p class="review__row"><span>🎬 </span>Movie: ${dat.movieTitle}</p>
            <p class="review__row"><span>👤</span>Name: ${dat.fullName}</p>
            <p class="review__row"><span>📩</span>Email: ${dat.emailAddress}</p>
            <p class="review__row"><span>🗣️</span>Review: ${dat.review}</p>
            <p class="review__row"><span>⭐</span>Rating: ${dat.rating}/5</p>
          </div>
    `;

        const del = oneReview.querySelector(".close-review");
        del.addEventListener("click", function (e) {
          e.preventDefault();
          const promptMess = prompt("Do you want to delete review? yes/no");

          if (promptMess.toLowerCase() === "yes") {
            deleteReview(dat);
          } else {
            alert("Review will not be deleted!");
          }

          fetchReviews();
        });
        reviewSection.append(oneReview);
      });
    });
};

// fetchReviews();

allReviews.addEventListener("click", function (e) {
  fetchReviews();
});

const deleteReview = function (review) {
  fetch(`http://localhost:3000/Reviews/${review.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        console.log("Review deleted successfully");
      } else {
        console.error("Failed to delete review");
      }
    })
    .catch((error) => {
      console.error("Error occurred during delete request:", error);
    });
};

const fetchReviewData = function () {
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let fullName = e.target.fullname.value;
    let movieTitle = e.target.movie_title.value;
    let emailAddress = e.target.email.value;
    let rating = e.target.rating.value;
    let review = e.target.review.value;

    inputData = {
      fullName,
      movieTitle,
      emailAddress,
      rating,
      review,
    };
    addReview(inputData);
    closeModal();
  });
};

fetchReviewData();

const addReview = function (review) {
  fetch(`http://localhost:3000/Reviews`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(review),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
};

// creating a modal function for when user clicks the buy button
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

// creating a close modal function for closing the modal
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// event listener for the close modal button
btnCloseModal.addEventListener("click", closeModal);

const loadMovies = async function (searchTerm) {
  const res = await fetch(
    `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=a9db0233&`
  );

  const data = await res.json();

  console.log(data.Search);

  if (data.Response == "True") {
    displayMovieList(data.Search);
    displayRelatedMovies(data.Search);
  }
};

search.addEventListener("keyup", function () {
  findMovies();
});

search.addEventListener("click", function () {
  findMovies();
});

function findMovies() {
  let searchTerm = search.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

// loadMovies("tt3896198");
const displayRelatedMovies = function (movies) {
  featuredHeader.classList.remove("hidden");
  featured.innerHTML = "";
  movies.forEach(function (movie) {
    if (movie.Poster != "N/A") moviePoster = movie.Poster;
    else moviePoster = "./images/image_not_found.png";
    const featuredMovie = document.createElement("div");
    featuredMovie.classList.add("featured-movie");

    featuredMovie.innerHTML = `
            <img src="${moviePoster}" alt="movie-poster" class="movie-poster">
            <p class="related-title">${movie.Title}</p>
            <p class="related-year">${movie.Year}</p>
        `;

    console.log(movie.Poster);

    featured.appendChild(featuredMovie);
  });
};

const displayMovieList = function (movies) {
  searchList.innerHTML = "";

  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "./images/image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
};

const loadMovieDetails = function () {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach(function (movie) {
    movie.addEventListener("click", function (e) {
      searchList.classList.add("hide-search-list");
      fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=a9db0233`)
        .then((res) => res.json())
        .then(function (data) {
          displayMovies(data);
          console.log(data);
        });
    });
  });
};

loadMovieDetails();

const displayMovies = function (movie) {
  main.innerHTML = "";
  reviewSection.innerHTML = "";

  let movieCard = document.createElement("div");
  movieCard.classList.add("grid");
  movieCard.innerHTML = `
    <div class="movie-img">
          <img
            src = "${
              movie.Poster != "N/A"
                ? movie.Poster
                : "./images/image_not_found.png"
            }" alt = "movie poster"
          />
        </div>
        <div class="movie-details">
          <p class="movie-title">Title: ${movie.Title}</p>
          <p class="movie-type"><span class="bold">Type: </span>${
            movie.Type
          }</p>
          <p class="movie-rated">PG-13</p>
          <p class="movie-year"><span class="bold">Year: </span>${
            movie.Year
          }</p>
          <p class="movie-dir">
            <span class="bold"> Directors: </span> ${movie.Director}
          </p>
          <p class="movie-genre">
            <span class="bold">Genre: </span>${movie.Genre}
          </p>
          <p class="movie-actors">
            <span class="bold"> Actors: </span> ${movie.Actors}
          </p>
          <p class="movie-awa">
            <ion-icon name="trophy-outline" class="icon"></ion-icon>
            : ${movie.Awards}
          </p>
          <p class="movie-plot">
            <span class="bold"> Plot: </span> ${movie.Plot}
          </p>
          <p class="movie-rat">
            <span class="bold">imdbRating: </span
            ><span class="rating">${movie.imdbRating}</span>
          </p>
          
        </div>
    `;

  main.appendChild(movieCard);
};

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
