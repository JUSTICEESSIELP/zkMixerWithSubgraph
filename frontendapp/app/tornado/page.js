"use client";
import React, { useEffect, useState, useRef } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import utils from "@/utils/$u";
import wc from "@/utils/witnessCalculator";

import { ethers } from "ethers";

const Tornado = () => {
  const [isWalletProvider, setWalletProvider] = useState(null);

  const depositRef = useRef();
  const [wallet, setWallet] = useState({
    account: [],
    balance: "",
    chainId: "",
  });

  const [isLoading, setLoading] = useState(false);

  // console.log(wallet.balance, wallet.chainId, wallet.account);

  function getRandomNumber() {
    // Generate a random 32-byte buffer
    const randomBytes = ethers.utils.randomBytes(32);

    // Convert the buffer to a hexadecimal string
    const randomNumberHex = ethers.BigNumber.from(randomBytes);

    return randomNumberHex.toString();
  }

  const handleDepositEth = () => {
    depositRef.current.click();
  };

  const triggerDeposit = async () => {
    // Generate a random 32-byte buffer
    let nullifier;
    let secret;

    let twoRandomNumbers = [];
    for (let i = 0; i < 2; i++) {
      const randomNumberHex = getRandomNumber();

      twoRandomNumbers.push(randomNumberHex);
    }
    [nullifier, secret] = twoRandomNumbers;

    // Log the generated random number
    // change the BigNumber [in decimal ] to binary and if its not 256 add padding

    // const input = {
    //   secret: utils.BN256ToBin(secret).split(""),
    //   nullifier: utils.BN256ToBin(nullifier).split(""),
    // };

    var res = await fetch("/deposit.wasm");

    let jsonResponse;
    let witnessReponses;

    try {
      const response = await fetch("/input.json");

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      jsonResponse = await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log(res, "wasm response");
    var buffer = await res.arrayBuffer();
    var depositWC = await wc(buffer);

    const input = {
      secret: jsonResponse.secret,
      nullifier: jsonResponse.nullifier,
    };

    try {
      const witnessjson = await fetch("/witness.json");

      if (!witnessjson.ok) {
        throw new Error(
          `Network response was not ok: ${witnessjson.statusText}`
        );
      }
      witnessReponses = await witnessjson.json();
      console.log(
        witnessReponses,
        "WINNNNNNNNNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDDDDDDDD"
      );
    } catch (error) {
      console.log(error);
    }

    const r = await depositWC.calculateWitness(input, 0);
    const nullifierHash = r[1];
    const commitment = r[2];
    console.log(r[0].toString(), "1 constant in witness");
    console.log(r[1] == witnessReponses[1], "nullifierHash");
 
    console.log(r[2] == witnessReponses[2]);
  };

  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet({ account: [] });
      }
    };

    const refreshChain = (chainId) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setWalletProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();
    return () => {
      window.ethereum?.removeListener("chainChanged", refreshChain);
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
    };
  }, []);

  const updateWallet = async (accounts) => {
    const balance = utils.formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    setWallet({ account: accounts, balance, chainId });
  };

  const handleMetamaskConnection = async () => {
    setLoading(true);
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts, "ACCC");
    updateWallet(accounts);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {isWalletProvider && wallet.account.length < 1 && (
        <button
          onClick={handleMetamaskConnection}
          className="rounded py-4 px-8 text-white-400 bg-blue-700 "
        >
          {isLoading ? <p>Loading..</p> : <p>Connect MetaMask</p>}
        </button>
      )}

      <div>
        {wallet.account.length > 0 && (
          <div>
            <div>Account Balance : {wallet.balance}</div>
            <div> ChainId: {parseInt(wallet.chainId)}</div>
            <div>Wallet Accounts: {wallet.account[0]}</div>

            <button
              className="rounded py-4 px-8 text-white-400 bg-green-700"
              onClick={handleDepositEth}
            >
              Deposit 1 Eth
            </button>

            <input
              type="button"
              onClick={triggerDeposit}
              className="hidden"
              ref={depositRef} // Add this ref to the button element
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tornado;
