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
const bip39_1 = require("bip39");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"), "confirmed");
    // generate a keypair
    const generateKeypair = () => {
        const keypair = web3_js_1.Keypair.generate();
        console.log("Generate Keypair");
        console.log("Keypair: ", keypair);
        console.log("Secret key: ", keypair.secretKey);
        return keypair;
    };
    // restore a keypair
    const restoreKeypairFromSecret = (secret) => {
        const keypair = web3_js_1.Keypair.fromSecretKey(Uint8Array.from(secret));
        console.log("Restore Keypair from secret");
        console.log("Secret: ", secret);
        console.log("Keypair: ", keypair);
        return keypair;
    };
    const restoreKeypairFromBase58 = (secret) => {
        const keypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(secret));
        console.log("Restore Keypair from base58");
        console.log("Secret: ", secret);
        console.log("Keypair: ", keypair);
        return keypair;
    };
    // Verify a Keypair
    const verifyKeypair = () => {
        const keypair = generateKeypair();
        const publickey = keypair.publicKey;
        if (keypair.publicKey.toBase58() === publickey.toBase58()) {
            console.log("Keypair verified");
        }
    };
    // Check associated private key = If public key is on the ed25519 curve
    const associatedPrivateKey = () => {
        const keypair = generateKeypair();
        const result = web3_js_1.PublicKey.isOnCurve(keypair.publicKey.toBytes());
        console.log("Associated Private Key: ", result);
    };
    // Generate mnemonic
    const mnemonicGeneration = () => {
        const mnemonic = (0, bip39_1.generateMnemonic)();
        return mnemonic;
    };
    // Restore a keypair from mnemonic phrase
    const restoreKeypairFromMnemonic = () => {
        const mnemonic = mnemonicGeneration();
        const seed = (0, bip39_1.mnemonicToSeedSync)(mnemonic);
        const keypair = web3_js_1.Keypair.fromSeed(seed.slice(0, 32));
        console.log("Mnemonic: ", mnemonic);
        console.log("Keypair from mnemonic: ", keypair);
    };
    // Create a vanity address
    const generateVanity = () => {
        let keypair = web3_js_1.Keypair.generate();
        while (!keypair.publicKey.toBase58().startsWith("nish")) {
            keypair = web3_js_1.Keypair.generate();
        }
        console.log(keypair.publicKey.toBase58());
        return keypair.publicKey.toBase58();
    };
    // Sign and Verify messages with keypair
    const signAndVerify = () => {
        const keypair = web3_js_1.Keypair.generate();
        const message = "The quick brown";
        function asciiToBytes(asciiString) {
            return new Uint8Array([...asciiString].map(char => char.charCodeAt(0)));
        }
        const messageBytes = asciiToBytes(message);
        const signature = tweetnacl_1.default.sign.detached(messageBytes, keypair.secretKey);
        const result = tweetnacl_1.default.sign.detached.verify(messageBytes, signature, keypair.publicKey.toBytes());
        console.log("Result: ", result);
    };
    // verifyKeypair();
    // associatedPrivateKey();
    // restoreKeypairFromMnemonic();
    // generateVanity();
    signAndVerify();
}))();
//# sourceMappingURL=index.js.map