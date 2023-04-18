import Image from "next/image";
import { useContext, useMemo } from "react";
import { NotAllowedIcon, PauseIcon, PlayIcon } from "components/icons";
import { PlaylistContext } from "lib/context";
import { useAudioPlayer } from "lib/useAudioPlayer";
import { formatDuration } from "lib/utils";

export default function TracksTable() {
  const { playlist } = useContext(PlaylistContext);

  return (
    <div className="mt-8 flow-root">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 pr-3 pl-4 text-left text-sm font-semibold sm:pl-0"
                >
                  Title
                </th>
                <th scope="col" className="table-col-header">
                  Artist
                </th>
                <th scope="col" className="table-col-header">
                  Duration
                </th>
                <th scope="col" className="table-col-header">
                  Release Date
                </th>
                <th scope="col" className="table-col-header">
                  Popularity
                </th>
                <th scope="col" className="table-col-header">
                  Acousticness
                </th>
                <th scope="col" className="table-col-header">
                  Danceability
                </th>
                <th scope="col" className="table-col-header">
                  Energy
                </th>
                <th scope="col" className="table-col-header">
                  Instrumentalness
                </th>
                <th scope="col" className="table-col-header">
                  Liveness
                </th>
                <th scope="col" className="table-col-header">
                  Loudness
                </th>
                <th scope="col" className="table-col-header">
                  Speechiness
                </th>
                <th scope="col" className="table-col-header">
                  Tempo
                </th>
                <th scope="col" className="table-col-header">
                  Valence
                </th>
                <th
                  scope="col"
                  className="whitespace-nowrap px-3 py-3.5 pr-4 pl-3 text-right sm:pr-0"
                >
                  Preview
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {playlist?.items.map((playlistItem) => (
                <TrackRow
                  key={`${playlistItem.track.id} at index ${playlistItem.index}`}
                  playlistItem={playlistItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TrackRow({ playlistItem }) {
  const audioPlayerData = useMemo(
    () => ({
      audio: {
        src: playlistItem.track.preview_url,
      },
    }),
    [playlistItem]
  );

  const player = useAudioPlayer(audioPlayerData);

  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
        <div className="flex items-center">
          <div className="aspect-square flex-shrink-0">
            <Image
              unoptimized
              src={
                playlistItem.track.album?.images?.at(-1)?.url ??
                "/placeholder.png"
              }
              height={40}
              width={40}
              alt={`${playlistItem.track.name} Cover`}
              className="h-10 w-10"
            />
          </div>
          <div className="ml-4 truncate">
            <div className="overflow-hidden text-ellipsis font-medium">
              {playlistItem.track.name || "-"}
            </div>
            <div className="overflow-hidden text-ellipsis text-gray-500">
              {playlistItem.track.album.name || "-"}
            </div>
          </div>
        </div>
      </td>
      <td className="table-cell truncate">
        <div className="overflow-hidden text-ellipsis">
          {playlistItem.track.artists.map((x) => x.name).join(", ") || "-"}
        </div>
      </td>
      <td className="table-cell">
        {
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
            {playlistItem.track.duration_ms
              ? formatDuration(playlistItem.track.duration_ms)
              : "-"}
          </span>
        }
      </td>
      <td className="table-cell">
        {playlistItem.track.album.release_date ?? "-"}
      </td>
      <td className="table-cell">{playlistItem.track.popularity ?? "-"}</td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.acousticness, 1000)}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.danceability, 1000)}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.energy, 1000)}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(
          playlistItem.audio_features?.instrumentalness,
          1000
        )}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.liveness, 1000)}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.loudness)}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.speechiness, 1000)}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.tempo)}
      </td>
      <td className="table-cell">
        {roundAndFormatNumber(playlistItem.audio_features?.valence, 1000)}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <button
          className="ml-auto mr-0 flex items-center rounded-full py-2 px-3 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={player.toggle}
          disabled={!player.src}
        >
          {!player.src ? (
            <NotAllowedIcon className="h-4 w-4" aria-hidden="true" />
          ) : player.playing ? (
            <PauseIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <PlayIcon className=" h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </td>
    </tr>
  );
}

function roundAndFormatNumber(data, multiplier = 1) {
  return data || data === 0 ? Math.round(data * multiplier) : "-";
}
