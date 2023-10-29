




export const NormalERC20ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
] as const






export const ERC20ABI = [{
	"inputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"anonymous": false,
	"inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
		"indexed": true,
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}],
	"name": "Approval",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "previousOwner",
		"type": "address"
	}, {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}],
	"name": "OwnershipTransferred",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{"indexed": true, "internalType": "address", "name": "from", "type": "address"}, {
		"indexed": true,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}],
	"name": "Transfer",
	"type": "event"
}, {
	"constant": true,
	"inputs": [],
	"name": "_decimals",
	"outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "_name",
	"outputs": [{"internalType": "string", "name": "", "type": "string"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "_symbol",
	"outputs": [{"internalType": "string", "name": "", "type": "string"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "newAddress", "type": "address"}],
	"name": "addWhiteList",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"name": "addresses",
	"outputs": [{"internalType": "address", "name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
		"internalType": "address",
		"name": "spender",
		"type": "address"
	}],
	"name": "allowance",
	"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "approve",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"internalType": "address", "name": "account", "type": "address"}],
	"name": "balanceOf",
	"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
	"name": "burn",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"name": "copyAddresses",
	"outputs": [{"internalType": "address", "name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "decimals",
	"outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
		"internalType": "uint256",
		"name": "subtractedValue",
		"type": "uint256"
	}],
	"name": "decreaseAllowance",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "feeHighLimit",
	"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "feeLowerLimit",
	"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "getOwner",
	"outputs": [{"internalType": "address", "name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [],
	"name": "getRandomNumber",
	"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {
		"internalType": "uint256",
		"name": "addedValue",
		"type": "uint256"
	}],
	"name": "increaseAllowance",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"internalType": "address", "name": "_pair", "type": "address"}],
	"name": "isPair",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"internalType": "address", "name": "account", "type": "address"}],
	"name": "isWhiteList",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "name",
	"outputs": [{"internalType": "string", "name": "", "type": "string"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "owner",
	"outputs": [{"internalType": "address", "name": "", "type": "address"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [{"internalType": "address", "name": "", "type": "address"}],
	"name": "pairs",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "_pair", "type": "address"}],
	"name": "removeNewPair",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "newAddress", "type": "address"}],
	"name": "removeWhiteList",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [],
	"name": "renounceOwnership",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
	"name": "setFeeHighLimit",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "uint256", "name": "limit", "type": "uint256"}],
	"name": "setLowerFeeLimit",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "_pair", "type": "address"}],
	"name": "setNewPair",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "symbol",
	"outputs": [{"internalType": "string", "name": "", "type": "string"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": true,
	"inputs": [],
	"name": "totalSupply",
	"outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
	"payable": false,
	"stateMutability": "view",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "recipient", "type": "address"}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "transfer",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "sender", "type": "address"}, {
		"internalType": "address",
		"name": "recipient",
		"type": "address"
	}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
	"name": "transferFrom",
	"outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"constant": false,
	"inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
	"name": "transferOwnership",
	"outputs": [],
	"payable": false,
	"stateMutability": "nonpayable",
	"type": "function"
}] as const