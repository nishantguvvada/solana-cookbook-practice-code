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
const spl_token_2 = require("@solana/spl-token");
function createToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
        const alice = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
        //     Mint Public Key:  64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2
        // Mint Account:  {
        //   address: PublicKey [PublicKey(Bx4rttoEYaQCyjhYnC8E4q57z6mLd9Mg4PWEQUptcifo)] {
        //     _bn: <BN: a2b02db6747cb1ad06ae3fd8aa86b2ec74717dfd17cc7aad51bce8f38ef582d6>
        //   },
        //   mint: PublicKey [PublicKey(64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2)] {
        //     _bn: <BN: 4b4862bce3a9c4d01bf5883c2ad8530c4f55530973c75f642ef3d68358744d15>
        //   },
        //   owner: PublicKey [PublicKey(J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4)] {
        //     _bn: <BN: fce46945d80d7f4f74d13fbcff631eb21de7ffc8bff23c24c14165e8c6a26ea9>
        //   }
        const mintPubKey = yield (0, spl_token_1.createMint)(connection, feePayer, alice.publicKey, alice.publicKey, 8);
        const mintAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, feePayer, mintPubKey, alice.publicKey);
        console.log("Mint Public Key: ", mintPubKey.toBase58());
        console.log("Mint Account: ", mintAccount);
    });
}
function getTokenDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const mintPubKey = new web3_js_1.PublicKey("DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs");
        const mintAccountDetails = yield (0, spl_token_1.getMint)(connection, mintPubKey);
        console.log(mintAccountDetails);
    });
}
function getTokenAccountDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
        const mintPubKey = new web3_js_1.PublicKey("DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs");
        const mintAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, feePayer, mintPubKey, feePayer.publicKey);
        console.log("Mint Account: ", mintAccount);
        const tokenAccountDetails = yield (0, spl_token_1.getAccount)(connection, mintAccount.address);
        console.log("Token Account Details : ", tokenAccountDetails);
        // mintAccount and tokenAccountDetails result in the same information
    });
}
function getTokenAccountsBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const tokenAccount = new web3_js_1.PublicKey("eD9PfLq2H8LxsJbH7cJuWfcwqA8coUVs5ZaRKjDiM1d");
        const tokenBalance = yield connection.getTokenAccountBalance(tokenAccount);
        console.log("Token Account : ", tokenAccount.toBase58());
        console.log("Token Balance : ", tokenBalance);
    });
}
function mintTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        const mintPubKey = new web3_js_1.PublicKey("64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2");
        const tokenAccountPubKey = new web3_js_1.PublicKey("Bx4rttoEYaQCyjhYnC8E4q57z6mLd9Mg4PWEQUptcifo");
        const alice = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
        const tokenAmountBefore = yield connection.getTokenAccountBalance(tokenAccountPubKey);
        console.log("Token Amount Before : ", tokenAmountBefore);
        const txhash = yield (0, spl_token_1.mintToChecked)(connection, feePayer, mintPubKey, tokenAccountPubKey, alice, 1e8, 8);
        const tokenAmountAfter = yield connection.getTokenAccountBalance(tokenAccountPubKey);
        const tokenAccountDetails = yield (0, spl_token_1.getMint)(connection, mintPubKey);
        console.log("Token Amount after :", tokenAmountAfter);
        console.log("Token Account Details : ", tokenAccountDetails);
    });
}
function transferTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        // J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
        const alice = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
        const velma = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("5fTMxNL3ryaS69RjSxgFcAVDuPX5hMs7HkHR9mSs3VwYG6WnxDRner4R9tDVN8H1GaE7iPxLDs8nHG429x2owL9w"));
        // 64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2
        const mintPubKey = new web3_js_1.PublicKey("64sbYdAQ7VGPbxKUVhZjUb8Apsqak6fUnTHgJCSqZnq2");
        const tokenAccountPubKeyFrom = new web3_js_1.PublicKey("2c8pyEAEitaYpoud4WAFgRDtzjbxZrcaa85NkmsehDf2");
        const tokenAccountPubKeyTo = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, feePayer, mintPubKey, alice.publicKey);
        let txhash = yield (0, spl_token_1.transferChecked)(connection, feePayer, tokenAccountPubKeyFrom, mintPubKey, tokenAccountPubKeyTo.address, velma, 1e8, 8);
        console.log("Token transferred to :", tokenAccountPubKeyTo);
    });
}
function burnTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        // 8wcKqzyS8jRsorkptP675S7wokurtDjKqCHWRM7Cy9PF
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        const alice = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
        const mintPubKey = new web3_js_1.PublicKey("DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs");
        const tokenAccountPubKey = new web3_js_1.PublicKey("eD9PfLq2H8LxsJbH7cJuWfcwqA8coUVs5ZaRKjDiM1d");
        const txhash = yield (0, spl_token_1.burnChecked)(connection, feePayer, tokenAccountPubKey, mintPubKey, feePayer.publicKey, 1e8, 8);
    });
}
function closeATA() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        const tokenAccountPubKey = new web3_js_1.PublicKey("eD9PfLq2H8LxsJbH7cJuWfcwqA8coUVs5ZaRKjDiM1d");
        const alice = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        let txhash = yield (0, spl_token_1.closeAccount)(connection, feePayer, tokenAccountPubKey, alice.publicKey, alice);
        console.log(`txhash: ${txhash}`);
    });
}
function wrappedSOL() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const feePayer = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("f1fXwJcz1e5nY3B61gnDp6BDS67uE5g2vXvR1WckfpxbwNPqXCDw9pKwHQ1eyGdeW24DwntmaJ78fRbC2vRiFCV"));
        const alice = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("4JXffdfaXNsVHt6Fa9A5GX8CNDHzAyxcxRvs8ZfwTXCM49S9Jiy8XoNaginLGjT6DUKpuL3bbj2dJw3oAzaqv66k"));
        const ata = yield (0, spl_token_1.getAssociatedTokenAddress)(spl_token_2.NATIVE_MINT, alice.publicKey);
        let tx = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
            fromPubkey: alice.publicKey,
            toPubkey: ata,
            lamports: web3_js_1.LAMPORTS_PER_SOL / 10
        }), (0, spl_token_1.createSyncNativeInstruction)(ata));
        console.log(`txhash: ${yield connection.sendTransaction(tx, [feePayer, alice])}`);
    });
}
function fetchAllTokenAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
        const owner = new web3_js_1.PublicKey("J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4");
        let response = yield connection.getParsedTokenAccountsByOwner(owner, {
            programId: spl_token_2.TOKEN_PROGRAM_ID
        });
        response.value.forEach((accountInfo) => {
            console.log(`pubkey: ${accountInfo.pubkey.toBase58()}`);
            console.log(`mint: ${accountInfo.account.data["parsed"]["info"]["mint"]}`);
            console.log(`owner: ${accountInfo.account.data["parsed"]["info"]["owner"]}`);
            console.log(`decimals: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["decimals"]}`);
            console.log(`amount: ${accountInfo.account.data["parsed"]["info"]["tokenAmount"]["amount"]}`);
            console.log("====================");
        });
        // pubkey: DuWFnt8sNSE1hNVqecbgbbrsp24Tjvu41xNQPwpL4Ji4
        // mint: DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs
        // owner: J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
        // decimals: 8
        // amount: 0
        // ====================
        // pubkey: Bx4rttoEYaQCyjhYnC8E4q57z6mLd9Mg4PWEQUptcifo
        // mint: DKs1MDC6M7WWHMaPio7rYLuuexeGyqxrA17NWHswT7bs
        // owner: J2BkNs4cGqh7PAFgTjncMi9FVoiFwzpEuu1yc5H73Mp4
        // decimals: 8
        // amount: 0
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    // createToken();
    // getTokenDetails();
    // getTokenAccountDetails();
    // getTokenAccountsBalance();
    // mintTokens();
    // transferTokens();
    // burnTokens();
    // closeATA();
    // wrappedSOL();
    fetchAllTokenAccounts();
}))();
//# sourceMappingURL=index.js.map