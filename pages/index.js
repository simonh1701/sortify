import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl sm:mt-20">
      <h1 className="title">
        Sort your music with <span className="gradient-text">Sortify.</span>
      </h1>
      <p className="text-lg leading-loose text-gray-500 sm:text-center">
        Sort your Spotify playlists by attributes like name, artist, release
        date, duration, popularity and many more ...
      </p>
      <div className="mt-8 flex flex-col gap-10 sm:justify-center">
        <div className="sm:px-32 md:px-40">
          <Link
            href="/sort"
            className="full-size-button bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-400 hover:to-teal-300"
          >
            Get started
          </Link>
          {!loading && !!session && (
            <button
              onClick={() => signOut("spotify")}
              className="full-size-button mt-2 border-2 border-solid border-gray-300 text-gray-500"
            >
              Sign Out
            </button>
          )}
        </div>
        <div className="mr-auto rounded-full py-0.5 px-3 text-xs leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20 sm:ml-auto sm:py-1.5 sm:px-4 sm:text-sm">
          <span>
            Created by{" "}
            <Link
              href="https://www.simonhohenwarter.dev/"
              target="_blank"
              className="font-semibold text-blue-500"
            >
              Simon Hohenwarter <span aria-hidden="true">&rarr;</span>
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
