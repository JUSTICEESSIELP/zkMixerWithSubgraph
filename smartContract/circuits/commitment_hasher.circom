


pragma circom  2.0.0;

include "./utils/pedersen.circom";
 

 // we place the nullifier and secret as input and use the Pedersen hash to hash me in a concatenated form
template CommitmentHasher() {

    // Declaration of signals.
    signal input secret[256];
    signal input nullifier[256];
    signal output nullifierHash;
    signal output commitment;

    component commitment_Hasher = Pedersen(512);
    component nullifier_Hasher = Pedersen(256);


    for (var i = 0; i < 256 ; i++){
        // nullifierHash
       nullifier_Hasher.in[i] <== nullifier[i];

       // lets concatenate the nullifer and secret
       commitment_Hasher.in[i] <== nullifier[i];
       commitment_Hasher.in[i + 256] <== secret[i];
    }

    nullifierHash <== nullifier_Hasher.o;
    commitment <== commitment_Hasher.o;



 

}




