
import { web3, ADDRESS, privateKey } from './web3Service.js';
import { ROUTER, BLACK, USDC, PAIR_USDC } from '../config/constants.js';
import { ROUTER_ABI, PAIR_ABI, LP_ABI } from '../config/abi.js';
import { getBalanceAndAllowance, getFormattedTimestamp, Colors, getGas } from '../utils/helpers.js';
import { approveToken } from './transactionService.js';

const router = new web3.eth.Contract(ROUTER_ABI, ROUTER);
const pairContract = new web3.eth.Contract(PAIR_ABI, PAIR_USDC);
const lpContract = new web3.eth.Contract(LP_ABI, PAIR_USDC);

async function quoteAmountB(amountA) {
    const [reserves, token0] = await Promise.all([
        pairContract.methods.getReserves().call(),
        pairContract.methods.token0().call()
    ]);

    const res0 = BigInt(reserves._reserve0);
    const res1 = BigInt(reserves._reserve1);

    let reserveA, reserveB;
    if (token0.toLowerCase() === BLACK.toLowerCase()) {
        reserveA = res0;
        reserveB = res1;
    } else {
        reserveA = res1;
        reserveB = res0;
    }

    if (reserveA === BigInt(0)) return BigInt(0);
    return (amountA * reserveB) / reserveA;
}

export async function addLiquidity() {
    const [blackData, usdcData] = await Promise.all([
        getBalanceAndAllowance(BLACK, ADDRESS, ROUTER),
        getBalanceAndAllowance(USDC, ADDRESS, ROUTER)
    ]);

    const amtA = BigInt(Math.floor(0.001 * Math.pow(10, blackData.decimals)));

    if (blackData.balance < amtA) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Saldo BLACK tidak cukup untuk menambah likuiditas.${Colors.RESET}`);
        return false;
    }

    const amtB = await quoteAmountB(amtA);

    if (usdcData.balance < amtB) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Saldo USDC tidak cukup untuk menambah likuiditas.${Colors.RESET}`);
        return false;
    }

    if (blackData.allowance < amtA) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Allowance BLACK tidak cukup, memulai approval...${Colors.RESET}`);
        if (!await approveToken(BLACK, ROUTER, amtA)) return false;
    }
    if (usdcData.allowance < amtB) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Allowance USDC tidak cukup, memulai approval...${Colors.RESET}`);
        if (!await approveToken(USDC, ROUTER, amtB)) return false;
    }

    const minA = (amtA * BigInt(95)) / BigInt(100);
    const minB = (amtB * BigInt(95)) / BigInt(100);

    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.CYAN}Menambah Likuiditas: ${web3.utils.fromWei(amtA, 'ether')} BLACK + ${web3.utils.fromWei(amtB, 'mwei')} USDC${Colors.RESET}`);

    try {
        const nonce = await web3.eth.getTransactionCount(ADDRESS, 'latest');
        const gasPrice = await getGas();
        console.log(`         Gas Price  : ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);

        const txData = router.methods.addLiquidity(
            BLACK, USDC, false,
            amtA.toString(), amtB.toString(),
            minA.toString(), minB.toString(),
            ADDRESS, Math.floor(Date.now() / 1000) + 300
        ).encodeABI();
        
        const tx = {
            from: ADDRESS, to: ROUTER, nonce: nonce, gas: 300000, gasPrice: gasPrice, data: txData
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.BLUE}Transaksi terkirim${Colors.RESET}`);
        console.log(`         TX Hash    : ${receipt.transactionHash}`);

        if (receipt.status) {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Likuiditas berhasil ditambahkan${Colors.RESET}`);
            return true;
        } else {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Gagal menambah likuiditas${Colors.RESET}`);
            return false;
        }
    } catch (error) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Error saat menambah likuiditas: ${error.message}${Colors.RESET}`);
        return false;
    }
}

export async function claimFees() {
    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.CYAN}Mencoba claim fees...${Colors.RESET}`);
    try {
        const nonce = await web3.eth.getTransactionCount(ADDRESS, 'latest');
        const gasPrice = await getGas();
        console.log(`         Gas Price  : ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);

        const tx = {
            from: ADDRESS, to: PAIR_USDC, nonce: nonce, gas: 150000, gasPrice: gasPrice,
            data: lpContract.methods.claimFees().encodeABI()
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.BLUE}Claim TX sent: ${receipt.transactionHash}${Colors.RESET}`);

        if (receipt.status) {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Claim sukses!${Colors.RESET}`);
            return true;
        } else {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Claim gagal.${Colors.RESET}`);
            return false;
        }
    } catch (error) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Claim error: ${error.message}${Colors.RESET}`);
        return false;
    }
}
