import {BigNumber} from "@ethersproject/bignumber";
import Web3 from "web3";
import {EtherUnits} from "web3-utils";

export const toHex = (value: string | number | BigNumber) => {
	if (value instanceof BigNumber) {
		return Web3.utils.toHex(value.toString())
	}
	return Web3.utils.toHex(value)
}
export const isHex = Web3.utils.isHex
export const toWei = Web3.utils.toWei
export const fromWei = Web3.utils.fromWei

class HexError extends Error {
	constructor(value: string) {
		super(`${value} isn't HEX`)
	}
}

export function hexToBuffer(value: string): Buffer {
	return Buffer.from(remove0xPrefix(value), "hex")
}

export function add0xPrefix(value: string) {
	if (!isHex(value)) {
		throw new HexError(value)
	}
	let v: string
	if (value.startsWith("0x")) {
		v = value.slice(2)
	} else {
		v = value
	}

	return "0x" + v
}

export function remove0xPrefix(value: string) {
	let v: string
	if (!isHex(value)) {
		throw new HexError(value)
	}
	if (value.startsWith("0x")) {
		v = value.slice(2)
	} else {
		v = value
	}
	return v
}


