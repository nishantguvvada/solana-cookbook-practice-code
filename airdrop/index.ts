import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";

(async () => {

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const keypair = Keypair.generate();

    const airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL
    );
    
    await connection.confirmTransaction(airdropSignature);

    console.log("Public Key: ", keypair.publicKey.toBase58());

    console.log("Airdrop done!");
})();

