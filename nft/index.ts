import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import wallet from "../id.json"
import base58 from "bs58";
import fs from "fs";
import Arweave from 'arweave';
import walletFile from "../walletFile.json";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);
const collectionUpdateAuthority = generateSigner(umi);

const uploadToArweave = async () => {

    try {
        // initialize an arweave instance
        const arweave = Arweave.init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
            timeout: 20000,
            logging: false
        });

        // load the JWK wallet key file from disk
        const wallet = await arweave.wallets.generate();

        // load the data from disk
        const imageData = fs.readFileSync(`./op.jpg`);

        // create a data transaction
        let transaction = await arweave.createTransaction({
        data: imageData
        }, wallet);

        // add a custom tag that tells the gateway how to serve this data to a browser
        transaction.addTag('Content-Type', 'image/jpg');

        // you must sign the transaction with your key before posting
        await arweave.transactions.sign(transaction, wallet);

        // create an uploader that will seed your data to the network
        let uploader = await arweave.transactions.getUploader(transaction);

        // run the uploader until it completes the upload.
        while (!uploader.isComplete) {
        await uploader.uploadChunk();
        }

        console.log("Success!");

        console.log("Transaction ID: ", transaction.id);


        const uri = `https://arweave.net/${transaction.id}`;
        console.log(`https://arweave.net/${transaction.id}`);

        return uri;

    } catch(err) {

        console.log("Error: ", err);

    }

}

(async()=>{
    
    const uri = await uploadToArweave();

    let tx = createNft(umi, {
        mint: mint,
        authority: collectionUpdateAuthority,
        name: "NGX NFT UMI",
        symbol: "NGX",
        uri: uri, // "https://i.imgur.com/CtKgR3V.jpeg"
        sellerFeeBasisPoints: percentAmount(9.99, 2),
        isCollection: true
    });
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);

    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`);

    console.log("Mint Address: ", mint.publicKey);
})();