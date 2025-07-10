
import { web3, wallet, privateKey, ADDRESS } from './web3Service.js';
import { getGas, getFormattedTimestamp, Colors, delay } from '../utils/helpers.js';
import { ERC20_ABI } from '../config/abi.js';


export async function sendTx(contractMethod, args, contractAddress, gas = 800000) {
    try {
        const nonce = await web3.eth.getTransactionCount(ADDRESS, 'latest');
        const gasPrice = await getGas();
        console.log(`         Gas Price  : ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);

        const tx = {
            from: ADDRESS,
            to: contractAddress,
            nonce: nonce,
            gas: gas,
            gasPrice: gasPrice,
            data: contractMethod(...args).encodeABI()
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.BLUE}Transaksi terkirim${Colors.RESET}`);
        console.log(`         TX Hash    : ${receipt.transactionHash}`);

        if (receipt.status) {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}TX berhasil${Colors.RESET}`);
            return true;
        } else {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}TX gagal.${Colors.RESET}`);
            return false;
        }
    } catch (error) {
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}TX error: ${error.message}${Colors.RESET}`);
        return false;
    }
}



export async function approveToken(tokenAddress, spenderAddress, amountToApprove) {
    const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Approving ${spenderAddress}...${Colors.RESET}`);
    console.log(`         Address    : ${spenderAddress}`);

    try {
        const nonce = await web3.eth.getTransactionCount(ADDRESS, 'latest');
        const gasPrice = await getGas();
        console.log(`         Gas Price  : ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);
        const maxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

        const tx = {
            from: ADDRESS,
            to: tokenAddress,
            nonce: nonce,
            gas: 100000,
            gasPrice: gasPrice,
            data: tokenContract.methods.approve(spenderAddress, maxUint256).encodeABI()
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        if (receipt.status) {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Approve berhasil${Colors.RESET}`);
            console.log(`         TX Hash    : ${receipt.transactionHash}`);
            await delay(5000); // Tunggu beberapa detik agar approval terkonfirmasi di blockchain
            return true;
        } else {
            console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.RED}Approve gagal.${Colors.RESET}`);
            return false;
        }
    } catch (error) {
        console.error(`${Colors.RED}💥 Error saat approve: ${error.message}${Colors.RESET}`);
        return false;
    }
}
