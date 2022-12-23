import { Listbox, Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  WarningIcon,
  LoaderIcon,
  MusicIcon,
  UserIcon,
} from "components/icons";
import { PlaylistContext, UserContext } from "lib/context";
import sortOptions from "lib/sortOptions";
import { classNames } from "lib/utils";

export default function PlaylistInfo() {
  const { playlist } = useContext(PlaylistContext);
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
  const [overwriteAddedAt, setOverwriteAddedAt] = useState(true);

  return (
    <div className="lg:flex lg:items-center lg:justify-between">
      <div>
        <h1 className="heading-1">{playlist.name}</h1>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <MusicIcon className="playlist-info-icon" aria-hidden="true" />
            {playlist.items.length} Songs
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <UserIcon className="playlist-info-icon" aria-hidden="true" />
            {playlist.owner.display_name}
          </div>
        </div>
      </div>
      <div className="mt-5 lg:mt-0 lg:ml-10">
        <div className="mb-3 flex">
          <SortDropdown
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={setSelectedSortOption}
          />
          <SaveDropdown
            selectedSortOption={selectedSortOption}
            setSelectedSortOption={setSelectedSortOption}
            overwriteAddedAt={overwriteAddedAt}
          />
        </div>
        <OverwriteAddedAtCheckbox
          overwriteAddedAt={overwriteAddedAt}
          setOverwriteAddedAt={setOverwriteAddedAt}
        />
      </div>
    </div>
  );
}

function SortDropdown({ selectedSortOption, setSelectedSortOption }) {
  const { playlist, mutatePlaylist } = useContext(PlaylistContext);

  return (
    <Listbox
      value={selectedSortOption}
      onChange={(selected) => {
        setSelectedSortOption(selected);
        mutatePlaylist(
          {
            ...playlist,
            items: [...playlist.items].sort(selected.sorter),
          },
          {
            revalidate: false,
          }
        );
      }}
    >
      <div className="relative w-full sm:w-72">
        <Listbox.Button className="relative w-full rounded-md py-1.5 pl-3 pr-10 text-left text-sm leading-6 shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <span className="inline-flex w-full truncate">
            <span>{selectedSortOption.attribute}</span>
            <span className="ml-2 truncate text-gray-500">
              {selectedSortOption.order}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center fill-gray-400 pr-2">
            <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-2 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {sortOptions.map((sortOption) => (
              <Listbox.Option
                key={`${sortOption.attribute} ${sortOption.order}`}
                className={({ active }) =>
                  classNames(
                    active && "bg-gray-100",
                    "relative select-none py-2 pl-3 pr-9"
                  )
                }
                value={sortOption}
              >
                {({ selected }) => (
                  <>
                    <div className="flex">
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "truncate"
                        )}
                      >
                        {sortOption.attribute}
                      </span>
                      <span className="ml-2 truncate text-gray-500">
                        {sortOption.order}
                      </span>
                    </div>
                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center fill-blue-500 pr-4">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

function SaveDropdown({
  selectedSortOption,
  setSelectedSortOption,
  overwriteAddedAt,
}) {
  const router = useRouter();
  const user = useContext(UserContext);
  const { playlist, mutatePlaylist } = useContext(PlaylistContext);

  const isOwner = playlist?.owner.uri === user?.uri;

  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);

  const overwritePlaylist = async (orderdPlaylist) => {
    setWarning(false);
    setLoading(true);

    const { id } = router.query;

    let response;

    if (overwriteAddedAt) {
      response = await fetch(`/api/playlist/${id}/overwrite`, {
        method: "PUT",
        body: JSON.stringify({
          uris: orderdPlaylist.items.map(
            (playlistItem) => playlistItem.track.uri
          ),
        }),
      });
    } else if (orderdPlaylist.items.length <= 100) {
      response = await fetch(`/api/playlist/${id}/replace`, {
        method: "PUT",
        body: JSON.stringify({
          uris: orderdPlaylist.items.map(
            (playlistItem) => playlistItem.track.uri
          ),
        }),
      });
    } else {
      response = await fetch(`/api/playlist/${id}/reorder`, {
        method: "PUT",
        body: JSON.stringify({
          reorder: orderdPlaylist.items.map(
            (playlistItem) => playlistItem.index
          ),
        }),
      });
    }

    if (!response.ok) {
      console.log(await response.json());
      setLoading(false);
      setWarning(true);
      return;
    }

    mutatePlaylist();
    setSelectedSortOption(sortOptions[0]);
    setLoading(false);
  };

  const saveAsNewPlaylist = async (orderdPlaylist) => {
    setWarning(false);
    setLoading(true);

    const newPlaylistResponse = await fetch("/api/playlist/new", {
      method: "POST",
      body: JSON.stringify({
        name:
          selectedSortOption.attribute !== "Original"
            ? `${orderdPlaylist.name} sorted by ${selectedSortOption.attribute}`
            : orderdPlaylist.name,
      }),
    });

    if (!newPlaylistResponse.ok) {
      console.log(await newPlaylistResponse.json());
      setLoading(false);
      setWarning(true);
      return;
    }

    const { id } = await newPlaylistResponse.json();

    const overrideResponse = await fetch(`/api/playlist/${id}/overwrite`, {
      method: "PUT",
      body: JSON.stringify({
        uris: orderdPlaylist.items.map(
          (playlistItem) => playlistItem.track.uri
        ),
      }),
    });

    if (!overrideResponse.ok) {
      console.log(await overrideResponse.json());
      setLoading(false);
      setWarning(true);
      return;
    }

    setLoading(false);
  };

  return (
    <Menu as="div" className="relative ml-2 inline-block text-left">
      <Menu.Button className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-blue-500 to-teal-400 fill-white px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
        Save
        {loading ? (
          <LoaderIcon
            className="ml-2 -mr-1 h-5 w-5 animate-spin"
            aria-hidden="true"
          />
        ) : warning ? (
          <WarningIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        ) : (
          <ArrowDownIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-auto right-0 mt-2 w-56 origin-top-right divide-y rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active && "bg-gray-100",
                    "dropdown-item group"
                  )}
                  onClick={() => overwritePlaylist(playlist)}
                  disabled={loading || !isOwner}
                >
                  Overwrite playlist
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={classNames(
                    active && "bg-gray-100",
                    "dropdown-item group"
                  )}
                  onClick={() => saveAsNewPlaylist(playlist)}
                  disabled={loading}
                >
                  Save as new playlist
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function OverwriteAddedAtCheckbox({ overwriteAddedAt, setOverwriteAddedAt }) {
  const user = useContext(UserContext);
  const { playlist } = useContext(PlaylistContext);
  const isOwner = playlist?.owner?.uri === user?.uri;

  return (
    <div
      className={classNames(
        !isOwner && "opacity-40",
        "flex lg:flex-row-reverse"
      )}
    >
      <div className="flex h-6 items-center">
        <input
          id="overwriteAddedAt"
          type="checkbox"
          checked={overwriteAddedAt}
          disabled={!isOwner}
          onChange={() => {
            setOverwriteAddedAt(!overwriteAddedAt);
          }}
          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 disabled:text-gray-500"
        />
      </div>
      <div className="ml-3 text-sm leading-6 lg:ml-0 lg:mr-3">
        <label htmlFor="overwriteAddedAt" className="font-medium">
          Overwrite <span className="italic">Added At</span>
          <span className="ml-1 text-gray-500">(Recommended)</span>
        </label>
      </div>
    </div>
  );
}
