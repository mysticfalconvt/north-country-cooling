import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID &&
          process.env.NODE_ENV !== 'development' && (
            <script
              defer
              src="https://umami.rboskind.com/script.js"
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            />
          )}
      </Head>
      <body>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0"
          nonce="Z2KS8Z8a"
        ></script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
