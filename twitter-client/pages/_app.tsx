import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
const inter = Inter({ subsets: ["latin"] });
export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <div className={inter.className}>
      <GoogleOAuthProvider clientId="1051317843624-1ms2o19d0sqlkr7kajj53to3innd2jlr.apps.googleusercontent.com">
        <Component {...pageProps} />
        <Toaster/>
      </GoogleOAuthProvider>
    </div> 
    );
 
}
