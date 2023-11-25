import { useContext, useState } from "react";
import { CloseIcon } from "components/icons";
import { PlaylistContext } from "lib/context";

export default function LocalItemsWarningBanner() {
  const { playlist } = useContext(PlaylistContext);
  const playlistContainsLocalItems = playlist.items.some(
    (item) => item.is_local
  );
  const [showBanner, setShowBanner] = useState(playlistContainsLocalItems);

  return (
    showBanner && (
      <div className="mb-4 flex items-center justify-between gap-x-6 rounded-xl bg-white p-6 px-4 py-2.5 shadow-sm ring-1 ring-gray-300 sm:mb-6 lg:mb-8">
        <p className="text-sm leading-6">
          <strong className="font-semibold text-blue-500">Warning</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          This playlist contains{" "}
          <u className=" underline decoration-blue-500 decoration-2 underline-offset-[3px]">
            local files
          </u>
          . All local files are removed when sorting the playlist
        </p>
        <button
          onClick={() => setShowBanner(false)}
          className="-m-3 flex-none p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Close</span>
          <CloseIcon className="h-5 w-5 fill-black" aria-hidden="true" />
        </button>
      </div>
    )
  );
}
