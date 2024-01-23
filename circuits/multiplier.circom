pragma circom  2.0.0;


template Multiplier2() {

    // Declaration of signals.
    signal input a;
    signal input b;
    signal output _out;

    _out <== a * b;
    _out === 9;

    // Constraints.

}


component main = Multiplier2();
