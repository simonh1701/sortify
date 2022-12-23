import Link from "next/link";
import Image from "next/image";
import { MusicIcon, UserIcon } from "components/icons";

export default function Playlist({
  id,
  name,
  src,
  width,
  height,
  totalTracks,
  owner,
}) {
  return (
    <Link href={`/sort/${id}`} className="group">
      <Image
        unoptimized
        className="w-full group-hover:opacity-75"
        src={src}
        width={width}
        height={height}
        alt={`${name} Playlist Cover`}
      />
      <h2 className="mt-3 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold leading-8 tracking-tight">
        {name}
      </h2>
      <div className="flex flex-col text-sm text-gray-500 sm:flex-row sm:space-x-6">
        <div className="mt-2 flex items-center whitespace-nowrap">
          <MusicIcon className="playlist-info-icon" aria-hidden="true" />
          {totalTracks} Songs
        </div>
        <div className="mt-2 flex items-center truncate">
          <UserIcon className="playlist-info-icon" aria-hidden="true" />
          <p className="overflow-hidden text-ellipsis">{owner}</p>
        </div>
      </div>
    </Link>
  );
}
