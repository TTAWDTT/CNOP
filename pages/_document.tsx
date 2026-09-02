import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  const assetPrefix = process.env.NODE_ENV === "production" ? "/CNOP" : "";

  return (
    <Html lang="zh-CN">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href={`${assetPrefix}/favicon.svg`} rel="icon" type="image/svg+xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
