import { useRouter } from "next/router";
import useSWR from "swr";
import Playlist from "components/playlistsOverview/playlist";
import swrOptions from "lib/swrOptions";
import { fetcher } from "lib/utils";

export default function PlaylistsOverview() {
  const router = useRouter();

  const {
    data: playlists,
    error: playlistsError,
    isLoading: playlistsIsLoading,
  } = useSWR("/api/v1/playlists", fetcher, swrOptions);

  if (playlistsError?.status === 401) {
    router.replace(
      `/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`
    );
  }

  if (playlistsError) return <h1 className="heading-1 mb-8">Failed to load</h1>;

  if (playlistsIsLoading || !playlists)
    return <h1 className="heading-1 mb-8">Loading...</h1>;

  return (
    <>
      <h1 className="heading-1 mb-8">Choose a playlist</h1>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:grid-cols-4 xl:grid-cols-5">
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <Playlist
              id={playlist.id}
              name={playlist.name}
              src={playlist.images.at(0)?.url ?? "/images/placeholder.png"}
              width={playlist.images.at(0)?.width ?? 640}
              height={playlist.images.at(0)?.height ?? 640}
              totalTracks={playlist.tracks.total}
              owner={playlist.owner.display_name}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
