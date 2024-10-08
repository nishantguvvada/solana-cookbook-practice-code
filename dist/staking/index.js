"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const getValidators = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const { current, delinquent } = yield connection.getVoteAccounts();
    console.log("current validators: ", current);
    console.log("all validators: ", current.concat(delinquent));
});
const createStakeAccount = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const wallet = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
    const stakeAccount = web3_js_1.Keypair.generate();
    const minimumRent = yield connection.getMinimumBalanceForRentExemption(web3_js_1.StakeProgram.space);
    const amountUserWantsToStake = web3_js_1.LAMPORTS_PER_SOL / 2;
    const amountToStake = minimumRent + amountUserWantsToStake;
    console.log("Amount to rent: ", minimumRent);
    console.log("Amount user wants to stake : ", amountUserWantsToStake);
    console.log("Total Amount to Stake: ", amountToStake);
    const createStakeAccountTx = web3_js_1.StakeProgram.createAccount({
        authorized: new web3_js_1.Authorized(wallet.publicKey, wallet.publicKey),
        fromPubkey: wallet.publicKey,
        lamports: amountToStake,
        lockup: new web3_js_1.Lockup(0, 0, wallet.publicKey), // optional
        stakePubkey: stakeAccount.publicKey
    });
    const createStakeAccountTxId = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, createStakeAccountTx, [
        wallet,
        stakeAccount
    ]);
    console.log(`Stake account created. Tx Id: ${createStakeAccountTxId}`);
    console.log("Stake Account Public Key: ", stakeAccount.publicKey);
    console.log("Stake Account Private Key: ", stakeAccount.secretKey);
    // Check our newly created stake account balance. This should be 0.5 SOL.
    let stakeBalance = yield connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
    // Verify the status of our stake account. This will start as inactive and will take some time to activate.
    // let stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
    // console.log(`Stake account status: ${stakeStatus.state}`);
    // https://github.com/solana-developers/solana-rpc-get-stake-activation
});
const delegateStake = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const wallet = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
    const stakeAccount = web3_js_1.Keypair.fromSecretKey(new Uint8Array([
        2, 32, 140, 146, 207, 225, 45, 253, 60, 69, 121,
        177, 94, 195, 46, 154, 15, 195, 245, 66, 68, 234,
        168, 105, 255, 152, 97, 17, 214, 190, 69, 166, 49,
        105, 136, 205, 0, 130, 20, 251, 100, 120, 214, 213,
        252, 115, 99, 25, 204, 97, 245, 108, 222, 208, 229,
        69, 49, 115, 104, 6, 190, 82, 7, 200
    ]));
    const validators = yield connection.getVoteAccounts();
    const selectedValidator = validators.current[0];
    console.log("Selected Validator :", selectedValidator);
    const selectedValidatorPublicKey = new web3_js_1.PublicKey(selectedValidator.votePubkey);
    const delegateStakeTx = web3_js_1.StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        votePubkey: selectedValidatorPublicKey
    });
    const delegateTxId = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, delegateStakeTx, [
        wallet,
    ]);
    console.log(`Stake account ${stakeAccount.publicKey.toBase58()} delegated to ${selectedValidatorPublicKey.toBase58()}. Tx Id: ${delegateTxId}`);
    //   Selected Validator : {
    //     activatedStake: 2000038614489280,
    //     commission: 100,
    //     epochCredits: [
    //       [ 741, 95066909, 88210110 ],
    //       [ 742, 101967908, 95066909 ],
    //       [ 743, 108866743, 101967908 ],
    //       [ 744, 115745152, 108866743 ],
    //       [ 745, 118088752, 115745152 ]
    //     ],
    //     epochVoteAccount: true,
    //     lastVote: 321986735,
    //     nodePubkey: 'Cw6X5R68muAyGRCb7W8ZSP2YbaRjwMs1t5sBEPkhdwbM',
    //     rootSlot: 321986704,
    //     votePubkey: '7AETLyAGJWjp6AWzZqZcP362yv5LQ3nLEdwnXNjdNwwF'
    //   }
    //   Stake account 4KtK7gBwigMobkwMr4eFU1AVAg2ShrHa1rrghgPZFMdZ delegated to 7AETLyAGJWjp6AWzZqZcP362yv5LQ3nLEdwnXNjdNwwF. Tx Id: 48wNY9dvvUoxMHSFBekvqg8tTQC7iSxXgACate3xZ4HzYBcK6gmR9hTW9ukfkE2HKQUjamKMotow5LNexRoY43YF
});
const viewAllDelegators = () => __awaiter(void 0, void 0, void 0, function* () {
    const STAKE_PROGRAM_ID = new web3_js_1.PublicKey("Stake11111111111111111111111111111111111111");
    const VOTE_PUB_KEY = "7AETLyAGJWjp6AWzZqZcP362yv5LQ3nLEdwnXNjdNwwF";
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const accounts = yield connection.getParsedProgramAccounts(STAKE_PROGRAM_ID, {
        filters: [
            {
                dataSize: 200,
            },
            {
                memcmp: {
                    offset: 124,
                    bytes: VOTE_PUB_KEY
                }
            }
        ]
    });
    console.log(`Accounts for program ${STAKE_PROGRAM_ID}: `);
    console.log(`Total number of delegators found for ${VOTE_PUB_KEY} is: ${accounts.length}`);
    for (let i = 0; i <= accounts.length; i++) {
        console.log(`Sample delegator ${i}:`, JSON.stringify(accounts[i]));
    }
});
const deactivateStake = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const wallet = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
    const stakeAccount = web3_js_1.Keypair.fromSecretKey(new Uint8Array([
        2, 32, 140, 146, 207, 225, 45, 253, 60, 69, 121,
        177, 94, 195, 46, 154, 15, 195, 245, 66, 68, 234,
        168, 105, 255, 152, 97, 17, 214, 190, 69, 166, 49,
        105, 136, 205, 0, 130, 20, 251, 100, 120, 214, 213,
        252, 115, 99, 25, 204, 97, 245, 108, 222, 208, 229,
        69, 49, 115, 104, 6, 190, 82, 7, 200
    ]));
    const deactivateTx = web3_js_1.StakeProgram.deactivate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey
    });
    const deactivateTxId = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, deactivateTx, [wallet]);
    console.log(`Stake account deactivated :`, deactivateTxId);
});
const withdrawStake = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const wallet = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
    const stakeAccount = web3_js_1.Keypair.fromSecretKey(new Uint8Array([
        2, 32, 140, 146, 207, 225, 45, 253, 60, 69, 121,
        177, 94, 195, 46, 154, 15, 195, 245, 66, 68, 234,
        168, 105, 255, 152, 97, 17, 214, 190, 69, 166, 49,
        105, 136, 205, 0, 130, 20, 251, 100, 120, 214, 213,
        252, 115, 99, 25, 204, 97, 245, 108, 222, 208, 229,
        69, 49, 115, 104, 6, 190, 82, 7, 200
    ]));
    let stakeBalance = yield connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
    const withdrawTx = web3_js_1.StakeProgram.withdraw({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: stakeBalance
    });
    const withdrawTxId = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, withdrawTx, [
        wallet,
    ]);
    console.log(`Stake account withdrawn. Tx Id: ${withdrawTxId}`);
    // Confirm that our stake account balance is now 0
    stakeBalance = yield connection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / web3_js_1.LAMPORTS_PER_SOL} SOL`);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // getValidators();
    // createStakeAccount();
    // delegateStake();
    // viewAllDelegators();
    // deactivateStake();
    withdrawStake();
}))();
//# sourceMappingURL=index.js.map