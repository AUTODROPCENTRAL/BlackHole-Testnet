
import { ADDRESS } from './services/web3Service.js';
import { showBanner, getFormattedTimestamp, Colors, getRandomChoice, delay } from './utils/helpers.js';
import { doSwap } from './services/swapService.js';
import { addLiquidity, claimFees } from './services/liquidityService.js';
import { doVeblackOps } from './services/veBlackService.js';
import { USDC, BTCB, SUPER, PAIR_USDC, PAIR_BTCB, PAIR_SUPER } from './config/constants.js';


const operations = [
    { name: "SWAP", weight: 4 },
    { name: "LIQUIDITY", weight: 2 },
    { name: "CLAIM", weight: 1 },
    { name: "veBLACK", weight: 3 }
];


function selectOperation() {
    const totalWeight = operations.reduce((sum, op) => sum + op.weight, 0);
    const r = Math.random() * totalWeight;
    let current = 0;
    for (const op of operations) {
        current += op.weight;
        if (r < current) {
            return op.name;
        }
    }
}


async function mainLoop() {
    while (true) {
        const selectedOp = selectOperation();

        try {
            switch (selectedOp) {
                case "SWAP":
                    console.log(`\n----------------------------------------------------------------------`);
                    console.log(`MODE AKTIF: ${Colors.MAGENTA}SWAP OPERATION${Colors.RESET}`);
                    console.log(`----------------------------------------------------------------------`);
                    const pick = getRandomChoice(["USDC", "BTCB", "SUPER"]);
                    if (pick === "USDC") {
                        const amount = getRandomChoice([0.01, 0.03, 0.05, 0.07, 0.09]);
                        await doSwap(amount, USDC, PAIR_USDC);
                    } else if (pick === "BTCB") {
                        const amount = getRandomChoice([0.05, 0.07, 0.09]);
                        await doSwap(amount, BTCB, PAIR_BTCB, true);
                    } else if (pick === "SUPER") {
                        const amount = getRandomChoice([0.01, 0.03, 0.05]);
                        await doSwap(amount, SUPER, PAIR_SUPER);
                    }
                    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Operasi SWAP selesai${Colors.RESET}`);
                    break;

                case "LIQUIDITY":
                    console.log(`\n----------------------------------------------------------------------`);
                    console.log(`MODE AKTIF: ${Colors.MAGENTA}LIQUIDITY OPERATION${Colors.RESET}`);
                    console.log(`----------------------------------------------------------------------`);
                    await addLiquidity();
                    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Operasi LIQUIDITY selesai${Colors.RESET}`);
                    break;

                case "CLAIM":
                    console.log(`\n----------------------------------------------------------------------`);
                    console.log(`MODE AKTIF: ${Colors.MAGENTA}CLAIM FEES OPERATION${Colors.RESET}`);
                    console.log(`----------------------------------------------------------------------`);
                    await claimFees();
                    console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.GREEN}Operasi CLAIM selesai${Colors.RESET}`);
                    break;

                case "veBLACK":
                    await doVeblackOps();
                    break;
            }
        } catch (error) {
            console.log(`${Colors.RED}💥 Error utama: ${error.message}${Colors.RESET}`);
        }

        console.log(`\n----------------------------------------------------------------------`);
        console.log(`STATUS: ${Colors.GREEN}Bot siap untuk tugas selanjutnya${Colors.RESET}`);
        console.log(`======================================================================`);

        const waitTime = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
        console.log(`[${getFormattedTimestamp().split(' ')[1]}] ${Colors.YELLOW}Menunggu ${waitTime} detik...${Colors.RESET}`);
        await delay(waitTime * 1000);
    }
}


async function main() {
    showBanner();
    console.log(`[${getFormattedTimestamp()}] ${Colors.CYAN}Inisialisasi bot...${Colors.RESET}`);
    console.log(`[${getFormattedTimestamp()}] ${Colors.GREEN}Wallet Address terdeteksi: ${ADDRESS}${Colors.RESET}\n`);
    console.log(`[${getFormattedTimestamp()}] ${Colors.GREEN}Memulai proses automasi...${Colors.RESET}\n`);

    try {
        await mainLoop();
    } catch (error) {
        console.log(`${Colors.RED}💥 Error fatal: ${error.message}${Colors.RESET}`);
        process.exit(1);
    }
}


process.on('SIGINT', () => {
    console.log(`\n${Colors.RED}🚫 Bot dihentikan oleh pengguna${Colors.RESET}`);
    process.exit(0);
});
process.on('SIGTERM', () => {
    console.log(`\n${Colors.RED}🚫 Bot dihentikan oleh sistem${Colors.RESET}`);
    process.exit(0);
});


main().catch(error => {
    console.error(`${Colors.RED}💥 Gagal memulai bot: ${error.message}${Colors.RESET}`);
    process.exit(1);
});
