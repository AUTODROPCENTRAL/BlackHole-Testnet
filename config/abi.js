export const ERC20_ABI = [
    {"constant": false, "inputs": [{"name": "spender", "type": "address"}, {"name": "value", "type": "uint256"}], "name": "approve", "outputs": [{"name": "", "type": "bool"}], "type": "function"},
    {"constant": true, "inputs": [{"name": "owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "", "type": "uint256"}], "type": "function"},
    {"constant": true, "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}], "name": "allowance", "outputs": [{"name": "", "type": "uint256"}], "type": "function"},
    {"constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "type": "function"}
];

export const ROUTER_ABI = [
    {
        "name": "swapExactTokensForTokens",
        "type": "function",
        "inputs": [
            {"name": "amountIn", "type": "uint256"},
            {"name": "amountOutMin", "type": "uint256"},
            {"name": "routes", "type": "tuple[]", "components": [
                {"name": "pair", "type": "address"},
                {"name": "from", "type": "address"},
                {"name": "to", "type": "address"},
                {"name": "stable", "type": "bool"},
                {"name": "concentrated", "type": "bool"},
                {"name": "receiver", "type": "address"}
            ]},
            {"name": "to", "type": "address"},
            {"name": "deadline", "type": "uint256"}
        ],
        "outputs": [{"name": "amounts", "type": "uint256[]"}],
        "stateMutability": "nonpayable"
    },
    {
        "name": "addLiquidity",
        "type": "function",
        "inputs": [
            {"name": "tokenA", "type": "address"},
            {"name": "tokenB", "type": "address"},
            {"name": "stable", "type": "bool"},
            {"name": "amountADesired", "type": "uint256"},
            {"name": "amountBDesired", "type": "uint256"},
            {"name": "amountAMin", "type": "uint256"},
            {"name": "amountBMin", "type": "uint256"},
            {"name": "to", "type": "address"},
            {"name": "deadline", "type": "uint256"}
        ],
        "outputs": [
            {"name": "amountA", "type": "uint256"},
            {"name": "amountB", "type": "uint256"},
            {"name": "liquidity", "type": "uint256"}
        ],
        "stateMutability": "nonpayable"
    }
];

export const PAIR_ABI = [
    {"constant": true, "inputs": [], "name": "getReserves", "outputs": [
        {"name": "_reserve0", "type": "uint112"},
        {"name": "_reserve1", "type": "uint112"},
        {"name": "_blockTimestampLast", "type": "uint32"}], "type": "function"},
    {"constant": true, "inputs": [], "name": "token0", "outputs": [{"name": "", "type": "address"}], "type": "function"},
    {"constant": true, "inputs": [], "name": "token1", "outputs": [{"name": "", "type": "address"}], "type": "function"}
];

export const LP_ABI = [
    {
        "inputs": [],
        "name": "claimFees",
        "outputs": [
            {"internalType": "uint256", "name": "claimed0", "type": "uint256"},
            {"internalType": "uint256", "name": "claimed1", "type": "uint256"}
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const LOCK_ABI = [
    {
        "name": "create_lock",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"internalType": "uint256", "name": "_value", "type": "uint256"},
            {"internalType": "uint256", "name": "_lock_duration", "type": "uint256"},
            {"internalType": "bool", "name": "isSMNFT", "type": "bool"}
        ],
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}]
    },
    {
        "name": "increase_amount",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"internalType": "uint256", "name": "_tokenId", "type": "uint256"},
            {"internalType": "uint256", "name": "_value", "type": "uint256"}
        ],
        "outputs": []
    },
    {
        "name": "merge",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"internalType": "uint256", "name": "_from", "type": "uint256"},
            {"internalType": "uint256", "name": "_to", "type": "uint256"}
        ],
        "outputs": []
    },
    {
        "name": "balanceOf",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}]
    },
    {
        "name": "tokenOfOwnerByIndex",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "uint256", "name": "index", "type": "uint256"}
        ],
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}]
    }
];

export const INCENTIVE_ABI = [
    {
        "name": "notifyRewardAmount",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"internalType": "address", "name": "_rewardsToken", "type": "address"},
            {"internalType": "uint256", "name": "reward", "type": "uint256"}
        ],
        "outputs": []
    }
];
