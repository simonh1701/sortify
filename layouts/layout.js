import Head from "next/head";
import Footer from "components/footer";
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
