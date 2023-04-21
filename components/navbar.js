import Image from "next/image";
import Link from "next/link";
import sortify from "public/sortify.svg";
import sortify_gradient from "public/sortify_gradient.svg";

export default function Navbar() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <nav className="flex h-9 items-center justify-between">
        <Link href="/" className="group -m-1.5 p-1.5">
          <span className="sr-only">Sortify</span>
          <Image
            priority
            width={32}
            height={32}
            src={sortify}
            alt="Sortify"
            className="group-hover:hidden"
          />
          <Image
            priority
            width={32}
            height={32}
            src={sortify_gradient}
            alt="Sortify"
            className="hidden group-hover:block"
          />
        </Link>
      </nav>
    </div>
  );
}
