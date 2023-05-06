import { useRouter } from "next/router";
import useSWR from "swr";
import { AudioProvider } from "components/playlistDetail/audioprovider";
import LocalItemsWarningBanner from "components/playlistDetail/localItemsWarningBanner";
import PlaylistInfo from "components/playlistDetail/playlistInfo";
import TracksTable from "components/playlistDetail/tracksTable";
import { PlaylistContext, UserContext } from "lib/context";
import swrOptions from "lib/swrOptions";
import { fetcher } from "lib/utils";

export default function PlaylistDetail() {
  const router = useRouter();

  const {
    data: playlist,
    mutate: mutatePlaylist,
    error: playlistError,
    isLoading: playlistIsLoading,
  } = useSWR(
    () => {
      if (router.query.id) return `/api/v1/playlist/${router.query.id}`;
      else return null;
    },
    fetcher,
    swrOptions
  );

  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR("/api/v1/user", fetcher, swrOptions);

  if (playlistError?.status === 401 || userError?.status === 401)
    router.replace(
      `/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`
    );

  if (playlistError || userError)
    return <h1 className="heading-1 mb-8">Failed to load</h1>;

  if (playlistIsLoading || userIsLoading || !playlist)
    return <h1 className="heading-1 mb-8">Loading...</h1>;

  return (
    <UserContext.Provider value={user}>
      <PlaylistContext.Provider
        value={{
          playlist,
          mutatePlaylist,
        }}
      >
        <AudioProvider>
          <LocalItemsWarningBanner />
          <PlaylistInfo />
          <TracksTable />
        </AudioProvider>
      </PlaylistContext.Provider>
    </UserContext.Provider>
  );
}
