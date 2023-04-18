const compare = (a, b) => {
  if (!a) return -1;
  if (!b) return 1;
  if (a === b) return 0;
  return a - b;
};

const sortOptions = [
  {
    attribute: "Original",
    order: null,
    sorter: (a, b) => compare(a.index, b.index),
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
    sorter: (a, b) => compare(a.track.duration_ms, b.track.duration_ms),
  },
  {
    attribute: "Duration",
    order: "descending",
    sorter: (a, b) => compare(b.track.duration_ms, a.track.duration_ms),
  },
  {
    attribute: "Release Date",
    order: "ascending",
    sorter: (a, b) => {
      const dateA = a.track.album?.release_date
        ? new Date(a.track.album?.release_date)
        : null;
      const dateB = b.track.album?.release_date
        ? new Date(b.track.album?.release_date)
        : null;

      return compare(dateA, dateB);
    },
  },
  {
    attribute: "Release Date",
    order: "descending",
    sorter: (a, b) => {
      const dateA = a.track.album?.release_date
        ? new Date(a.track.album?.release_date)
        : null;
      const dateB = b.track.album?.release_date
        ? new Date(b.track.album?.release_date)
        : null;

      return compare(dateB, dateA);
    },
  },
  {
    attribute: "Popularity",
    order: "ascending",
    sorter: (a, b) => compare(a.track?.popularity, b.track?.popularity),
  },
  {
    attribute: "Popularity",
    order: "descending",
    sorter: (a, b) => compare(b.track?.popularity, a.track?.popularity),
  },
  {
    attribute: "Acousticness",
    order: "ascending",
    sorter: (a, b) =>
      compare(a.audio_features?.acousticness, b.audio_features?.acousticness),
  },
  {
    attribute: "Acousticness",
    order: "descending",
    sorter: (a, b) =>
      compare(b.audio_features?.acousticness, a.audio_features?.acousticness),
  },
  {
    attribute: "Danceability",
    order: "ascending",
    sorter: (a, b) =>
      compare(a.audio_features?.danceability, b.audio_features?.danceability),
  },
  {
    attribute: "Danceability",
    order: "descending",
    sorter: (a, b) =>
      compare(b.audio_features?.danceability, a.audio_features?.danceability),
  },
  {
    attribute: "Energy",
    order: "ascending",
    sorter: (a, b) =>
      compare(a.audio_features?.energy, b.audio_features?.energy),
  },
  {
    attribute: "Energy",
    order: "descending",
    sorter: (a, b) =>
      compare(b.audio_features?.energy, a.audio_features?.energy),
  },
  {
    attribute: "Instrumentalness",
    order: "ascending",
    sorter: (a, b) =>
      compare(
        a.audio_features?.instrumentalness,
        b.audio_features?.instrumentalness
      ),
  },
  {
    attribute: "Instrumentalness",
    order: "descending",
    sorter: (a, b) =>
      compare(
        b.audio_features?.instrumentalness,
        a.audio_features?.instrumentalness
      ),
  },
  {
    attribute: "Liveness",
    order: "ascending",
    sorter: (a, b) =>
      compare(a.audio_features?.liveness, b.audio_features?.liveness),
  },
  {
    attribute: "Liveness",
    order: "descending",
    sorter: (a, b) =>
      compare(b.audio_features?.liveness, a.audio_features?.liveness),
  },
  {
    attribute: "Loudness",
    order: "ascending",
    sorter: (a, b) =>
      compare(a.audio_features?.loudness, b.audio_features?.loudness),
  },
  {
    attribute: "Loudness",
    order: "descending",
    sorter: (a, b) =>
      compare(b.audio_features?.loudness, a.audio_features?.loudness),
  },
  {
    attribute: "Speechiness",
    order: "ascending",
    sorter: (a, b) =>
      compare(a.audio_features?.speechiness, b.audio_features?.speechiness),
  },
  {
    attribute: "Speechiness",
    order: "descending",
    sorter: (a, b) =>
      compare(b.audio_features?.speechiness, a.audio_features?.speechiness),
  },
  {
    attribute: "Tempo",
    order: "ascending",
    sorter: (a, b) => compare(a.audio_features?.tempo, b.audio_features?.tempo),
  },
  {
    attribute: "Tempo",
    order: "descending",
    sorter: (a, b) => compare(b.audio_features?.tempo, a.audio_features?.tempo),
  },
  {
    attribute: "Valence",
    order: "ascending",
    sorter: (a, b) =>
      compare(a.audio_features?.valence, b.audio_features?.valence),
  },
  {
    attribute: "Valence",
    order: "descending",
    sorter: (a, b) =>
      compare(b.audio_features?.valence, a.audio_features?.valence),
  },
];

export default sortOptions;
