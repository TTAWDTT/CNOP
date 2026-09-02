import type { AppProps } from "next/app";
import localFont from "next/font/local";

import "@/styles/globals.css";

const lxgwWenKai = localFont({
  src: "../public/fonts/LXGWWenKai-Regular.ttf",
  variable: "--font-lxgw-wenkai",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`cnop-font-scope ${lxgwWenKai.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
