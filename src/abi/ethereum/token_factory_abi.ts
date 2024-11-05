export const TOKEN_FACTORY_ABI = [
    {
        "type": "function",
        "name": "DECIMALS",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "createToken",
        "inputs": [
            {
                "name": "name",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "ticker",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "maxSupply",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "tokenAddress",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "TokenCreated",
        "inputs": [
            {
                "name": "tokenAddress",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "name",
                "type": "string",
                "indexed": true,
                "internalType": "string"
            },
            {
                "name": "ticker",
                "type": "string",
                "indexed": true,
                "internalType": "string"
            }
        ],
        "anonymous": false
    }
]