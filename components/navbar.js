import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <nav className="flex h-9 items-center justify-between">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Sortify</span>
          <Image
            priority
            width={32}
            height={32}
            src="/sortify.svg"
            alt="Sortify"
          />
        </Link>
      </nav>
    </div>
  );
}
