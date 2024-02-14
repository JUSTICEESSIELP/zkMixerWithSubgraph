// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.17;


interface IMiMCSponge{
    function createNewHashFromTwo( uint256[2] memory inputs,  uint256 k) external  returns(uint256);
    function mimcHasherFeistal(uint256 _iL, uint256 _iR, uint256 k) external   returns(uint256, uint256);

}



