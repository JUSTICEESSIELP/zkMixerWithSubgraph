import { Web3Modal } from "@/utils/web3modal";
import { Html, Head, Main, NextScript } from "next/document";
import { useState } from "react";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Web3Modal>
          <Main />
          <NextScript />
        </Web3Modal>
      </body>
    </Html>
  );
}
