pragma circom  2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";

template AgeLimit() {

  
    signal input ageOfUser;
    signal input setLimit;
    signal output outputBool;



    component greaterThan = GreaterEqThan(7);
    greaterThan.in[0] <== ageOfUser;
    greaterThan.in[1] <== setLimit;


   outputBool <== greaterThan.out;
    

    




}


component main {public [setLimit]} = AgeLimit();
