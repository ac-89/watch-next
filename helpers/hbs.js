module.exports = {
  addIcon: function (movieUser, loggedUser, movieId, floating = true) {
    if (movieUser._id.toString() == loggedUser.id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${movieId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/stories/edit/${movieId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
};
