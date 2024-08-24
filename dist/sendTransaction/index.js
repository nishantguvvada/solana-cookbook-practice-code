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
const spl_token_1 = require("@solana/spl-token");
const bs58_1 = __importDefault(require("bs58"));
const sendTransaction = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    // const PUBLIC_KEY = new PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4")
    const fromKeypair = web3_js_1.Keypair.generate();
    const toKeypair = web3_js_1.Keypair.generate();
    console.log("Airdropping 1 SOL to ", fromKeypair.publicKey);
    const airdropSignature = yield connection.requestAirdrop(fromKeypair.publicKey, web3_js_1.LAMPORTS_PER_SOL);
    yield connection.confirmTransaction(airdropSignature, "confirmed");
    console.log("Airdrop received by ", fromKeypair.publicKey.toBase58());
    console.log("Sending 1 SOL from ", fromKeypair.publicKey.toBase58());
    const transferTransaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toKeypair.publicKey,
        lamports: web3_js_1.LAMPORTS_PER_SOL / 10
    }));
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transferTransaction, [fromKeypair]);
    console.log("Received 1 SOL by ", toKeypair.publicKey.toBase58());
});
const sendToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    // generate new wallet keypair and airdrop SOL
    const fromWallet = web3_js_1.Keypair.generate();
    const airdropSignature = yield connection.requestAirdrop(fromWallet.publicKey, web3_js_1.LAMPORTS_PER_SOL);
    yield connection.confirmTransaction(airdropSignature, "confirmed");
    // generate new wallet to receive newly minted tokens
    const toWallet = web3_js_1.Keypair.generate();
    // mint a new token
    const mint = yield (0, spl_token_1.createMint)(connection, // connection
    fromWallet, // payer
    fromWallet.publicKey, // mint authority
    null, // freeze authority
    9 // decimals
    );
    // get associated token account of the fromWallet
    const fromTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, // connection
    fromWallet, // payer
    mint, // mint
    fromWallet.publicKey // owner of the token account (mint owner)
    );
    // get associated token account of the toWallet
    const toTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, // connection
    fromWallet, // payer (gas payer)
    mint, // mint
    toWallet.publicKey // owner of the token account
    );
    // minting 1 new token to fromTokenAccount
    yield (0, spl_token_1.mintTo)(connection, fromWallet, mint, fromTokenAccount.address, fromWallet.publicKey, 1000000000, []);
    // transfer token from fromTokenAccount to toTokenAccount
    const transaction = new web3_js_1.Transaction().add((0, spl_token_1.createTransferInstruction)(fromTokenAccount.address, toTokenAccount.address, fromWallet.publicKey, 1));
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [fromWallet]);
    console.log(`Token transfered from ${fromTokenAccount.address} to ${toTokenAccount.address}`);
});
const transactionCost = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const recentBlockhash = yield connection.getLatestBlockhash();
    const fromPublicKey = new web3_js_1.PublicKey("w5ktUQvXGAKexvFCHDDieGMEfB3GmqDttVREQPRM8FW");
    const toPublicKey = new web3_js_1.PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");
    const transaction = new web3_js_1.Transaction({
        recentBlockhash: recentBlockhash.blockhash, // required when using getEstimatedFee method
        feePayer: fromPublicKey
    }).add(web3_js_1.SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports: web3_js_1.LAMPORTS_PER_SOL / 10
    }));
    const fees = yield transaction.getEstimatedFee(connection);
    console.log(`Estimated Fee ${fees} lamports`);
}); // TBD : getFeeForMessage
// Any transaction can add a message along with it
const addMemo = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const TO_PUBLIC_KEY = new web3_js_1.PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");
    const FROM_PUBLIC_KEY = web3_js_1.Keypair.generate();
    const airdropSignature = yield connection.requestAirdrop(FROM_PUBLIC_KEY.publicKey, web3_js_1.LAMPORTS_PER_SOL);
    yield connection.confirmTransaction(airdropSignature, "confirmed");
    console.log("Airdropped 1 SOL");
    const transferTransaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
        fromPubkey: FROM_PUBLIC_KEY.publicKey,
        toPubkey: TO_PUBLIC_KEY,
        lamports: web3_js_1.LAMPORTS_PER_SOL / 10
    }));
    yield transferTransaction.add(new web3_js_1.TransactionInstruction({
        keys: [{ pubkey: FROM_PUBLIC_KEY.publicKey, isSigner: true, isWritable: true }],
        data: Buffer.from("Data to send with the transaction", "utf-8"),
        programId: new web3_js_1.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
    }));
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transferTransaction, [FROM_PUBLIC_KEY]);
    console.log("Message sent using Memo");
});
const computeUnits = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    const payer = new web3_js_1.PublicKey("8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF");
    const payerKeypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
    const toAccount = new web3_js_1.PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");
    const modifyComputeUnits = web3_js_1.ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000
    });
    const addPriorityFee = web3_js_1.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1
    });
    const transaction = new web3_js_1.Transaction().add(modifyComputeUnits).add(addPriorityFee).add(web3_js_1.SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: toAccount,
        lamports: web3_js_1.LAMPORTS_PER_SOL / 100
    }));
    const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [payerKeypair]);
    console.log(signature);
    const result = yield connection.getParsedTransaction(signature);
    console.log(result);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // sendTransaction(connection);
    // sendToken();
    // transactionCost();
    // addMemo();
    computeUnits();
}))();
//# sourceMappingURL=index.js.map