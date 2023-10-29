import Web3 from "web3/lib/types";
import {createContext, useContext} from "react";

export type Web3ContextDataType = {
	mainnet: Web3,
	bsc: Web3
}

export const Web3Context = createContext<Web3ContextDataType>({} as any)

export const useWeb3Services = () => useContext(Web3Context)