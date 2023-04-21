import Link from "next/link";
import { GithubIcon } from "./icons";

const navigation = [
  {
    name: "GitHub",
    href: "https://github.com/simonh1701/sortify",
    icon: (props) => <GithubIcon {...props} />,
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="mt-2 p-4 sm:p-6 md:flex md:items-center md:justify-between lg:p-8">
        <div className="flex space-x-6 sm:justify-center md:order-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target="_blank"
              className="fill-gray-500 hover:fill-gray-400"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="mt-5 md:order-1 md:mt-0">
          <p className="text-xs leading-5 text-gray-500 sm:text-center">
            &copy; 2023 Simon Hohenwarter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
