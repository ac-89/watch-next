const delBtns = document.querySelectorAll(".bin");
const watchedBtns = document.querySelectorAll(".fa-check");

Array.from(delBtns).forEach((btn) => {
  btn.addEventListener("click", deleteMovie);
});

Array.from(watchedBtns).forEach((btn) => {
  btn.addEventListener("click", markWatched);
});

async function deleteMovie() {
  //Grab the text content of the task to be deleted
  const itemText = this.parentNode.childNodes[1].innerHTML;
  console.log(itemText);
  try {
    const response = await fetch("deleteMovie", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieFromJS: itemText,
      }),
    });
    const data = await response.json();
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function markWatched() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    const response = await fetch("markWatched", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
