import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-8 grid sm:mt-20 sm:place-items-center">
      <div className="sm:text-center">
        <p className="font-semibold">404</p>
        <h1 className="heading-1 mt-4">Page not found</h1>
        <p className="mt-6 leading-7 text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-500 underline-offset-4 hover:underline"
          >
            <span aria-hidden="true">&larr;</span> Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
