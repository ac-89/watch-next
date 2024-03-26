$(document).ready(function () {
  $("#title").autocomplete({
    source: async function (request, response) {
      let data = await fetch(
        "https://api.themoviedb.org/3/search/movie?query=" + request.term
      )
        .then((results) => results.json())
        .then((results) => {
          results.map((result) => {
            return {
              label: result.title,
              value: result.title,
              id: result._id,
            };
          });
        });
      response(data);
    },
    minLength: 2,
  });
});
