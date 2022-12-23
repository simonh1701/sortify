const sortOptions = [
  {
    attribute: "Original",
    order: null,
    sorter: (a, b) => a.index - b.index,
  },
  {
    attribute: "Title",
    order: "ascending",
    sorter: (a, b) => a.track.name.localeCompare(b.track.name),
  },
  {
    attribute: "Title",
    order: "descending",
    sorter: (a, b) => b.track.name.localeCompare(a.track.name),
  },
  {
    attribute: "Artist",
    order: "ascending",
    sorter: (a, b) =>
      a.track.artists
        .map((x) => x.name)
        .join(", ")
        .localeCompare(b.track.artists.map((x) => x.name).join(", ")),
  },
  {
    attribute: "Artist",
    order: "descending",
    sorter: (a, b) =>
      b.track.artists
        .map((x) => x.name)
        .join(", ")
        .localeCompare(a.track.artists.map((x) => x.name).join(", ")),
  },
  {
    attribute: "Duration",
    order: "ascending",
    sorter: (a, b) => a.track.duration_ms - b.track.duration_ms,
  },
  {
    attribute: "Duration",
    order: "descending",
    sorter: (a, b) => b.track.duration_ms - a.track.duration_ms,
  },
  {
    attribute: "Release Date",
    order: "ascending",
    sorter: (a, b) =>
      new Date(a.track.album.release_date) -
      new Date(b.track.album.release_date),
  },
  {
    attribute: "Release Date",
    order: "descending",
    sorter: (a, b) =>
      new Date(b.track.album.release_date) -
      new Date(a.track.album.release_date),
  },
];

export default sortOptions;
