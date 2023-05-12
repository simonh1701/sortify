import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="favicon/manifest.webmanifest" />
        <link rel="icon" href="favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="favicon/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="favicon/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
