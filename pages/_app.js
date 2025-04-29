import "@/styles/globals.css";
import { GeistSans, GeistMono } from 'geist/font';

export default function App({ Component, pageProps }) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}