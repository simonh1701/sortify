export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export async function fetcher(url) {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export function formatDuration(duration_ms) {
  let minutes = Math.floor(duration_ms / 60000); // 1 minute = 60000 milliseconds
  let seconds = ((duration_ms % 60000) / 1000).toFixed(0);

  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
