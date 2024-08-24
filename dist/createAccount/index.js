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
const createSystemAccount = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const fromKeypair = web3_js_1.Keypair.generate();
    const newAccountKeypair = web3_js_1.Keypair.generate();
    const space = 0;
    const rentExemption = yield connection.getMinimumBalanceForRentExemption(space);
    const airdropSignature = yield connection.requestAirdrop(fromKeypair.publicKey, web3_js_1.LAMPORTS_PER_SOL);
    console.log("Airdropped 1 SOL");
    const createAccountTransaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccount({
        fromPubkey: fromKeypair.publicKey,
        newAccountPubkey: newAccountKeypair.publicKey,
        lamports: rentExemption,
        space,
        programId: web3_js_1.SystemProgram.programId
    }));
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, createAccountTransaction, [fromKeypair]);
    console.log("Account created!", newAccountKeypair.publicKey.toBase58());
});
const calculateAccountCost = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const dataLength = 100;
    const rentExemptionAmount = yield connection.getMinimumBalanceForRentExemption(dataLength);
    console.log("Rent Exemption Amount is ", { rentExemptionAmount });
});
const createAccountwithSeeds = () => __awaiter(void 0, void 0, void 0, function* () {
    // connection
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
    const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
    // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
    const base = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
    let basePubkey = base.publicKey;
    let seed = "nish001";
    let programId = web3_js_1.SystemProgram.programId;
    let derived = yield web3_js_1.PublicKey.createWithSeed(basePubkey, seed, programId);
    const createAccountTx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.createAccountWithSeed({
        fromPubkey: feePayer.publicKey, // funder
        newAccountPubkey: derived,
        basePubkey: basePubkey,
        seed: seed,
        lamports: 1e8, // 0.1 SOL
        space: 0,
        programId: programId,
    }));
    console.log(`txhash: ${yield (0, web3_js_1.sendAndConfirmTransaction)(connection, createAccountTx, [
        feePayer,
        base,
    ])}`);
    console.log("Derived public key for the account : ", derived.toBase58());
    // Transfer
    const transferTx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
        fromPubkey: derived,
        basePubkey: basePubkey,
        toPubkey: web3_js_1.Keypair.generate().publicKey, // create a random receiver
        lamports: 0.01 * web3_js_1.LAMPORTS_PER_SOL,
        seed: seed,
        programId: programId,
    }));
    console.log(`txhash: ${yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transferTx, [
        feePayer,
        base,
    ])}`);
});
const generatePDA = () => __awaiter(void 0, void 0, void 0, function* () {
    const programId = new web3_js_1.PublicKey("G1DCNUQTSGHehwdLCAmRyAG8hf51eCHrLNUqkgGKYASj");
    let [pda, bump] = yield web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("test")], programId);
    console.log(`bump: ${bump}, pubkey: ${pda.toBase58()}`);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // createSystemAccount();
    // calculateAccountCost();
    // createAccountwithSeeds();
}))();
//# sourceMappingURL=index.js.map