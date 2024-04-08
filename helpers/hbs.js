module.exports = {
  addIcon: function (movieId, floating = true) {
    return `<a href="/movies/add/${movieId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
};
