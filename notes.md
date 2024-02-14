npm install circomlib

---

after circuit construction... \*

---

- STEP1 : COMPILE AND GET R1CS TO GENERATE WITNESS:
  circom <filenanme path> --r1cs --wasm --sym
  eg circom multiplier.circom --r1cs --wasm

- STEP2 : GENERATE WITNESS WITH WASM FILE + INPUT.JSON AND EXECUTE THE GENERATE JS FILE

### Read R1CS File

```
snarkjs r1cs print circuit.r1cs
snarkjs r1cs info circuit.r1cs
```

### JS File to create a witness vector

```
circom circuit.circom --r1cs --sym --wasm
```

Create an input.json file & give the input values

```
{"a": "4","b": "73"}
```

### Export witness

```
node generate_witness.js circuit.wasm input.json witness.wtns
snarkjs wtns export json witness.wtns
```

-STEP3: POWERS OF TAU CEREMONY
https://github.com/iden3/snarkjs

**********\*\*\*\***********With HARD CIRCOM THINGS ARE DIFFERENT
-ADDITIONAL NOTES
hardhat-circom .. this gives an environment to import templates..

https://www.npmjs.com/package/hardhat-circom

circom: {
// (optional) Base path for input files, defaults to `./circuits/`

    inputBasePath: "./circuits",



    // (required) The final ptau file, relative to inputBasePath, from a Phase 1 ceremony

    ptau: "pot15_final.ptau",


    // (required) Each object in this array refers to a separate circuit


    circuits: [
        // this is the name of the circom file
      { name: "ageLimit" }
    ],

},

-- WRITE THE CIRCUIT , INCLUDE THE INPUT.JSON , CHECK YOUR HARDHAT CONFIG TO MAKE SURE THE CONFIG IS RIGHT ;

HOW TO HANDLE THE MIN.JS FOR SNARK JS FOR THE FRONT END

---

npm root -g **************\*\***************

----this returns the file path of the global node modules

-- go into the snarkjs folder in the node_modules

-- go into the build folder

---- find the snark js file
eg mine is

**\***CLI COMMAND FOR ME TO SEE THE CODE
code C:\Users\essie\AppData\Roaming\npm\node_modules\snarkjs\build\snarkjs.js

-- we use snark.js not the snark.min.js

BEGINNINGS TO GRAPH PROTOCOLS IMPORTANCE
https://medium.com/linum-labs/everything-you-ever-wanted-to-know-about-events-and-logs-on-ethereum-fec84ea7d0a5






ALL EIPS
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-999.md


{
  "name": "@se-2/subgraph",
  "version": "0.0.1",
  "scripts": {
    "abi-copy": "ts-node scripts/abi_copy.ts",
    "codegen": "graph codegen",
    "build": "graph build",
    "deploy": "graph deploy --node https://api.thegraph.com/deploy/ --ipfs https://api.thegraph.com/ipfs/ GITHUB_USERNAME/your-contract",
    "local-create": "graph create --node http://localhost:8020/ scaffold-eth/your-contract",
    "local-remove": "graph remove --node http://localhost:8020/ scaffold-eth/your-contract",
    "local-deploy": "graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 scaffold-eth/your-contract",
    "local-ship": "yarn abi-copy && yarn codegen && yarn build --network localhost && yarn local-deploy",
    "run-node": "cd graph-node && docker-compose up",
    "stop-node": "cd graph-node && docker-compose down",
    "clean-node": "rm -rf graph-node/data/"
  },
  "dependencies": {
    "@graphprotocol/graph-cli": "^0.55.0",
    "@graphprotocol/graph-ts": "^0.31.0",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4"
  }
}
