import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Main() {
  const router = useRouter();

  return (
    <div className="mx-auto mt-8 max-w-3xl sm:mt-20">
      <h1 className="heading-1 sm:text-center">You&apos;re not signed in</h1>
      <div className="mt-8 flex flex-col gap-10 sm:justify-center">
        <div className="sm:px-32 md:px-40">
          <button
            onClick={() =>
              signIn("spotify", {
                callbackUrl: router.query?.callbackUrl
                  ? decodeURI(router.query?.callbackUrl)
                  : "/",
              })
            }
            className="full-size-button bg-[#1DB954] text-white hover:opacity-75"
          >
            Connect to Spotify
          </button>
        </div>
      </div>
    </div>
  );
}
