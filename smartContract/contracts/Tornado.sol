// // SPDX-License-Identifier: UNLICENSED
// pragma solidity =0.8.17;


// import "./Reentrancy.sol";
// import "./MiMCSponge.sol";
// import "./interfaces/IMiMCSponge.sol";

// contract Tornado is ReentrancyGuard {

//      IMiMCSponge mimcSponge;
//     constructor(address spongeContractAddress){
//         mimcSponge = IMiMCSponge(spongeContractAddress);
//     }

// event Deposit(   uint256[10]  hashDirections,
//         uint256[10]  hashPairings, uint256 rootHash);

//     uint8 treeHeight = 10;
//     mapping(uint256 => bool) commitments;
//     mapping(uint256 => bool) allRoots;

//     mapping(uint256 => uint256) lastLevelhash;

//     // we are going to use this to track each and every leafIndex to know if the merkle tree is full cause  if this is >= to the 2^ of the treeHeight then the merkle tree is full
  

//     uint256[10] private levelDefaults = [
//         23183772226880328093887215408966704399401918833188238128725944610428185466379,
//         24000819369602093814416139508614852491908395579435466932859056804037806454973,
//         90767735163385213280029221395007952082767922246267858237072012090673396196740,
//         36838446922933702266161394000006956756061899673576454513992013853093276527813,
//         68942419351509126448570740374747181965696714458775214939345221885282113404505,
//         50082386515045053504076326033442809551011315580267173564563197889162423619623,
//         73182421758286469310850848737411980736456210038565066977682644585724928397862,
//         60176431197461170637692882955627917456800648458772472331451918908568455016445,
//         105740430515862457360623134126179561153993738774115400861400649215360807197726,
//         76840483767501885884368002925517179365815019383466879774586151314479309584255
//     ];



//     function deposit(uint256 commitmentHash) public  payable nonReentrant(){
//         uint256 leafIndex = 0;
    
//         uint256[10] memory hashDirections;
//         uint256[10] memory hashPairings;
//         uint256  leftPair;
//         uint256 rightPair;

//         uint256[2] memory _insForMimC;

//         uint256 currenthash = commitmentHash;

        
//            uint256 currentIdx = leafIndex;
           
//         require(msg.value > 0, "you need to deposit more than 0 eth");

//                 // we check if the merkle tree is full   2 ^height of the tree tell us the size of the merkle tree
//         // we need to place the commitment hash into the tree 
//         require(leafIndex < 2**treeHeight, "tree is full cannot make a deposit");

//         // we need to check commitment hash exist cause we cannot repeat two deposits 

//         require(!commitments[commitmentHash], "duplicates are not allowed ");
        
//         for (uint8 i = 0 ; i< treeHeight ; i++){

   



// // this means that are on the left 
//             if (currentIdx %2 == 0){
//                 leftPair = currenthash;
//                 rightPair = levelDefaults[i];
//                 hashDirections[i] = 0;
//                 hashPairings[i] = levelDefaults[i];


//             }else{


//                     leftPair = levelDefaults[i];
//                    rightPair = currenthash;
//                     hashDirections[i] = 1;
//                     hashPairings[i] = lastLevelhash[i];
//             }

//             lastLevelhash[i] = currenthash;

//              _insForMimC[0] = leftPair;
//              _insForMimC[1] = rightPair;
//             (uint256 h) = mimcSponge.createNewHashFromTwo{value:150000}(_insForMimC, commitmentHash);

//             currenthash = h;
//             currentIdx =  currentIdx/2;
            


//         }

//         uint256 newRoot = currenthash;
//         allRoots[newRoot] = true;

       

//         leafIndex = leafIndex + 1;
//         commitments[commitmentHash] = true;

//         emit Deposit(hashDirections, hashPairings, newRoot);


//         // after we deposit to the leaf we need to get the path of the merkle tree to the node 


       

        


//     }


