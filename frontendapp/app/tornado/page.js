"use client";
import React, { useEffect, useState, useRef } from "react";

import detectEthereumProvider from "@metamask/detect-provider";
import utils from "@/utils/$u";
import wc from "@/utils/witnessCalculator";
import { chain } from "lodash";
import { Signer, ethers, providers } from "ethers";
import tornadoABI from "../../json/Tornado.json";

const Tornado = () => {
  const [isWalletProvider, setWalletProvider] = useState(null);

  const withdrawTextArea = useRef();

  const [allDepositEventObj, setAllDepositEventsObj] = useState(null);
  const [contract, setContract] = useState(null);
  const [depositValue, setDepositValue] = useState("");
  const [displayCopiedMessage, updateDisplayCopiedMessage] = useState(false);

  const textAreaRef = useRef();

  const [proofStringEl, updateProofStringEl] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_hasher",
          type: "address",
        },
        {
          internalType: "address",
          name: "_verifier",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "root",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256[10]",
          name: "hashPairings",
          type: "uint256[10]",
        },
        {
          indexed: false,
          internalType: "uint8[10]",
          name: "pairDirection",
          type: "uint8[10]",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "nullifierHash",
          type: "uint256",
        },
      ],
      name: "Withdrawal",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "commitments",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "denomination",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_commitment",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "nextLeafIdx",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "nullifierHashes",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "roots",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "treeLevel",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256[2]",
          name: "a",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2][2]",
          name: "b",
          type: "uint256[2][2]",
        },
        {
          internalType: "uint256[2]",
          name: "c",
          type: "uint256[2]",
        },
        {
          internalType: "uint256[2]",
          name: "input",
          type: "uint256[2]",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
  ];

  const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const depositRef = useRef();
  const [wallet, setWallet] = useState({
    account: [],
    balance: "",
    chainId: "",
  });

  const [isLoading, setLoading] = useState(false);

  //const contract = new ethers.Contract(
  //   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //   [
  //     {
  //       inputs: [
  //         {
  //           internalType: "address",
  //           name: "spongeContractAddress",
  //           type: "address",
  //         },
  //       ],
  //       stateMutability: "nonpayable",
  //       type: "constructor",
  //     },
  //     {
  //       inputs: [],
  //       name: "ReentrancyGuardReentrantCall",
  //       type: "error",
  //     },
  //     {
  //       anonymous: false,
  //       inputs: [
  //         {
  //           indexed: false,
  //           internalType: "uint256[10]",
  //           name: "hashDirections",
  //           type: "uint256[10]",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "uint256[10]",
  //           name: "hashPairings",
  //           type: "uint256[10]",
  //         },
  //         {
  //           indexed: false,
  //           internalType: "uint256",
  //           name: "rootHash",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "Deposit",
  //       type: "event",
  //     },
  //     {
  //       inputs: [
  //         {
  //           internalType: "uint256",
  //           name: "commitmentHash",
  //           type: "uint256",
  //         },
  //       ],
  //       name: "deposit",
  //       outputs: [],
  //       stateMutability: "payable",
  //       type: "function",
  //     },
  //     {
  //       inputs: [],
  //       name: "withdraw",
  //       outputs: [],
  //       stateMutability: "nonpayable",
  //       type: "function",
  //     },
  //   ],
  //   wallet.account[0]
  // );
  // const contract = new ethers.Contract(
  //   "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  //   tornadoABI,
  //   provider
  // );

  // console.log(contract);

  // console.log(wallet.balance, wallet.chainId, wallet.account);

  //)

  function getRandomNumber() {
    // Generate a random 32-byte buffer
    const randomBytes = ethers.utils.randomBytes(32);

    // Convert the buffer to a hexadecimal string
    const randomNumberHex = ethers.BigNumber.from(randomBytes);

    return randomNumberHex.toString();
  }

  const handleWithdrawEth = async () => {
    try {
      if (
        !withdrawTextArea ||
        !withdrawTextArea.current ||
        !withdrawTextArea.current.value
      ) {
        alert("Please input the proof of deposit string.");
        return;
      }

      const proofString = withdrawTextArea.current.value;
      const proofElements = JSON.parse(atob(proofString));
      const getHashArray = JSON.parse(
        localStorage.getItem("depositTransaction")
      );
      console.log(getHashArray, "FROM LOCAL STORAGE");

      const iface = new ethers.utils.Interface(ABI);

      console.log(iface, "INTERFACE");
      const logs = await provider.getLogs({
        address: CONTRACT_ADDRESS,
      });
      let matchedEventData;
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();
      for (const log of logs) {
        const matchedTransaction = getHashArray.find((transaction) =>
          transaction.hasOwnProperty(log.transactionHash)
        );
        console.log(matchedTransaction, "IS MATCHING");

        if (matchedTransaction) {
          matchedEventData = {
            transactionHash: log.transactionHash,
            event: {
              root: matchedTransaction[log.transactionHash].root,
              hashDirections:
                matchedTransaction[log.transactionHash].pairDirection,
              hashPairings:
                matchedTransaction[log.transactionHash].hashPairings,
            },
          };
          break;
        }
      }

      console.log(matchedEventData);

      const SnarkJS = window["snarkjs"];
      const {
        event: { root, hashDirections, hashPairings },
      } = matchedEventData;

      const proofInput = {
        root: utils.BNToDecimal(root),
        nullifierHash: proofElements.nullifierHash,
        recipient: utils.BNToDecimal(signerAddress),
        secret: utils.BN256ToBin(proofElements.secret).split(""),
        nullifier: utils.BN256ToBin(proofElements.nullifier).split(""),
        hashPairings: hashPairings.map((n) => utils.BNToDecimal(n)),
        hashDirections: hashDirections,
      };
      console.log(proofInput, "INPUT OF PROOF");

      const { proof, publicSignals } = await SnarkJS.groth16.fullProve(
        proofInput,
        "/withdraw.wasm",
        "/withdraw_final.zkey"
      );

      console.log(proof, publicSignals, "PROOF AND SIGNALS");

      const callInputs = [
        proof.pi_a.slice(0, 2).map(utils.BN256ToHex),
        proof.pi_b
          .slice(0, 2)
          .map((row) => utils.reverseCoordinate(row.map(utils.BN256ToHex))),
        proof.pi_c.slice(0, 2).map(utils.BN256ToHex),
        publicSignals.slice(0, 2).map(utils.BN256ToHex),
      ];
      console.log("CALL INPUTS", callInputs);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      console.log(contract, "CONTRACT OBJECT");
      const ethValue = ethers.utils.parseEther(depositValue);

      const tx = await contract.withdraw(
        callInputs[0],
        callInputs[1],
        callInputs[2],
        [proofInput.root, proofInput.nullifierHash]
      );

      const receipt = await tx.wait();
      console.log("WITHDRAWAL DONE ", receipt);

      updateWithdrawalSuccessful(true);
    } catch (error) {
      console.error("Error occurred:", error);
      // Add your error handling logic here, such as displaying an error message to the user
    }
  };

  // Access event logs from the receipt

  // const log = receipt.logs[0];
  // const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

  const handleCopy = () => {
    console.log("BUTTON CLICKED ", textAreaRef.current.value);
    const clipBoard = navigator.clipboard;
    clipBoard.writeText(textAreaRef.current.value).then(() => {
      alert("Copied text to keyboard");
    });
  };

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

    const input = {
      secret: utils.BN256ToBin(secret).split(""),
      nullifier: utils.BN256ToBin(nullifier).split(""),
    };

    var res = await fetch("/deposit.wasm");
    console.log(wc, "inputs");

    var buffer = await res.arrayBuffer();
    var depositWC = await wc(buffer);

    const r = await depositWC.calculateWitness(input, 0);

    console.log(r, "RRR");

    const nullifierHash = r[1];
    const commitment = r[2];

    console.log(commitment, "Commit");

    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const ethValue = ethers.utils.parseEther(depositValue);

    // console.log(ethValue);

    // // console.log(contract, "Contract");

    // // // Ensure the correct method signature is used for the deposit function

    console.log(ethValue, "ETHVALUE");
    console.log(contract, "CONTRACT INSTAANCE");
    const tx = await contract.deposit(commitment, { value: ethValue });
    const receipt = await tx.wait();

    // Access event logs from the receipt
    const depositEvent = receipt.events.find(
      (event) => event.event === "Deposit"
    );

    setAllDepositEventsObj(tx);
    if (depositEvent) {
      // Access the event parameters
      const { root, hashPairings, pairDirection } = depositEvent.args;
      let listOfTxn = [];
      const transactionHash = {
        [tx.hash]: {
          root,
          hashPairings,
          pairDirection,
        },
      };
      listOfTxn.push(transactionHash);
      localStorage.setItem(
        "depositTransaction",
        JSON.stringify([...listOfTxn])
      );
    } else {
      console.log("Deposit event not found in the receipt");
    }

    // console.log(receipt.log, "txxxnnn");

    // const tornadoInterface = new ethers.utils.Interface(ABI);
    // console.log(tornadoInterface, "IIIII");
    // console.log(
    //   "DDDDDDDDDDDDD",
    //   contract.interface.encodeFunctionData("deposit", [commitment])
    // );

    // console.log(signer, "ADDDDDRESSS");
    // const tx = {
    //   to: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    //   from: wallet.account[0],
    //   value: ethValue,
    //   data: contract.interface.encodeFunctionData("deposit", [commitment]),
    // };

    // console.log(tx);

    // const sentTransaction = await wallet.account[0].sendTransaction(tx);
    // const receipt = await sentTransaction.wait(2);
    // console.log("RECEIPTSSS", receipt);

    // console.log(
    //   contract.interface.decodeEventLog("deposit", logs.data, logs.topics),
    //   "EVENTSSS"
    // );

    // try {
    const proofElements = {
      nullifierHash: `${nullifierHash}`,
      secret: secret,
      nullifier: nullifier,
      commitment: `${commitment}`,
      txHash: receipt,
    };

    updateProofStringEl(btoa(JSON.stringify(proofElements)));
    console.log(proofStringEl, "PROOFFFFFFFFFFFFINNN TEXTTT");

    //   console.log(proofElements, "PROOFFF");
    // } catch (e) {
    //   console.log(e);
    // }
    // if (contract) {
    // const tx = await contract.deposit({ value: ethValue }, commitment);
    // await tx.wait(2);
    // console.log(JSON.stringify(tx));
    // }
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
        <div>Account Balance : {wallet.balance}</div>
        <div> ChainId: {parseInt(wallet.chainId)}</div>
        {wallet.account.length > 0 && (
          <div>Wallet Accounts: {wallet.account[0]}</div>
        )}

        <input
          type="number"
          onChange={(e) => setDepositValue(e.target.value)}
          value={depositValue}
        />
        <button
          className="rounded py-4 px-8 text-white-400 bg-green-700"
          onClick={handleDepositEth}
        >
          Deposit 1 Eth
        </button>

        <div>
          {proofStringEl && (
            <div>
              <textarea ref={textAreaRef}>{proofStringEl}</textarea>
              <button onClick={handleCopy}>Copy Proof</button>
            </div>
          )}
        </div>
        {/* <div>
          <div className="alert alert-succ">
            <span>
              <strong>Proof of Deposit:</strong>
            </span>
            <div className="p-1" style={{ lineHeight: "12px" }}>
              <span
                style={{ fontSize: 10 }}
                ref={(proofStringEl) => {
                  updateProofStringEl(proofStringEl);
                }}
              >
                {proofStringEl}
              </span>
            </div>
          </div>

          <div>
            <button className="btn btn-success" onClick={copyProof}>
              <span className="small">Copy Proof String</span>
            </button>
            {!!displayCopiedMessage && (
              <span className="small" style={{ color: "green" }}>
                <strong> Copied!</strong>
              </span>
            )}
          </div>
        </div> */}

        <input
          type="button"
          onClick={triggerDeposit}
          className="hidden"
          ref={depositRef} // Add this ref to the button element
        />
      </div>

      <hr />

      <div>
        <h1>Withdraw:</h1>
        <textarea ref={withdrawTextArea}></textarea>

        <button onClick={handleWithdrawEth}>Withdraw eth</button>
      </div>
    </div>
  );
};

export default Tornado;
