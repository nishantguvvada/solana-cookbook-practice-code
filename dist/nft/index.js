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
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const id_json_1 = __importDefault(require("../id.json"));
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = __importDefault(require("fs"));
const arweave_1 = __importDefault(require("arweave"));
const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = (0, umi_bundle_defaults_1.createUmi)(RPC_ENDPOINT);
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(id_json_1.default));
const myKeypairSigner = (0, umi_1.createSignerFromKeypair)(umi, keypair);
umi.use((0, umi_1.signerIdentity)(myKeypairSigner));
umi.use((0, mpl_token_metadata_1.mplTokenMetadata)());
const mint = (0, umi_1.generateSigner)(umi);
const collectionUpdateAuthority = (0, umi_1.generateSigner)(umi);
const uploadToArweave = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // initialize an arweave instance
        const arweave = arweave_1.default.init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
            timeout: 20000,
            logging: false
        });
        // load the JWK wallet key file from disk
        const wallet = yield arweave.wallets.generate();
        // load the data from disk
        const imageData = fs_1.default.readFileSync(`./op.jpg`);
        // create a data transaction
        let transaction = yield arweave.createTransaction({
            data: imageData
        }, wallet);
        // add a custom tag that tells the gateway how to serve this data to a browser
        transaction.addTag('Content-Type', 'image/jpg');
        // you must sign the transaction with your key before posting
        yield arweave.transactions.sign(transaction, wallet);
        // create an uploader that will seed your data to the network
        let uploader = yield arweave.transactions.getUploader(transaction);
        // run the uploader until it completes the upload.
        while (!uploader.isComplete) {
            yield uploader.uploadChunk();
        }
        console.log("Success!");
        console.log("Transaction ID: ", transaction.id);
        const uri = `https://arweave.net/${transaction.id}`;
        console.log(`https://arweave.net/${transaction.id}`);
        return uri;
    }
    catch (err) {
        console.log("Error: ", err);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const uri = yield uploadToArweave();
    let tx = (0, mpl_token_metadata_1.createNft)(umi, {
        mint: mint,
        authority: collectionUpdateAuthority,
        name: "NGX NFT UMI",
        symbol: "NGX",
        uri: uri, // "https://i.imgur.com/CtKgR3V.jpeg"
        sellerFeeBasisPoints: (0, umi_1.percentAmount)(9.99, 2),
        isCollection: true
    });
    let result = yield tx.sendAndConfirm(umi);
    const signature = bs58_1.default.encode(result.signature);
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);
    console.log("Mint Address: ", mint.publicKey);
}))();
//# sourceMappingURL=index.js.map