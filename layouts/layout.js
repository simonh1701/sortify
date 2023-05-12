import Head from "next/head";
import Footer from "components/footer";
import Navbar from "components/navbar";
import { useRouter } from "next/router";

export default function Layout({ children, ...customMeta }) {
  const router = useRouter();
  const meta = {
    title: "Sortify",
    description:
      "Sort your Spotify playlists by attributes like name, artist, release date, duration, popularity and many more ...",
    image: "https://sortify.simonh1701.app/images/opengraph-image.png",
    type: "website",
    ...customMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://sortify.simonh1701.app${router.asPath}`}
        />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@simonh1701" />
        <meta
          property="twitter:url"
          content={`https://sortify.simonh1701.app${router.asPath}`}
        />
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:description" content={meta.description} />
        <meta property="twitter:image" content={meta.image} />
      </Head>
      <div className="flex min-h-screen flex-col">
        <Navbar></Navbar>
        <main className="flex flex-1 flex-col px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer></Footer>
      </div>
    </>
  );
}
