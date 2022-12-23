import Head from "next/head";
import Navbar from "components/navbar";

export default function Layout({ children, ...customMeta }) {
  const meta = {
    title: "Sortify",
    description: "",
    ...customMeta,
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
      </Head>
      <Navbar></Navbar>
      <main className="px-4 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
