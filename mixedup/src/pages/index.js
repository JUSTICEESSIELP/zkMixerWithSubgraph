import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useRef } from "react";
import { useWeb3Modal } from "@web3modal/wagmi1/react";

import { useAccount } from "wagmi";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const modalOpen = useWeb3Modal();

  const [isConnectedToMetamask, setConnectionToMetamask] = useState(false);
  const inputButtonType = useRef();

  const handleTriggerInputButton = (event) => {
    inputButtonType.current.click();
  };

  const handleConnectToWallet = (event) => {
    console.log("before conneecting ", account);
    modalOpen.open();
    console.log(account);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-8 ${inter.className}`}
    >
      <div className="bg-slate-700 flex flex-row justify-between">
        <button onClick={handleTriggerInputButton}>Connect Wallet</button>
        <input
          type="button"
          ref={inputButtonType}
          onClick={handleConnectToWallet}
          className="hidden"
        ></input>
      </div>
    </main>
  );
}
