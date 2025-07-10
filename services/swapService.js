
import { web3, ADDRESS, privateKey } from './web3Service.js';
import { ROUTER, BLACK, TOKEN_SYMBOLS } from '../config/constants.js';
import { ROUTER_ABI } from '../config/abi.js';
import { getBalanceAndAllowance, getFormattedTimestamp, Colors, getGas } from '../utils/helpers.js';
import { approveToken } from './transactionService.js';



const router = new web3.eth.Contract(ROUTER_ABI, ROUTER);

export async function doSwap(amountBlack, toToken, pairAddress, concentrated = false) {
    const { balance, allowance, decimals } = await getBalanceAndAllowance(BLACK, ADDRESS, ROUTER);
    const amountIn = BigInt(Math.floor(amountBlack * Math.pow(10, decimals)));
    const minOut = BigInt(0);

    if (balance < amountIn) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Saldo BLACK tidak cukup untuk swap.${Colors.RESET}`);
        return false;
    }

    if (allowance < amountIn) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Mengecek allowance BLACK untuk Router Contract...${Colors.RESET}`);
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Allowance tidak cukup – memulai proses approval...${Colors.RESET}`);
        const approved = await approveToken(BLACK, ROUTER, amountIn);
        if (!approved) {
            return false;
        }
    }

    const symbol = TOKEN_SYMBOLS[toToken] || "Unknown";
    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.CYAN}Melakukan swap ${amountBlack} BLACK ke ${symbol}${Colors.RESET}`);

    const route = [{
        pair: pairAddress,
        from: BLACK,
        to: toToken,
        stable: false,
        concentrated: concentrated,
        receiver: ADDRESS
    }];

    try {
        const nonce = await web3.eth.getTransactionCount(ADDRESS, 'latest');
        const gasPrice = await getGas();
        console.log(`         Gas Price  : ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);

        const txData = router.methods.swapExactTokensForTokens(
            amountIn.toString(),
            minOut.toString(),
            route,
            ADDRESS,
            Math.floor(Date.now() / 1000) + 300
        ).encodeABI();
        
        const tx = {
            from: ADDRESS,
            to: ROUTER,
            nonce: nonce,
            gas: 550000,
            gasPrice: gasPrice,
            data: txData
        };
        
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.BLUE}Transaksi terkirim${Colors.RESET}`);
        console.log(`         TX Hash    : ${receipt.transactionHash}`);

        if (receipt.status) {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Swap berhasil${Colors.RESET}`);
            return true;
        } else {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Swap gagal (status 0)${Colors.RESET}`);
            return false;
        }
    } catch (error) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}ERROR saat swap: ${error.message}${Colors.RESET}`);
        return false;
    }
}
