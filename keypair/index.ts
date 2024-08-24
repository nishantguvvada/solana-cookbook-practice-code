import {Connection, clusterApiUrl, PublicKey, Keypair} from "@solana/web3.js";
import bs58 from 'bs58';
import {generateMnemonic, mnemonicToSeedSync} from 'bip39';
import nacl from 'tweetnacl';


(async()=>{
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    // generate a keypair

    const generateKeypair = () => {
        const keypair = Keypair.generate();
        console.log("Generate Keypair");
        console.log("Keypair: ", keypair);
        console.log("Secret key: ", keypair.secretKey);
        return keypair;
    }

    // restore a keypair

    const restoreKeypairFromSecret = (secret: []) => {
        const keypair = Keypair.fromSecretKey(Uint8Array.from(secret));
        console.log("Restore Keypair from secret");
        console.log("Secret: ", secret);
        console.log("Keypair: ", keypair);
        return keypair;
    }

    const restoreKeypairFromBase58 = (secret: string) => {
        const keypair = Keypair.fromSecretKey(bs58.decode(secret));
        console.log("Restore Keypair from base58")
        console.log("Secret: ", secret);
        console.log("Keypair: ", keypair);
        return keypair;
    }

    // Verify a Keypair

    const verifyKeypair = () => {
        const keypair = generateKeypair();
        const publickey = keypair.publicKey;

        if (keypair.publicKey.toBase58() === publickey.toBase58()) {
            console.log("Keypair verified");
        }
    }

    // Check associated private key = If public key is on the ed25519 curve

    const associatedPrivateKey = () => {
        const keypair = generateKeypair();
        const result = PublicKey.isOnCurve(keypair.publicKey.toBytes());
        console.log("Associated Private Key: ", result);
    }

    // Generate mnemonic

    const mnemonicGeneration = () => {
        const mnemonic = generateMnemonic();
        return mnemonic;
    }

    // Restore a keypair from mnemonic phrase

    const restoreKeypairFromMnemonic = () => {
        const mnemonic = mnemonicGeneration();
        const seed = mnemonicToSeedSync(mnemonic);
        const keypair = Keypair.fromSeed(seed.slice(0, 32));

        console.log("Mnemonic: ", mnemonic);
        console.log("Keypair from mnemonic: ", keypair);
    }

    // Create a vanity address

    const generateVanity = () => {
        let keypair = Keypair.generate();
        while(!keypair.publicKey.toBase58().startsWith("nish")) {
            keypair = Keypair.generate();
        }

        console.log(keypair.publicKey.toBase58());

        return keypair.publicKey.toBase58();
    }

    // Sign and Verify messages with keypair

    const signAndVerify = () => {

        const keypair = Keypair.generate();
        const message = "The quick brown";

        function asciiToBytes(asciiString) {
            return new Uint8Array([...asciiString].map(char => char.charCodeAt(0)));
        }

        const messageBytes = asciiToBytes(message);

        const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
        const result = nacl.sign.detached.verify(
            messageBytes,
            signature,
            keypair.publicKey.toBytes()
        );

        console.log("Result: ", result);
    }

    // verifyKeypair();
    // associatedPrivateKey();
    // restoreKeypairFromMnemonic();
    // generateVanity();
    signAndVerify();

})()