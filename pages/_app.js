import "@/styles/globals.css";
import { GeistSans, GeistMono } from 'geist/font';
import styles from './LoadingSpinner.module.css';
import './LoadingSpinner.module.css';

export default function App({ Component, pageProps }) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}