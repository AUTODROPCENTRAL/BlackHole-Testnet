
import { web3 } from '../services/web3Service.js';
import { ERC20_ABI } from '../config/abi.js';


export function clearTerminal() {
    process.stdout.write('\x1b[2J\x1b[0f');
}


export function getFormattedTimestamp() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}


export function showBanner() {
    clearTerminal();
    console.log('\x1b[1;36m'); // Warna Cyan
    console.log(' ██████  ██       █████   ██████ ██   ██     ██   ██  ██████  ██      ███████ ');
    console.log(' ██   ██ ██      ██   ██ ██      ██  ██      ██   ██ ██    ██ ██      ██      ');
    console.log(' ██████  ██      ███████ ██      █████       ███████ ██    ██ ██      █████   ');
    console.log(' ██   ██ ██      ██   ██ ██      ██  ██      ██   ██ ██    ██ ██      ██      ');
    console.log(' ██████  ███████ ██   ██  ██████ ██   ██     ██   ██  ██████  ███████ ███████ ');
    console.log('\n======================================================================');
    console.log(`${'AUTODROP CENTRAL'.padStart(35 + 'AUTODROP CENTRAL'.length / 2).padEnd(70)}`);
    console.log(`${'BLACKHOLE TESTNET AUTOMATION BOT'.padStart(35 + 'BLACKHOLE TESTNET AUTOMATION BOT'.length / 2).padEnd(70)}`);
    console.log('======================================================================\x1b[0m'); 
}


export const Colors = {
    RED: '\x1b[91m',
    GREEN: '\x1b[92m',
    YELLOW: '\x1b[93m',
    BLUE: '\x1b[94m',
    MAGENTA: '\x1b[95m',
    CYAN: '\x1b[96m',
    WHITE: '\x1b[97m',
    RESET: '\x1b[0m',
    BOLD: '\x1b[1m',
    UNDERLINE: '\x1b[4m'
};


export async function getGas() {
    return await web3.eth.getGasPrice();
}


export async function getBalanceAndAllowance(tokenAddr, ownerAddr, spenderAddr) {
    const token = new web3.eth.Contract(ERC20_ABI, tokenAddr);
    const [allowance, balance, decimals] = await Promise.all([
        token.methods.allowance(ownerAddr, spenderAddr).call(),
        token.methods.balanceOf(ownerAddr).call(),
        token.methods.decimals().call()
    ]);
    return { balance: BigInt(balance), allowance: BigInt(allowance), decimals: Number(decimals) };
}


export function getRandomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}


export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
