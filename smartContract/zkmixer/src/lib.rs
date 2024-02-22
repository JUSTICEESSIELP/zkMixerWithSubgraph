mod abi;
mod pb;
use hex_literal::hex;
use pb::contract::v1 as contract;
use substreams::Hex;
use substreams_database_change::pb::database::DatabaseChanges;
use substreams_database_change::tables::Tables as DatabaseChangeTables;
use substreams_entity_change::pb::entity::EntityChanges;
use substreams_entity_change::tables::Tables as EntityChangesTables;
use substreams_ethereum::pb::eth::v2 as eth;
use substreams_ethereum::Event;

#[allow(unused_imports)]
use num_traits::cast::ToPrimitive;
use std::str::FromStr;
use substreams::scalar::BigDecimal;

substreams_ethereum::init!();

const TORNADO_TRACKED_CONTRACT: [u8; 20] = hex!("4f7a67464b5976d7547c860109e4432d50afb38e");

fn map_tornado_events(blk: &eth::Block, events: &mut contract::Events) {
    events.tornado_approvals.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::Approval::match_and_decode(log) {
                        return Some(contract::TornadoApproval {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            owner: event.owner,
                            spender: event.spender,
                            value: event.value.to_string(),
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_deposits.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::Deposit::match_and_decode(log) {
                        return Some(contract::TornadoDeposit {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_amount: event.u_amount.to_string(),
                            u_dst: event.u_dst,
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_message_faileds.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::MessageFailed::match_and_decode(log) {
                        return Some(contract::TornadoMessageFailed {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_nonce: event.u_nonce.to_u64(),
                            u_payload: event.u_payload,
                            u_reason: event.u_reason,
                            u_src_address: event.u_src_address,
                            u_src_chain_id: event.u_src_chain_id.to_u64(),
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_ownership_transferreds.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::OwnershipTransferred::match_and_decode(log) {
                        return Some(contract::TornadoOwnershipTransferred {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            new_owner: event.new_owner,
                            previous_owner: event.previous_owner,
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_receive_from_chains.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::ReceiveFromChain::match_and_decode(log) {
                        return Some(contract::TornadoReceiveFromChain {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_amount: event.u_amount.to_string(),
                            u_src_chain_id: event.u_src_chain_id.to_u64(),
                            u_to: event.u_to,
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_retry_message_successes.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::RetryMessageSuccess::match_and_decode(log) {
                        return Some(contract::TornadoRetryMessageSuccess {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_nonce: event.u_nonce.to_u64(),
                            u_payload_hash: Vec::from(event.u_payload_hash),
                            u_src_address: event.u_src_address,
                            u_src_chain_id: event.u_src_chain_id.to_u64(),
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_send_to_chains.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::SendToChain::match_and_decode(log) {
                        return Some(contract::TornadoSendToChain {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_amount: event.u_amount.to_string(),
                            u_dst_chain_id: event.u_dst_chain_id.to_u64(),
                            u_from: event.u_from,
                            u_to_address: event.u_to_address,
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_set_min_dst_gases.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::SetMinDstGas::match_and_decode(log) {
                        return Some(contract::TornadoSetMinDstGas {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_dst_chain_id: event.u_dst_chain_id.to_u64(),
                            u_min_dst_gas: event.u_min_dst_gas.to_string(),
                            u_type: event.u_type.to_u64(),
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_set_precrimes.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::SetPrecrime::match_and_decode(log) {
                        return Some(contract::TornadoSetPrecrime {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            precrime: event.precrime,
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_set_trusted_remotes.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::SetTrustedRemote::match_and_decode(log) {
                        return Some(contract::TornadoSetTrustedRemote {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_path: event.u_path,
                            u_remote_chain_id: event.u_remote_chain_id.to_u64(),
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_set_trusted_remote_addresses.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::SetTrustedRemoteAddress::match_and_decode(log) {
                        return Some(contract::TornadoSetTrustedRemoteAddress {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_remote_address: event.u_remote_address,
                            u_remote_chain_id: event.u_remote_chain_id.to_u64(),
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_set_use_custom_adapter_params.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::SetUseCustomAdapterParams::match_and_decode(log) {
                        return Some(contract::TornadoSetUseCustomAdapterParams {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_use_custom_adapter_params: event.u_use_custom_adapter_params,
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_transfers.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::Transfer::match_and_decode(log) {
                        return Some(contract::TornadoTransfer {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            from: event.from,
                            to: event.to,
                            value: event.value.to_string(),
                        });
                    }

                    None
                })
        })
        .collect());
    events.tornado_withdrawals.append(&mut blk
        .receipts()
        .flat_map(|view| {
            view.receipt.logs.iter()
                .filter(|log| log.address == TORNADO_TRACKED_CONTRACT)
                .filter_map(|log| {
                    if let Some(event) = abi::tornado_contract::events::Withdrawal::match_and_decode(log) {
                        return Some(contract::TornadoWithdrawal {
                            evt_tx_hash: Hex(&view.transaction.hash).to_string(),
                            evt_index: log.block_index,
                            evt_block_time: Some(blk.timestamp().to_owned()),
                            evt_block_number: blk.number,
                            u_amount: event.u_amount.to_string(),
                            u_src: event.u_src,
                        });
                    }

                    None
                })
        })
        .collect());
}

fn db_tornado_out(events: &contract::Events, tables: &mut DatabaseChangeTables) {
    // Loop over all the abis events to create table changes
    events.tornado_approvals.iter().for_each(|evt| {
        tables
            .create_row("tornado_approval", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("owner", Hex(&evt.owner).to_string())
            .set("spender", Hex(&evt.spender).to_string())
            .set("value", BigDecimal::from_str(&evt.value).unwrap());
    });
    events.tornado_deposits.iter().for_each(|evt| {
        tables
            .create_row("tornado_deposit", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_dst", Hex(&evt.u_dst).to_string());
    });
    events.tornado_message_faileds.iter().for_each(|evt| {
        tables
            .create_row("tornado_message_failed", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_nonce", evt.u_nonce)
            .set("u_payload", Hex(&evt.u_payload).to_string())
            .set("u_reason", Hex(&evt.u_reason).to_string())
            .set("u_src_address", Hex(&evt.u_src_address).to_string())
            .set("u_src_chain_id", evt.u_src_chain_id);
    });
    events.tornado_ownership_transferreds.iter().for_each(|evt| {
        tables
            .create_row("tornado_ownership_transferred", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("new_owner", Hex(&evt.new_owner).to_string())
            .set("previous_owner", Hex(&evt.previous_owner).to_string());
    });
    events.tornado_receive_from_chains.iter().for_each(|evt| {
        tables
            .create_row("tornado_receive_from_chain", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_src_chain_id", evt.u_src_chain_id)
            .set("u_to", Hex(&evt.u_to).to_string());
    });
    events.tornado_retry_message_successes.iter().for_each(|evt| {
        tables
            .create_row("tornado_retry_message_success", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_nonce", evt.u_nonce)
            .set("u_payload_hash", Hex(&evt.u_payload_hash).to_string())
            .set("u_src_address", Hex(&evt.u_src_address).to_string())
            .set("u_src_chain_id", evt.u_src_chain_id);
    });
    events.tornado_send_to_chains.iter().for_each(|evt| {
        tables
            .create_row("tornado_send_to_chain", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_dst_chain_id", evt.u_dst_chain_id)
            .set("u_from", Hex(&evt.u_from).to_string())
            .set("u_to_address", Hex(&evt.u_to_address).to_string());
    });
    events.tornado_set_min_dst_gases.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_min_dst_gas", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_dst_chain_id", evt.u_dst_chain_id)
            .set("u_min_dst_gas", BigDecimal::from_str(&evt.u_min_dst_gas).unwrap())
            .set("u_type", evt.u_type);
    });
    events.tornado_set_precrimes.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_precrime", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("precrime", Hex(&evt.precrime).to_string());
    });
    events.tornado_set_trusted_remotes.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_trusted_remote", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_path", Hex(&evt.u_path).to_string())
            .set("u_remote_chain_id", evt.u_remote_chain_id);
    });
    events.tornado_set_trusted_remote_addresses.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_trusted_remote_address", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_remote_address", Hex(&evt.u_remote_address).to_string())
            .set("u_remote_chain_id", evt.u_remote_chain_id);
    });
    events.tornado_set_use_custom_adapter_params.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_use_custom_adapter_params", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_use_custom_adapter_params", evt.u_use_custom_adapter_params);
    });
    events.tornado_transfers.iter().for_each(|evt| {
        tables
            .create_row("tornado_transfer", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("from", Hex(&evt.from).to_string())
            .set("to", Hex(&evt.to).to_string())
            .set("value", BigDecimal::from_str(&evt.value).unwrap());
    });
    events.tornado_withdrawals.iter().for_each(|evt| {
        tables
            .create_row("tornado_withdrawal", [("evt_tx_hash", evt.evt_tx_hash.to_string()),("evt_index", evt.evt_index.to_string())])
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_src", Hex(&evt.u_src).to_string());
    });
}


fn graph_tornado_out(events: &contract::Events, tables: &mut EntityChangesTables) {
    // Loop over all the abis events to create table changes
    events.tornado_approvals.iter().for_each(|evt| {
        tables
            .create_row("tornado_approval", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("owner", Hex(&evt.owner).to_string())
            .set("spender", Hex(&evt.spender).to_string())
            .set("value", BigDecimal::from_str(&evt.value).unwrap());
    });
    events.tornado_deposits.iter().for_each(|evt| {
        tables
            .create_row("tornado_deposit", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_dst", Hex(&evt.u_dst).to_string());
    });
    events.tornado_message_faileds.iter().for_each(|evt| {
        tables
            .create_row("tornado_message_failed", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_nonce", evt.u_nonce)
            .set("u_payload", Hex(&evt.u_payload).to_string())
            .set("u_reason", Hex(&evt.u_reason).to_string())
            .set("u_src_address", Hex(&evt.u_src_address).to_string())
            .set("u_src_chain_id", evt.u_src_chain_id);
    });
    events.tornado_ownership_transferreds.iter().for_each(|evt| {
        tables
            .create_row("tornado_ownership_transferred", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("new_owner", Hex(&evt.new_owner).to_string())
            .set("previous_owner", Hex(&evt.previous_owner).to_string());
    });
    events.tornado_receive_from_chains.iter().for_each(|evt| {
        tables
            .create_row("tornado_receive_from_chain", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_src_chain_id", evt.u_src_chain_id)
            .set("u_to", Hex(&evt.u_to).to_string());
    });
    events.tornado_retry_message_successes.iter().for_each(|evt| {
        tables
            .create_row("tornado_retry_message_success", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_nonce", evt.u_nonce)
            .set("u_payload_hash", Hex(&evt.u_payload_hash).to_string())
            .set("u_src_address", Hex(&evt.u_src_address).to_string())
            .set("u_src_chain_id", evt.u_src_chain_id);
    });
    events.tornado_send_to_chains.iter().for_each(|evt| {
        tables
            .create_row("tornado_send_to_chain", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_dst_chain_id", evt.u_dst_chain_id)
            .set("u_from", Hex(&evt.u_from).to_string())
            .set("u_to_address", Hex(&evt.u_to_address).to_string());
    });
    events.tornado_set_min_dst_gases.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_min_dst_gas", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_dst_chain_id", evt.u_dst_chain_id)
            .set("u_min_dst_gas", BigDecimal::from_str(&evt.u_min_dst_gas).unwrap())
            .set("u_type", evt.u_type);
    });
    events.tornado_set_precrimes.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_precrime", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("precrime", Hex(&evt.precrime).to_string());
    });
    events.tornado_set_trusted_remotes.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_trusted_remote", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_path", Hex(&evt.u_path).to_string())
            .set("u_remote_chain_id", evt.u_remote_chain_id);
    });
    events.tornado_set_trusted_remote_addresses.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_trusted_remote_address", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_remote_address", Hex(&evt.u_remote_address).to_string())
            .set("u_remote_chain_id", evt.u_remote_chain_id);
    });
    events.tornado_set_use_custom_adapter_params.iter().for_each(|evt| {
        tables
            .create_row("tornado_set_use_custom_adapter_params", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_use_custom_adapter_params", evt.u_use_custom_adapter_params);
    });
    events.tornado_transfers.iter().for_each(|evt| {
        tables
            .create_row("tornado_transfer", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("from", Hex(&evt.from).to_string())
            .set("to", Hex(&evt.to).to_string())
            .set("value", BigDecimal::from_str(&evt.value).unwrap());
    });
    events.tornado_withdrawals.iter().for_each(|evt| {
        tables
            .create_row("tornado_withdrawal", format!("{}-{}", evt.evt_tx_hash, evt.evt_index))
            .set("evt_tx_hash", &evt.evt_tx_hash)
            .set("evt_index", evt.evt_index)
            .set("evt_block_time", evt.evt_block_time.as_ref().unwrap())
            .set("evt_block_number", evt.evt_block_number)
            .set("u_amount", BigDecimal::from_str(&evt.u_amount).unwrap())
            .set("u_src", Hex(&evt.u_src).to_string());
    });
}

#[substreams::handlers::map]
fn map_events(blk: eth::Block) -> Result<contract::Events, substreams::errors::Error> {
    let mut events = contract::Events::default();
    map_tornado_events(&blk, &mut events);
    Ok(events)
}

#[substreams::handlers::map]
fn db_out(events: contract::Events) -> Result<DatabaseChanges, substreams::errors::Error> {
    // Initialize Database Changes container
    let mut tables = DatabaseChangeTables::new();
    db_tornado_out(&events, &mut tables);
    Ok(tables.to_database_changes())
}

#[substreams::handlers::map]
fn graph_out(events: contract::Events) -> Result<EntityChanges, substreams::errors::Error> {
    // Initialize Database Changes container
    let mut tables = EntityChangesTables::new();
    graph_tornado_out(&events, &mut tables);
    Ok(tables.to_entity_changes())
}
