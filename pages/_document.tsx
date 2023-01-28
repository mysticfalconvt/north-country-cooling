import { Html, Head, Main, NextScript } from "next/document";
import React from "react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
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
