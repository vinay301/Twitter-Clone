import "@/styles/globals.css";
import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <div className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="1051317843624-1ms2o19d0sqlkr7kajj53to3innd2jlr.apps.googleusercontent.com">
          <Component {...pageProps} />
          <Toaster/>
          <ReactQueryDevtools initialIsOpen={false} />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </div> 
    );
 
}
