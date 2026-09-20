import "@/styles/globals.css";
import Layout from "@/components/Layout";
import Head from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-8413438270446322";

  return (
    <>
      <Head>
        <meta name="google-adsense-account" content={pubId} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />

      </Head>


      {/* Google AdSense Script */}
      <Script
        strategy="afterInteractive"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin="anonymous"
      />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
