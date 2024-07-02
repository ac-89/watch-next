const watchedBtns = document.querySelectorAll(".mark-watched");
const deleteBtns = document.querySelectorAll(".delete");
const addBtn = document.querySelectorAll(".add");

Array.from(watchedBtns).forEach((el) => {
  el.addEventListener("click", markWatched);
});

Array.from(deleteBtns).forEach((el) => {
  el.addEventListener("click", deleteMovie);
});

Array.from(addBtn).forEach((el) => {
  el.addEventListener("click", addMovie);
})


async function markWatched() {
  const movieId = this.dataset.id;
  console.log(`app.js markWatched ${movieId}`);
  try {
    const response = await fetch(`movies/markWatched/${movieId}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    console.log(`data: ${data}`);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function deleteMovie() {
  const movieId = this.dataset.id;
  try {
    const response = await fetch(`movies/deleteMovie/${movieId}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function addMovie() {
  console.log(this)
  const movieId = this.dataset.id;
  console.log(`app.js markWatched ${movieId}`);

  try {
    const response = await fetch(`movies/addMovie/${movieId}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}