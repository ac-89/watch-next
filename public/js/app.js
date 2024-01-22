const delBtns = document.querySelectorAll(".bin");

Array.from(delBtns).forEach((btn) => {
  btn.addEventListener("click", deleteMovie);
});

async function deleteMovie() {
  //Grab the text content of the task to be deleted
  const itemText = this.childNodes[1].innerHTML;
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
