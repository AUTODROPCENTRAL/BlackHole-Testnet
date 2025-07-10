
import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RPC_URL } from '../config/constants.js';
import { Colors } from '../utils/helpers.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const web3 = new Web3(RPC_URL);


function initializeAccount() {
    try {
        const privateKeyPath = path.resolve(path.dirname(process.argv[1]), 'privatekey.txt');
        const PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8').trim();
        if (!PRIVATE_KEY) {
            throw new Error('Private key is empty');
        }
        const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
        return { account, PRIVATE_KEY };
    } catch (error) {
        console.error(`${Colors.RED}❌ Error membaca private key dari privatekey.txt: ${error.message}${Colors.RESET}`);
        console.error(`${Colors.YELLOW}Pastikan file 'privatekey.txt' ada di direktori yang sama dengan index.js dan berisi private key Anda.${Colors.RESET}`);
        process.exit(1);
    }
}

const { account, PRIVATE_KEY } = initializeAccount();
export const wallet = account;
export const privateKey = PRIVATE_KEY;
export const ADDRESS = wallet.address;
