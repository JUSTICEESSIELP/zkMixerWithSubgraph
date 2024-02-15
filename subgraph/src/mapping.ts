import {
  Tornado as TornadoContract,
  Deposit as DepositEvent,
  Withdrawal as WithdrawalEvent,
} from "../generated/Tornado/Tornado";

import { Deposit, Withdrawal } from "../generated/schema";

export function handleDeposit(event: DepositEvent): void {
  let depositSchema = Deposit.load(event.transaction.hash.toHex());
  if (!depositSchema) {
    depositSchema = new Deposit(event.transaction.hash.toHex());
    depositSchema.root = event.params.root;
    depositSchema.hashPairings = event.params.hashPairings;
    depositSchema.pairDirection = event.params.pairDirection;
  }
  depositSchema.save();
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let withdrawalSchema = Withdrawal.load(event.transaction.hash.toHex());

  if (!withdrawalSchema) {
    withdrawalSchema = new Withdrawal(event.transaction.hash.toHex());
    withdrawalSchema.to = event.params.to;
    withdrawalSchema.nulliferHash = event.params.nullifierHash;
  }
}
