import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Kelola kado kondangan dengan mudah! Aplikasi manajemen kado berbasis Next.js untuk mencatat pemberian dan penerimaan kado. Fitur lengkap: registrasi, login, manajemen kontak, statistik, dan ekspor data." />
        <meta name="keywords" content="aplikasi kado kondangan, manajemen kado pernikahan, catatan kado digital, aplikasi next.js kado, database kado, muhromin developer, software kado kondangan, web app kado, manajemen kontak kado, Muuhromin, Muhromin Bojonegoro" />
        <meta name="author" content="Muhromin - Developer Web Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Aplikasi Manajemen Kado Kondangan Terbaik" />
        <meta property="og:description" content="Solusi digital untuk mencatat dan mengelola kado kondangan. Dukung dengan Next.js dan MongoDB Atlas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kadokondangan.vercel.app" />
        <meta property="og:image" content="https://kadokondangan.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kadokondangan.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Manajemen Kado Kondangan | Aplikasi Pencatatan Kado Digital</title>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}