
import { web3, ADDRESS } from './web3Service.js';
import { LOCK_CONTRACT, INCENTIVE_CONTRACT, BLACK } from '../config/constants.js';
import { LOCK_ABI, INCENTIVE_ABI } from '../config/abi.js';
import { getBalanceAndAllowance, getFormattedTimestamp, Colors, delay } from '../utils/helpers.js';
import { sendTx, approveToken } from './transactionService.js';



const lockContract = new web3.eth.Contract(LOCK_ABI, LOCK_CONTRACT);
const incentiveContract = new web3.eth.Contract(INCENTIVE_ABI, INCENTIVE_CONTRACT);

async function getOwnedTokenIds(address) {
    const balance = await lockContract.methods.balanceOf(address).call();
    if (Number(balance) < 1) {
        return [];
    }
    const tokenIds = [];
    for (let i = 0; i < Number(balance); i++) {
        const tokenId = await lockContract.methods.tokenOfOwnerByIndex(address, i).call();
        tokenIds.push(Number(tokenId));
    }
    return tokenIds;
}

export async function createLockAndMerge() {
    const lockSeconds = 60 * 60 * 24 * 30; // 30 hari
    const amountBlack = Math.round((Math.random() * (0.09 - 0.001) + 0.001) * 1000000) / 1000000;
    const value = web3.utils.toWei(amountBlack.toString(), "ether");

    const { balance: blackBalance, allowance: blackAllowance } = await getBalanceAndAllowance(BLACK, ADDRESS, LOCK_CONTRACT);
    if (blackBalance < BigInt(value)) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Saldo BLACK tidak cukup untuk membuat lock.${Colors.RESET}`);
        return false;
    }
    if (blackAllowance < BigInt(value)) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Allowance BLACK tidak cukup, memulai approval...${Colors.RESET}`);
        if (!await approveToken(BLACK, LOCK_CONTRACT, BigInt(value))) return false;
    }

    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.CYAN}Melakukan locking veBLACK sebanyak ${amountBlack} BLACK${Colors.RESET}`);
    if (!await sendTx(lockContract.methods.create_lock, [value, lockSeconds, true], LOCK_CONTRACT)) {
        return false;
    }

    await delay(10000);

    const tokenIds = await getOwnedTokenIds(ADDRESS);
    if (tokenIds.length < 2) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Hanya ada ${tokenIds.length} NFT, merge dilewati.${Colors.RESET}`);
        return true;
    }

    tokenIds.sort((a, b) => a - b);
    const mainToken = tokenIds[0];
    const newToken = tokenIds[tokenIds.length - 1];

    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.CYAN}Merge NFT ${newToken} → ${mainToken}${Colors.RESET}`);
    return await sendTx(lockContract.methods.merge, [newToken, mainToken], LOCK_CONTRACT);
}

export async function sendIncentive() {
    const amount = Math.round((Math.random() * (0.01 - 0.001) + 0.001) * 1000000) / 1000000;
    const reward = web3.utils.toWei(amount.toString(), "ether");

    const { balance: blackBalance, allowance: blackAllowance } = await getBalanceAndAllowance(BLACK, ADDRESS, INCENTIVE_CONTRACT);
    if (blackBalance < BigInt(reward)) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Saldo BLACK tidak cukup untuk send incentive.${Colors.RESET}`);
        return false;
    }
    if (blackAllowance < BigInt(reward)) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Allowance BLACK tidak cukup, memulai approval...${Colors.RESET}`);
        if (!await approveToken(BLACK, INCENTIVE_CONTRACT, BigInt(reward))) return false;
    }

    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.CYAN}Mengirim auto incentive: ${amount} BLACK${Colors.RESET}`);
    return await sendTx(incentiveContract.methods.notifyRewardAmount, [BLACK, reward], INCENTIVE_CONTRACT, 120000);
}

export async function doVeblackOps() {
    console.log(`\n----------------------------------------------------------------------`);
    console.log(`MODE AKTIF: ${Colors.MAGENTA}veBLACK OPERATION${Colors.RESET}`);
    console.log(`----------------------------------------------------------------------`);

    await createLockAndMerge();
    await sendIncentive();

    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Operasi veBLACK selesai${Colors.RESET}`);
    return true;
}
