import {Connection, clusterApiUrl, Keypair, PublicKey} from "@solana/web3.js";

(async() => {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    // const keypair = Keypair.generate();

    const publicKey = new PublicKey("ASGDssDWLc8CwpyLhVpi2wPRrSxnkXSxUf7y91bAPH1T")

    console.log("Public Key: ", publicKey);

    const walletBalance = await connection.getBalance(publicKey);

    console.log("Wallet Balance: ", walletBalance);

})()