//     function withdraw() public nonReentrant() {

//     }
// }


pragma solidity =0.8.17;

import "./MiMCSponge.sol";
import "./ReentrancyGuard.sol";

interface IVerifier {
    function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[3] memory input) external;
}

contract Tornado is ReentrancyGuard {
    // address verifier;
    Hasher hasher;
    address verifier;

    uint8 public treeLevel = 10;
    uint256 public denomination = 1 ether;

    uint256 public nextLeafIdx = 0;
    mapping(uint256 => bool) public roots;
    mapping(uint8 => uint256) lastLevelHash;
    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => bool) public commitments;
    
    uint256[10] levelDefaults = [
        23183772226880328093887215408966704399401918833188238128725944610428185466379,
        24000819369602093814416139508614852491908395579435466932859056804037806454973,
        90767735163385213280029221395007952082767922246267858237072012090673396196740,
        36838446922933702266161394000006956756061899673576454513992013853093276527813,
        68942419351509126448570740374747181965696714458775214939345221885282113404505,
        50082386515045053504076326033442809551011315580267173564563197889162423619623,
        73182421758286469310850848737411980736456210038565066977682644585724928397862,
        60176431197461170637692882955627917456800648458772472331451918908568455016445,
        105740430515862457360623134126179561153993738774115400861400649215360807197726,
        76840483767501885884368002925517179365815019383466879774586151314479309584255
    ];

    event Deposit(uint256 root, uint256[10] hashPairings, uint8[10] pairDirection);
    event Withdrawal(address to, uint256 nullifierHash);

    constructor(
        address _hasher,
        address _verifier
      
    ){
        hasher = Hasher(_hasher);
        verifier = _verifier;
    }

    function deposit(uint256 _commitment) external payable nonReentrant {
        require(msg.value == denomination, "increatese the amount of eth");
        require(!commitments[_commitment], "existing-commitment");
        require(nextLeafIdx < 2 ** treeLevel, "tree-full");

        uint256 newRoot;
        uint256[10] memory hashPairings;
        uint8[10] memory hashDirections;

        uint256 currentIdx = nextLeafIdx;
        uint256 currentHash = _commitment;

        uint256 left;
        uint256 right;
        uint256[2] memory ins;
        
        for(uint8 i = 0; i < treeLevel; i++){
            
            if(currentIdx % 2 == 0){
                left = currentHash;
                right = levelDefaults[i];
                hashPairings[i] = levelDefaults[i];
                hashDirections[i] = 0;
            }else{
                left = lastLevelHash[i];
                right = currentHash;
                hashPairings[i] = lastLevelHash[i];
                hashDirections[i] = 1;
            }
            lastLevelHash[i] = currentHash;

            ins[0] = left;
            ins[1] = right;

            (uint256 h) = hasher.MiMC5Sponge{ gas: 150000 }(ins, _commitment);

            currentHash = h;
            currentIdx = currentIdx / 2;
        }

        newRoot = currentHash;
        roots[newRoot] = true;
        nextLeafIdx += 1;

        commitments[_commitment] = true;
        emit Deposit(newRoot, hashPairings, hashDirections);
    }

    function withdraw(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) external payable nonReentrant {
        uint256 _root = input[0];
        uint256 _nullifierHash = input[1];

        require(!nullifierHashes[_nullifierHash], "already-spent");
        require(roots[_root], "not-root");

        uint256 _addr = uint256(uint160(msg.sender));

        (bool verifyOK, ) = verifier.call(abi.encodeCall(IVerifier.verifyProof, (a, b, c, [_root, _nullifierHash, _addr])));

        require(verifyOK, "invalid-proof");

        nullifierHashes[_nullifierHash] = true;
        address payable target = payable(msg.sender);

        (bool ok, ) = target.call{ value: denomination }("");

        require(ok, "payment-failed");

        emit Withdrawal(msg.sender, _nullifierHash);
    }
                
}